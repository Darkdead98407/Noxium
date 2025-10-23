const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Muestra el ícono o portada del servidor'),
    async execute(interaction) {
        const guild = interaction.guild;

        // Obtener el ícono del servidor
        const iconURL = guild.iconURL({ dynamic: true, size: 1024 });
        
        // Obtener la portada del servidor (banner)
        const bannerURL = guild.bannerURL({ size: 1024 });

        if (!iconURL && !bannerURL) {
            return interaction.reply('Este servidor no tiene ícono ni portada.');
        }

        const embed = {
            color: 0x0099ff,
            title: `Imágenes de ${guild.name}`,
            fields: [],
            timestamp: new Date(),
        };

        if (iconURL) {
            embed.fields.push({ name: 'Ícono del servidor', value: `[Descargar](${iconURL})` });
            embed.image = { url: iconURL };
        }

        if (bannerURL) {
            embed.fields.push({ name: 'Portada del servidor', value: `[Descargar](${bannerURL})` });
            // Si no hay ícono, usa el banner como imagen principal
            if (!iconURL) embed.image = { url: bannerURL };
        }

        await interaction.reply({ embeds: [embed] });
    },
};