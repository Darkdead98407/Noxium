const fs = require('fs');
const path = require('path');

const DEFAULT_API_URL = process.env.WAFU_API_URL || 'https://api.fluxpoint.dev/nsfw/gif/';

// Editable default tags: cambia aquí para probar diferentes tags por defecto
const DEFAULT_INCLUDED_TAGS = ['hentai'];

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  if (controller) options.signal = controller.signal;

  const timer = controller
    ? setTimeout(() => controller.abort(), timeout)
    : null;

  try {
    // In Node <18, global fetch may be undefined. User can install node-fetch if needed.
    if (typeof fetch !== 'function') {
      throw new Error('`fetch` is not available in this Node runtime. Use Node 18+ or install `node-fetch`.');
    }

    const res = await fetch(url, options);
    return res;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function buildQuery(params) {
  const q = new URLSearchParams();
  // Use repeated `included_tags` parameters (no brackets). Example:
  // ?included_tags=ero&included_tags=hentai
  if (params.included_tags && Array.isArray(params.included_tags)) {
    params.included_tags.forEach(t => q.append('included_tags', String(t)));
  }
  if (params.min_height) q.set('min_height', String(params.min_height));
  if (params.page) q.set('page', String(params.page));
  return q.toString();
}

async function downloadToFile(url, destPath) {
  const res = await fetchWithTimeout(url, {}, 15000);
  if (!res.ok) throw new Error(`Image download failed: ${res.status}`);
  const buffer = await res.arrayBuffer();
  await fs.promises.writeFile(destPath, Buffer.from(buffer));
}

async function ensureDir(dirPath) {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

/**
 * Query waifu.im (or compatible) API and save first image to disk.
 * options: { includedTags: string[], minHeight: number, attempts: number }
 * Returns: { ok: boolean, data?: object, savedFile?: string, error?: string }
 */
async function searchWaifu(options = {}) {
  const apiUrl = options.apiUrl || DEFAULT_API_URL;
  const includedTags = Array.isArray(options.includedTags) ? options.includedTags : [];
  const minHeight = options.minHeight ? Number(options.minHeight) : null;
  const attempts = Number(options.attempts) || 2;

  // Basic validation
  if (includedTags.length === 0) return { ok: false, error: 'includedTags must be a non-empty array' };
  if (minHeight !== null && Number.isNaN(minHeight)) return { ok: false, error: 'minHeight must be a number' };

  const params = {
    included_tags: includedTags,
    min_height: minHeight,
  };

  const queryStr = buildQuery({ included_tags: includedTags, min_height: minHeight });
  const url = queryStr ? `${apiUrl}?${queryStr}` : apiUrl;

  let lastError = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetchWithTimeout(url, { headers: { 'Accept': 'application/json' } }, 10000);
      if (!res.ok) {
        lastError = `Status ${res.status}`;
        continue;
      }
      const json = await res.json();

      // The exact response schema depends on the API; try common patterns.
      const images = json.images || json.results || json.data || [];
      if (!Array.isArray(images) || images.length === 0) {
        return { ok: false, error: 'No images returned by API', data: json };
      }

      // Prefer image.url or image.image or direct url fields
      const first = images[0];
      const imageUrl = first.url || first.image || (typeof first === 'string' ? first : null);
      if (!imageUrl) {
        return { ok: false, error: 'No image URL found in API response', data: first };
      }

      const imagesDir = path.join(process.cwd(), 'imagenes de pruebas');
      await ensureDir(imagesDir);

      const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
      const fileName = `waifu_${Date.now()}${ext}`;
      const dest = path.join(imagesDir, fileName);

      await downloadToFile(imageUrl, dest);

      return { ok: true, data: json, savedFile: dest };
    } catch (err) {
      lastError = err.message || String(err);
      // small backoff
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }

  return { ok: false, error: `All attempts failed: ${lastError}` };
}

// If the file is executed directly, run a demo query.
if (require.main === module) {
  (async () => {
    const res = await searchWaifu({ includedTags: ['hentai'], minHeight: 2000, attempts: 3 });
    if (res.ok) console.log('Saved image to:', res.savedFile);
    else console.error('Search failed:', res.error, res.data ? `API data: ${JSON.stringify(res.data).slice(0,200)}` : '');
  })();
}

module.exports = { searchWaifu };
