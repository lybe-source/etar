const Discord = require("discord.js");

module.exports = {

    name: "ping",
    description: "Affiche la latence",
    permission: "Aucune",
    dm: false, // Allow or not to dm the bot with this command
    category: "Information",

    async run(bot, message, args) {

        await message.reply(`Ping : \`${bot.ws.ping}\``)
    }
}