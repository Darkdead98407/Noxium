const { bot } = require('./bot/index');
const { server } = require('./server/');

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Promesa no manejada:', promise, 'razón:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('💥 Error no capturado:', err);
});

// Ejecuta ambos en el mismo proceso
(async () => {
  try {
    console.log('🚀 Iniciando bot de Discord...');
    await bot();

    console.log('🌐 Iniciando servidor Express...');
    server();
  } catch (error) {
    console.error('🔥 Error al iniciar el sistema:', error);
    process.exit(1);
  }
})();