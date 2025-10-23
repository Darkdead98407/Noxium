// prefix/anime/actions.js

const { EmbedBuilder } = require('discord.js');
const animeActions = require('anime-actions');

// Definición de todos los comandos y aliases que manejará este archivo
const ANIME_COMMANDS = ['hug', 'kiss', 'pat', 'punch', 'slap', 'bite', 'bonk', 'cry', 'dance'];

module.exports = {
    // Definimos el comando principal (puede ser el primero de la lista o 'help')
    name: 'help', 
    aliases: [...ANIME_COMMANDS], // Añadimos todos los comandos como aliases
    
    // El método execute recibirá el mensaje y los argumentos (args)
    async execute(message, args, commandName) {
        
        // 1. Manejar el comando !help (o el nombre principal)
        if (commandName === 'help') {
            const embed = new EmbedBuilder()
                .setColor('#FF69B4')
                .setTitle('🎭 Comandos de Anime Disponibles')
                .setDescription('Lista de todos los comandos de anime y sus descripciones:')
                .addFields([
                    { name: '!hug @usuario', value: '¡Da un abrazo cálido y reconfortante! 🤗', inline: true },
                    { name: '!kiss @usuario', value: '¡Comparte un dulce beso! 💋', inline: true },
                    { name: '!pat @usuario', value: '¡Da unas palmaditas cariñosas! 🤚', inline: true },
                    { name: '!punch @usuario', value: '¡Dale un puñetazo anime style! 👊', inline: true },
                    { name: '!slap @usuario', value: '¡Una bofetada con todo el poder! ✋', inline: true },
                    { name: '!bite @usuario', value: '¡Muerde juguetonamente! 😬', inline: true },
                    { name: '!bonk @usuario', value: '¡Dale un golpecito en la cabeza a! 🔨', inline: true },
                    { name: '!cry', value: '¡Muestra tus lágrimas anime! 😢', inline: true },
                    { name: '!dance', value: '¡Baila de felicidad! 💃', inline: true }
                ])
                .setFooter({ text: 'Usa estos comandos con el prefijo !' })
                .setTimestamp();

            return await message.reply({ embeds: [embed] });
        }

        // 2. Manejar comandos de acción (anime)
        try {
            let url;
            const target = message.mentions.users.first();
            
            // Comandos que no requieren target
            if (commandName === 'cry' || commandName === 'dance') {
                url = await animeActions[commandName]();
                const embed = new EmbedBuilder()
                    .setColor('#FF69B4')
                    .setDescription(`${message.author} ${getActionText(commandName)}`)
                    .setImage(url)
                    .setTimestamp();

                return await message.reply({ embeds: [embed] });
            }

            // Comandos que requieren target
            if (!target) {
                return await message.reply(`¡Necesitas mencionar a un usuario para ${commandName}! Por ejemplo: !${commandName} @usuario`);
            }

            url = await animeActions[commandName]();
            const embed = new EmbedBuilder()
                .setColor('#FF69B4')
                .setDescription(`${message.author} ${getActionText(commandName)} ${target}${getSuffix(commandName)}`)
                .setImage(url)
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`Error al ejecutar el comando ${commandName}:`, error);
            await message.reply('Hubo un error al ejecutar el comando. ¡Inténtalo de nuevo!');
        }
    }
};

// Funciones utilitarias (extraídas de tu messageCreate.js)
function getActionText(action) {
    const actions = {
        hug: 'abraza a',
        kiss: 'besa a',
        pat: 'acaricia a',
        punch: 'golpea a',
        slap: 'abofetea a',
        bite: 'muerde a',
        bonk: 'le da un golpe en la cabeza a',
        cry: 'está llorando',
        dance: 'está bailando'
    };
    return actions[action] || 'interactúa con';
}

function getSuffix(action) {
    const suffixes = {
        hug: '!',
        kiss: '!',
        pat: '!',
        punch: '!',
        slap: '!',
        bite: '!',
        bonk: '!'
    };
    return suffixes[action] || '';
}