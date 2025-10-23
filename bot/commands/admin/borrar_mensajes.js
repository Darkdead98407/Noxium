const { SlashCommandBuilder } = require('discord.js');
const { hasPermission } = require('../../utils/permissionsManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('borrar_mensajes')
        .setDescription('Borra los mensajes de un canal.'),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const member = interaction.member;

        if (!hasPermission(guildId, member, 'admin')) {
            return interaction.reply({ content: 'No tienes permiso para usar este comando.', flags: 64 });
        }

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({ content: 'No tienes permiso para realizar esta acción.', flags: 64 });
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            await interaction.channel.bulkDelete(messages);
            await interaction.reply({ content: '¡Mensajes borrados!', flags: 64 });
        } catch (error) {
            console.error('Error al borrar mensajes:', error);
            await interaction.reply({ content: 'Hubo un error al borrar los mensajes.', flags: 64 });
        }
    }
};
