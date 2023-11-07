const Discord = require("discord.js");
const loadDB = require("../Loaders/loadDatabase");
const loadSlashCommands = require("../Loaders/loadSlashCommands");

module.exports = async (bot) => {

    bot.db = await loadDB();
    bot.db.connect(function () {
        
        console.log("Base de donnée connectée !");
    })

    await loadSlashCommands(bot);
    
    console.log(`${bot.user.tag} est bien en ligne !`);
}