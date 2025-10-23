const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Define qué tags son NSFW y cuáles no
const CATEGORY_MAP = {
    waifu: { nsfw: false },
    maid: { nsfw: false },
    uniform: { nsfw: false },
    ero: { nsfw: true },
    ecchi: { nsfw: true },
    hentai: { nsfw: true },
    oral: { nsfw: true },
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Genera una imagen de waifu')
        .addStringOption(option =>
            option.setName('categoria')
                .setDescription('Categoría de la imagen')
                .setRequired(true)
                .addChoices(
                    { name: 'Waifu', value: 'waifu' },
                    { name: 'Maid', value: 'maid' },
                    { name: 'Uniform', value: 'uniform' },
                    { name: 'Ero', value: 'ero' },
                    { name: 'Ecchi', value: 'ecchi' },
                    { name: 'Hentai', value: 'hentai' },
                    { name: 'Oral', value: 'oral' }
                )
        ),

    async execute(interaction) {
        const categoria = interaction.options.getString('categoria');
        const info = CATEGORY_MAP[categoria];

        // Chequea NSFW
        if (info.nsfw && !interaction.channel.nsfw) {
            return interaction.reply({
                content: '❌ Esta categoría solo puede usarse en canales NSFW.',
                ephemeral: true
            });
        }

        try {
            // DeferReply evita el "Unknown interaction" si la API tarda
            await interaction.deferReply();

            const response = await fetch(`https://api.waifu.im/search/?included_tags=${categoria}`);
            if (!response.ok) throw new Error(`API respondió ${response.status}`);

            const data = await response.json();
            if (!data.images || data.images.length === 0) {
                return interaction.editReply('⚠️ No encontré imágenes para esa categoría.');
            }
            
            const imageUrl = data.images[0].url;
            const embed = new EmbedBuilder()
                .setTitle('Hola soy tu waifu ♥️')
                .setColor('Random')
                .setImage('attachment://waifu.png')
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            await interaction.editReply({ 
                embeds: [embed],
                files: [{ attachment: imageUrl, name: 'waifu.png' }]
             });

            // Reacciones opcionales si el bot tiene permiso
            try {
                if (interaction.guild && interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.AddReactions)) {
                    await message.react('👍');
                    await message.react('👎');
                }
            } catch (err) {
                console.warn('No se pudieron agregar reacciones:', err.message);
            }
        } catch (error) {
            console.error('Error al obtener waifu:', error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply('❌ Hubo un error al generar tu waifu.');
            } else {
                await interaction.reply({ content: '❌ Hubo un error al generar tu waifu.', ephemeral: true });
            }
        }
    }
};
