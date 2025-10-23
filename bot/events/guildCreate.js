const { Events } = require('discord.js');
const { loadData, saveData } = require('../utils/fileStorage');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        try {
            console.log(`🎉 Bot añadido a nuevo servidor: ${guild.name}`);

            // Cargar configuración actual
            const settings = await loadData('botSettings.json', {
                guildsSettings: {}
            });

            // Añadir configuración por defecto para el nuevo servidor
            settings.guildsSettings[guild.id] = {
                name: guild.name,
                id: guild.id,
                joinedAt: new Date().toISOString(),
                roles: {
                    admin: null,
                    dev: null,
                    user: null
                },
                channels: {
                    welcome: null,
                    counting: null,
                    tickets: null,
                    commands: null,
                    minigames: null,
                    ai: null,
                    verification: null,
                    authors: null,
                    nsfw: null
                },
                authorCategories: {
                    colors: [],
                    platform: ['Java', 'Bedrock'],
                    age: ['18+', '-18']
                }
            };

            // Guardar configuración actualizada
            await saveData('botSettings.json', settings);
            console.log(`✅ Configuración guardada para: ${guild.name}`);

        } catch (error) {
            console.error(`❌ Error al guardar configuración para ${guild.name}:`, error);
        }
    }
};