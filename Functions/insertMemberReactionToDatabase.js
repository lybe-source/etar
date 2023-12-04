const Discord = require("discord.js");

module.exports = async (db, configID, userID, table) => {

    try {
        const insertQuery = `INSERT INTO ${table} (configID, userID) VALUES (?, ?)`;
        const insertValue = [configID, userID];
        await db.promise().query(insertQuery, insertValue);

        console.log("Réaction insérée avec succès.");

    } catch (err) {
        console.error("Erreur lors de l'insertion de la réaction :", err);
        console.error("SQL Error :", err.sql);
        console.error("SQL Error Code :", err.code);
        throw err;
    }
}