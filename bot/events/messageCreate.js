const { Events } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getGuildConfig } = require("../utils/guildDataManager");
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config(); 

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignorar mensajes de bots o que no son de un servidor (DM)
        if (message.author.bot || !message.guildId) return;

        try {
            // 1. Lógica de Conteo (si aplica)
            if (message.client.config?.channels?.counting && message.channel.id === message.client.config.channels.counting) {
                message.client.emit('CountingMessage', message);
                return;
            }

            const guildConfig = await getGuildConfig(message.guildId);

            // 2. Lógica de Chat AI (si aplica)
            if (guildConfig?.chatChannel && message.channel.id === guildConfig.chatChannel) {
                try {
                    const MODEL = "gemini-pro";
                    // Simplificar la búsqueda de la clave de API
                    const API_KEY = process.env.GOOGLE_AI_KEY || message.client.config?.api?.googleAI;

                    if (!API_KEY) {
                        console.error('❌ Google AI API key no configurada.');
                        return;
                    }

                    const ai = new GoogleGenerativeAI(API_KEY);
                    const model = ai.getGenerativeModel({ model: MODEL });

                    const personalityFilePath = path.join(__dirname, "../data/personality.txt");
                    const personalityContent = await fs.readFile(personalityFilePath, 'utf-8');

                    const prompt = `${personalityContent}\n\nInstructions:\n1. Greet user: <@${message.author.id}>\n2. Respond to: ${message.cleanContent}\n3. Keep response under 2000 characters.`;

                    const { response } = await model.generateContent(prompt);
                    let responseText = response?.text?.() || response?.text || String(response) || 'Lo siento, la IA no devolvió una respuesta válida.';

                    if (responseText.length > 1997) responseText = responseText.slice(0, 1997) + '...';

                    await message.reply({ content: responseText, allowedMentions: { parse: ["users"] } });
                } catch (error) {
                    console.error("Error en chat AI:", error);
                }
                return;
            }

            // 3. Manejar Comandos de Prefijo (Lógica Centralizada)
            const prefix = guildConfig?.prefix || message.client.config?.prefix || '!';
            if (!message.content.startsWith(prefix)) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            // El nombre del comando se necesita para buscar en la colección y para la ejecución interna
            const commandName = args.shift().toLowerCase(); 

            // Buscar en la colección de comandos de prefijo (incluye aliases)
            const command = message.client.prefixCommands.get(commandName);

            if (command) {
                console.log(`📝 [DEBUG] Ejecutando comando de prefijo: ${commandName}`);
                try {
                    // Pasar el commandName para que el comando anime pueda saber qué acción ejecutar
                    await command.execute(message, args, commandName); 
                } catch (error) {
                    console.error(`Error al ejecutar comando de prefijo ${commandName}:`, error);
                    await message.reply('Hubo un error al ejecutar ese comando. ¡Inténtalo de nuevo!');
                }
            }
            
        } catch (error) {
            console.error('Error en messageCreate:', error);
        }
    }
};