const Discord = require("discord.js");

module.exports = async (db, config, table) => {

    try {
        const selectQuery = `SELECT id FROM ${table} WHERE guildID = ? AND channelID = ? AND messageID = ? AND roleID = ? AND emoji = ?`;
        const selectValue = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
        const [result] = await db.promise().query(selectQuery, selectValue);

        if (result.length > 0) {
            return result[0].id;
        } else {
            throw new Error("Configuration non trouvée.");
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de l'ID de configuration : ", err);
        throw err;
    }
}