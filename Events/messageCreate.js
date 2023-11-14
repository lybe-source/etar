const Discord = require("discord.js");

module.exports = async (bot, message) => {

    let db = bot.db;

    if (message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    const insertQuery = "INSERT INTO server (guild, captcha, antiraid) VALUES (?, ?, ?)";
    const insertValues = [message.guildId, 'false', 'false'];

    db.query(`SELECT * FROM server WHERE guild = '${message.guildId}'`, async (err, req) => {

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

    db.query(`SELECT * FROM experience WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`, async (err, req) => {

        if (req.length < 1) {

            db.query(`INSERT INTO experience (user, guild, xp, level) VALUES ('${message.author.id}', '${message.guildId}', '0', '0')`);
        
        } else {

            let level = parseInt(req[0].level);
            let xp = parseInt(req[0].xp);

            if ((level + 1) * 1000 <= xp) {

                db.query(`UPDATE experience SET xp = '${xp - ((level + 1) * 1000)}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);
                db.query(`UPDATE experience SET level = '${level + 1}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);

                await message.channel.send(`${message.author} est passé niveau ${level + 1}, félicitations !`);

            } else {

                let xptogive = Math.floor(Math.random() * 25) + 1;

                db.query(`UPDATE experience SET xp = '${xp + xptogive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`);
            }
        }
    })
}