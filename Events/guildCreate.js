const Discord = require("discord.js");

module.exports = async (bot, guild) => {

    let db = bot.db;

    const insertQuery = "INSERT INTO server (guild, captcha, antiraid, antispam) VALUES (?, ?, ?, ?)";
    const insertValues = [guild.id, 'false', 'false', 'false'];

    db.query(`SELECT * FROM server WHERE guild = '${guild.id}'`, async (err, req) => {

        if (req.length < 1) {

            db.query(insertQuery, insertValues, (err) => {

                if (err) {
                    console.error("Erreur lors de l'insertion des données : ", err);
                } else {
                    console.log("Données insérées avec succès !");
                }

            });
        }
    });
}
