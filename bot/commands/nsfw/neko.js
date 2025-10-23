const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("neko")
        .setDescription("Envía una imagen de neko (NSFW)."),

    async execute(interaction) {
        try {

            await interaction.deferReply();
            const response = await axios.get("https://api.waifu.pics/nsfw/neko");
            const img = response.data.url;

            const embed = new EmbedBuilder()
                .setTitle("Aquí tienes tu neko 🔥")
                .setImage(img)
                .setColor("Random");


            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: "Hubo un error al obtener la imagen. Inténtalo de nuevo más tarde.", flags: 64 });
            } else {
                await interaction.reply({ content: "Hubo un error al obtener la imagen. Inténtalo de nuevo más tarde.", flags: 64 });
            }
        }
    }
};
