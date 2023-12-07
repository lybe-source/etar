const Discord = require("discord.js");

module.exports = async (bot, message, config, table) => {

    return new Promise((resolve, reject) => {
        const { guild } = message;

        console.log("Gestion des réactions activée !");

        bot.on("messageReactionAdd", async (reaction, user) => {
            let db = bot.db;
            const member = guild.members.cache.find(member => member.id === user.id);
            if (member && reaction.message.id === config.messageID && reaction.emoji.name === config.emoji) {
                try {

                    let currentTime = new Date();
                    const endTime = await bot.function.getEndTimeFromDatabase(bot, config, table); // setgiveway: table = ["giveway", "reactions_giveway", "timer_giveway"],
                    
                    // Si l'heure actuelle dépasse l'heure de fin du giveway
                    if (currentTime.getTime() > endTime.getTime()) {
                    
                        try { 
                            await user.send(`Le temps pour le giveway est dépassé`) 
                            reaction.users.remove(user); // retirer la réaction du membre
                        } catch (err) {}
                    }
                        
                    const configID = await bot.function.insertConfigToDatabase(db, config, table[0]); // setgiveway: table[0] = giveway,
                    await bot.function.insertMemberReactionToDatabase(db, configID, user.id, table[1]); // setgiveway: table[1] = reactions_giveway,
                    resolve();
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            }
        });

        bot.on("messageReactionRemove", async (reaction, user) => {
            let db = bot.db;
            const member = guild.members.cache.find(member => member.id === user.id);
            if (member && reaction.message.id === config.messageID && reaction.emoji.name === config.emoji) {
                try {
                    const configID = await bot.function.getConfigIDFromDatabase(db, config, table[0]);
                    await bot.function.removeMemberReactionFromDatabase(db, configID, user.id, table[1]);
                    resolve();
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            }
        })
    });
}