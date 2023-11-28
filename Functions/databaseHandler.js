const Discord = require("discord.js");
// Devrait adapter les fonctions pour qu'elles acceptent dans les insertions et chargement de données en base de donnée des tables indiqué par les constantes de commande
// exemple :
// const TABLE = ["roles", "reactions_role", "giveway", "reactions_giveway"];

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Array} config 
 */
async function handleReaction (bot, config) {

    const { guild } = message;

    // Gérer la réaction pour attribuer le rôle
    bot.on("messageReactionAdd", async (reaction, user) => {
        db = bot.db;
        const member = guild.members.cache.find(member => member.id === user.id);
        if (member && reaction.message.id === config.messageID && reaction.emoji.name === config.emoji) {
            try {
                const configID = await insertGivewayToDatabase(db, config);
                await insertMemberReactionToDatabase(db, configID, user.id);
                await member.roles.add(config.roleID);
            } catch (err) {
                console.error(err);
            }
        }
    });

    // Gérer la réaction pour retirer le rôle
    bot.on("messageReactionRemove", async (reaction, user) => {
        db = bot.db;
        const member = guild.members.cache.find(member => member.id === user.id);
        if (member && reaction.message.id === config.messageID && reaction.emoji.name === config.emoji) {
            try {
                const configID = await getConfigIDFromDatabase(db, config);
                await removeMemberReactionFromDatabase(db, configID, user.id);
                await member.roles.remove(config.roleID);
            } catch (err) {
                console.error(err);
            }
        }
    })
}

async function insertConfigToDatabase (db, config) {
    try {
        const selectQuery = "SELECT id FROM `giveway` WHERE guildID = ? AND channelID = ? AND messageID = ? AND roleID = ? AND emoji = ?";
        const selectValue = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
        const [result] = await db.promise().query(selectQuery, selectValue);

        if (result.length > 0) {
            const configID = result[0].id;
            console.log("Giveway trouvée. ID : ", configID);
            return configID;
        } else {
            const insertQuery = "INSERT INTO `giveway` (guildID, channelID, messageID, roleID, emoji) VALUES (?, ?, ?, ?, ?)";
            const insertValues = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
            const [insertResult] = await db.promise().query(insertQuery, insertValues);

            const configID = insertResult.insertId;
            console.log("Giveway insérée avec succès. ID : ", configID);
            return configID;
        }

    } catch (err) {
        console.error("Erreur lors de l'insertion du giveway :", err);
        throw err;
    }
}

async function insertMemberReactionToDatabase (db, configID, userID) {
    try {
        const insertQuery = "INSERT INTO `reactions_giveway` (configID, userID) VALUES (?, ?)";
        const insertValue = [configID, userID];
        await db.promise().query(insertQuery, insertValue);

        console.log("Réaction insérée avec succès.");

    } catch (err) {
        console.error("Erreur lors de l'insertion de la réaction :", err);
        throw err;
    }
}

async function removeMemberReactionFromDatabase (db, configID, userID) {
    try {
        const deleteQuery = "DELETE FROM `reactions_giveway` WHERE configID = ? AND userID = ?";
        const deleteValue = [configID, userID];
        await db.promise().query(deleteQuery, deleteValue);

        console.log("Réaction supprimée avec succès.");

    } catch (err) {
        console.error("Erreur lors de la suppression de la réaction :", err);
        throw err;
    }
}

async function getConfigIDFromDatabase (db, config) {
    try {
        const selectQuery = "SELECT id FROM `giveway` WHERE guildID = ? AND channelID = ? AND messageID = ? AND roleID = ? AND emoji = ?";
        const selectValue = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
        const [result] = await db.promise().query(selectQuery, selectValue);

        if (result.length > 0) {
            return result[0].id;
        } else {
            throw new Error("Configuration non trouvée.");
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de l'ID de configuration : ", err);
        throw err;
    }
}

module.exports = (handleReaction, insertConfigToDatabase, insertMemberReactionToDatabase, removeMemberReactionFromDatabase, getConfigIDFromDatabase);