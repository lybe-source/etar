const Discord = require("discord.js");

module.exports = {

    name: "setgiveway",
    description: "Préparer un giveway",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Évênement",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Le salon dans lequel lancer le giveway",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "message",
            description: "Le message du giveway",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "role",
            description: "Le rôle qui aura accès au salon",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "emoji",
            description: "L'émoji de la réaction pour s'enregistrer dans le giveway",
            required: true,
            autocomplete: false,
        },
    ],

    async run(bot, message, args, db) {

        try {

            let channel = args.getChannel("salon");
            if (!channel) return await message.reply({ content: "Le salon spécifié n'a pas été trouvé.", ephemeral: true });
            let messageContent = args.getString("message");
            if (!messageContent) return await message.reply({ content: "Aucun message n'a été indiqué !", ephemeral: true });
            let role = args.getString("role");
            let emoji = args.getString("emoji");
            if (!emoji) return await message.reply({ content: "L'émoji spécifié n'existe pas.", ephemeral: true });

            const config = {
                guildID: message.guild.id,
                channelID: channel.id,
                messageID: message.id,
                roleID: role.id,
                emoji: emoji
            };

            await insertGivewayToDatabase(db, config);

            await messageContent.react(emoji);

            await message.deferReply();
            await message.followUp("La réaction a été ajouté avec succès.");

            changePermissionsOverwrites(channel, role);

            handleReaction(bot, config);

        } catch (err) {

            console.error(err);
            await message.reply("Une erreur est survenue lors de la configuration du giveway.");

        }
    }
}

async function changePermissionsOverwrites (channel, role) {

    await channel.permissionOverwrites.create(role.id, {
        ViewChannel: true,
        ReadMessageHistory: true,
    });
}

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

async function insertGivewayToDatabase (db, config) {
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