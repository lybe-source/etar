const Discord = require("discord.js");

module.exports = async (bot, config, table) => {

    try {
        let db = bot.db;
        const configID = await bot.function.getConfigIDFromDatabase(db, config, table[0]);
        const selectQuery = `SELECT endTime FROM ${table[2]} WHERE configID = ?`;
        const selectValue = [configID];
        const [result] = await db.promise().query(selectQuery, selectValue);

        if (result.length > 0) {
            return result[0].endTime;
        } else {
            throw new Error("Fin du giveway non trouvée.");
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de la fin du giveway : ", err);
        throw err;
    }
}