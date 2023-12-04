const Discord = require("discord.js");

module.exports = async (db, config, table) => {

    try {
        const selectQuery = `SELECT id FROM ${table} WHERE guildID = ? AND channelID = ? AND messageID = ? AND roleID = ? AND emoji = ?`;
        const selectValue = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
        const [result] = await db.promise().query(selectQuery, selectValue);

        if (result.length > 0) {
            const configID = result[0].id;
            console.log(`Configuration ${table} trouvée. ID : `, configID); // Modifier ici, ce ne sera pas toujours giveway
            return configID;
        } else {
            const insertQuery = `INSERT INTO ${table} (guildID, channelID, messageID, roleID, emoji) VALUES (?, ?, ?, ?, ?)`;
            const insertValues = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
            const [insertResult] = await db.promise().query(insertQuery, insertValues);

            const configID = insertResult.insertId;
            console.log(`Configuration ${table} insérée avec succès. ID : `, configID); // Modifier ici
            return configID;
        }

    } catch (err) {
        console.error(`Erreur lors de l'insertion de la configuration ${table} :`, err);
        throw err;
    }
}