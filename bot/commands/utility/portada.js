
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('portada')
        .setDescription('Obtiene la imagen de portada del servidor.'),

    async execute(interaction) {
        const guild = interaction.guild;

        if (guild.banner) {
            const bannerURL = guild.bannerURL({ format: 'png', size: 4096 });
            await interaction.reply(`La imagen de portada del servidor es: ${bannerURL}`);
        } else {
            await interaction.reply('Este servidor no tiene una imagen de portada.');
        }
    },
};