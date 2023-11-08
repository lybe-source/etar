const Discord = require("discord.js");

module.exports = async (bot, message) => {

    let db = bot.db;

    const selectQuery = 'SELECT * FROM `experience` WHERE `guild` = ? AND `user` = ?';
    const selectValues = [message.guild.id, message.author.id];

    db.query(selectQuery, selectValues, async (err, req) => {

        if (err) console.error("Erreur lors de la sélection des données d'expérience : ", err);

        // Even if it is greater than 1, it inserts data
        if (req.length < 1) {

            const insertQuery = "INSERT INTO `experience` (user, guild, xp, level) VALUES (?, ?, ?, ?)";
            const insertValues = [message.guild.id, message.author.id, '0', '0'];

            db.query(insertQuery, insertValues, (err) => {
            
                if (err) {
                    console.error("Erreur lors de l'insertion des données : ", err);
                } else {
                    console.log("Données insérées avec succès !");
                }

                db.end();
    
            });

        } else {

            let level = parseInt(req[0].level);
            let xp = parseInt(req[0].xp);

            if ((level + 1) * 1000 <= xp) {

                let newXP = (xp - (level + 1) * 1000);
                let newLevel = level + 1;

                const updateXPQuery = "UPDATE `experience` SET `xp` = ? WHERE `guild` = ? AND `user` = ?";
                const updateXPValues = [newXP, message.guild.id, message.author.id];

                db.query(updateXPQuery, updateXPValues, (err) => {
                    
                    if (err) {
                        console.error("Erreur lors de la mise à jour de xp : ", err);
                    } else {
                        console.log("XP mise à jour avec succès !");
                    }

                })

                const updateLevelQuery = "UPDATE `experience` SET `level` = ? WHERE `guild` = ? AND `user` = ?";
                const updateLevelValues = [newLevel, message.guild.id, message.author.id];

                db.query(updateLevelQuery, updateLevelValues, (err) => {

                    if (err) {
                        console.error("Erreur lors de la mise à jour des level : ", err);
                    } else {
                        console.log("Level mis à jour avec succès");
                    }

                    db.end();

                });

                await message.channel.send(`${message.author} est passé niveau ${level + 1}, félicitations !`);

            } else {

                let xptogive = Math.floor(Math.random() * 25) + 1;
                let newXP = (xp + xptogive);

                const updateXPQuery = "UPDATE `experience` SET `xp` = ? WHERE `guild` = ? AND `user` = ?";
                const updateXPValues = [newXP, message.guild.id, message.author.id];

                db.query(updateXPQuery, updateXPValues, (err) => {
                    
                    if (err) {
                        console.error("Erreur lors de la mise à jour de xp : ", err);
                    } else {
                        console.log("XP mise à jour avec succès !");
                    }

                    db.end();

                })

            }
        }
    });
}
