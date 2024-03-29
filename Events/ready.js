const Discord = require("discord.js");
const loadDB = require("../Loaders/loadDatabase");
const loadSlashCommands = require("../Loaders/loadSlashCommands");

module.exports = async (bot) => {
    
    try {
        bot.db = await loadDB();

        await loadSlashCommands(bot);

        console.log(`${bot.user.tag} est bien en ligne !`);
    } catch (err) {
        console.error("Erreur lors de la connexion à la base de données : ", err);
    }
}