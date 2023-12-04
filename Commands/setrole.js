const Discord = require("discord.js");

module.exports = {

    name: "setrole",
    description: "Configurer la réaction pour attribuer un rôle",
    permission: Discord.PermissionFlagsBits.ManageRoles,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Le salon du message",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "message",
            description: "L'identifiant du message",
            required: true,
            autocomplete: false,
        },
        {
            type: "role",
            name: "role",
            description: "Le rôle à attribuer",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "emoji",
            description: "L'émoji de la réaction",
            required: true,
            autocomplete: false,
        },
    ],

    async run(bot, message, args, db) {

        try {
            const TABLE = ["roles", "reactions_role"];

            let channel = args.getChannel("salon");
            if (!channel) return await message.reply({ content: "Le salon spécifié n'a pas été trouvé.", ephemeral: true });
            channel = message.guild.channels.cache.get(channel.id);
            if (!channel) return message.reply({ content: "Pas de salon trouvé !", ephemeral: true });

            let messageID = args.getString("message");
            if (!messageID) return await message.reply({ content: "Le message spécifié n'a pas été trouvé.", ephemeral: true });
            
            let role = args.getRole("role");
            if (!role) return await message.reply({ content: "Le rôle spécifié n'a pas été trouvé.", ephemeral: true });

            let emoji = args.getString("emoji");
            if (!emoji) return await message.reply({ content: "L'émoji spécifié n'existe pas.", ephemeral: true });

            const config = {
                guildID: message.guild.id,
                channelID: channel.id,
                messageID: message.id,
                roleID: role.id,
                emoji: emoji
            };

            await insertConfigToDatabase(db, config, TABLE[0]); // await bot.function.insertConfigToDatabase(db, config, TABLE[0]);

            const fetchedMessage = await channel.messages.fetch(messageID);

            // Ajouter la réaction au message
            await fetchedMessage.react(emoji);

            await message.deferReply();
            await message.followUp(`:white_check_mark: La réaction a été ajouté avec succès.`);

            handleReaction(bot, fetchedMessage, config, TABLE); // bot.function.handleReactionRole(bot, fetchedMessage, config, TABLE); // Récupère le tableau en entier

        } catch (err) {
            console.error(err);
            await message.reply(`:no_entry: Une erreur est survenue lors de la configuration de la réaction.`);
        }
    }
}

async function handleReaction (bot, message, config, table) {
    const { guild } = message;

    // Gérer la réaction pour attribuer le rôle
    bot.on("messageReactionAdd", async (reaction, user) => {
        let db = bot.db;
        const member = guild.members.cache.find(member => member.id === user.id);
        if (member && reaction.message.id === message.id && reaction.emoji.name === config.emoji) {
            try {
                const configID = await insertConfigToDatabase(db, config, table[0]);
                await insertMemberReactionToDatabase(db, configID, user.id, table[1]);
                await member.roles.add(config.roleID);
            } catch (err) {
                console.error(err);
            }
        }
    });

    // Gérer la réaction pour retirer le rôle
    bot.on("messageReactionRemove", async (reaction, user) => {
        let db = bot.db;
        const member = guild.members.cache.find(member => member.id === user.id);
        if (member && reaction.message.id === message.id && reaction.emoji.name === config.emoji) {
            try {
                const configID = await getConfigIDFromDatabase(db, config, table[0]);
                await removeMemberReactionFromDatabase(db, configID, user.id, table[1]);
                await member.roles.remove(config.roleID);
            } catch (err) {
                console.error(err);
            }
        }
    })
}

async function insertConfigToDatabase (db, config, table) {
    try {
        const selectQuery = `SELECT id FROM ${table} WHERE guildID = ? AND channelID = ? AND messageID = ? AND roleID = ? AND emoji = ?`;
        const selectValue = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
        const [result] = await db.promise().query(selectQuery, selectValue);

        if (result.length > 0) {
            const configID = result[0].id;
            console.log("Configuration trouvée. ID : ", configID);
            return configID;
        } else {
            const insertQuery = `INSERT INTO ${table} (guildID, channelID, messageID, roleID, emoji) VALUES (?, ?, ?, ?, ?)`;
            const insertValues = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
            const [insertResult] = await db.promise().query(insertQuery, insertValues);

            const configID = insertResult.insertId;
            console.log("Configuration insérée avec succès. ID : ", configID);
            return configID;
        }

    } catch (err) {
        console.error("Erreur lors de l'insertion de la configuration :", err);
        throw err;
    }
}

async function insertMemberReactionToDatabase (db, configID, userID, table) {
    try {
        const insertQuery = `INSERT INTO ${table} (configID, userID) VALUES (?, ?)`;
        const insertValue = [configID, userID];
        await db.promise().query(insertQuery, insertValue);

        console.log("Réaction insérée avec succès.");

    } catch (err) {
        console.error("Erreur lors de l'insertion de la réaction :", err);
        throw err;
    }
}

async function removeMemberReactionFromDatabase (db, configID, userID, table) {
    try {
        const deleteQuery = `DELETE FROM ${table} WHERE configID = ? AND userID = ?`;
        const deleteValue = [configID, userID];
        await db.promise().query(deleteQuery, deleteValue);

        console.log("Réaction supprimée avec succès.");

    } catch (err) {
        console.error("Erreur lors de la suppression de la réaction :", err);
        throw err;
    }
}

async function getConfigIDFromDatabase (db, config, table) {
    try {
        const selectQuery = `SELECT id FROM ${table} WHERE guildID = ? AND channelID = ? AND messageID = ? AND roleID = ? AND emoji = ?`;
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