const Discord = require("discord.js");

module.exports = async (bot, config, endTime, table) => {

    try {
        let db = bot.db;
        const configID = await bot.function.getConfigIDFromDatabase(db, config, table[0]); // setgiveway: table[0] = giveway,
        const insertQuery = `INSERT INTO ${table[2]} (configID, endTime) VALUES (?, ?)`; // setgiveway: table[2] = timer_giveway,
        const insertValue = [configID, endTime];
        await db.promise().query(insertQuery, insertValue);

        console.log("Heure de fin du giveway insérée avec succès.");

    } catch (err) {
        console.error("Erreur lors de l'insertion de l'heure de fin du giveway :", err);
        console.error("SQL Error :", err.sql);
        console.error("SQL Error Code :", err.code);
        throw err;
    }
}