const Discord = require("discord.js");

module.exports = async (db, configID, userID, table) => {

    try {
        const insertQuery = `DELETE FROM ${table} WHERE configID = ? AND userID = ?`;
        const insertValue = [configID, userID];
        await db.promise().query(insertQuery, insertValue);

        console.log("Réaction supprimée avec succès.");

    } catch (err) {
        console.error("Erreur lors de la suppression de la réaction :", err);
        throw err;
    }
}