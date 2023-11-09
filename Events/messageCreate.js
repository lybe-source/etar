const Discord = require("discord.js");
const mysql = require("mysql2/promise");
const config = require("../config");

module.exports = async (bot, message) => {

    let db = await mysql.createConnection({
        host: config.hostDB,
        user: config.userDB,
        password: config.passwordDB,
        database: config.database
    });

    const selectQuery = 'SELECT * FROM `experience` WHERE `guild` = ? AND `user` = ?';
    const selectValues = [message.guild.id, message.author.id];

    try {

        const [req] = await db.query(selectQuery, selectValues);

        // Even if it is greater than 1, it inserts data
        if (req.length < 1) {

            const insertQuery = "INSERT INTO `experience` (user, guild, xp, level) VALUES (?, ?, ?, ?)";
            const insertValues = [message.author.id, message.guild.id, '0', '0'];

            await db.query(insertQuery, insertValues, (err) => {
            
                if (err) {
                    console.error("Erreur lors de l'insertion des données : ", err);
                } else {
                    console.log("Données insérées avec succès !");
                }
    
            });

        } else {

            let level = parseInt(req[0].level);
            let xp = parseInt(req[0].xp);

            if ((level + 1) * 1000 <= xp) {

                const xpUpdateQuery = "UPDATE `experience` SET `xp` = ? WHERE `guild` = ? AND `user` = ?";
                const xpUpdateValues = [(level + 1) * 1000, message.guild.id, message.author.id];

                await db.query(xpUpdateQuery, xpUpdateValues, (err) => {
                    
                    if (err) {
                        console.error("Erreur lors de la mise à jour de xp : ", err);
                    } else {
                        console.log("XP mise à jour avec succès !");
                    }

                })

                const levelUpdateQuery = "UPDATE `experience` SET `level` = level + 1 WHERE `guild` = ? AND `user` = ?";
                const levelUpdateValues = [message.guild.id, message.author.id];

                await db.query(levelUpdateQuery, levelUpdateValues, (err) => {

                    if (err) {
                        console.error("Erreur lors de la mise à jour des level : ", err);
                    } else {
                        console.log("Level mis à jour avec succès");
                    }

                });

                await message.channel.send(`${message.author} est passé niveau ${level + 1}, félicitations !`);

            } else {

                let xptogive = Math.floor(Math.random() * 25) + 1;
                let newXP = (xp + xptogive);

                const updateXPQuery = "UPDATE `experience` SET `xp` = ? WHERE `guild` = ? AND `user` = ?";
                const updateXPValues = [newXP, message.guild.id, message.author.id];

                await db.query(updateXPQuery, updateXPValues, (err) => {
                    
                    if (err) {
                        console.error("Erreur lors de la mise à jour de xp : ", err);
                    } else {
                        console.log("XP mise à jour avec succès !");
                    }

                })

            }
        }
    } catch (err) {

        console.error("Erreur lors de l'exécution de la requête : ", err);

    } finally {

        await db.end();

    }
}
