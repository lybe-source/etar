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
            description: "Le salon où lancer le giveway",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "gain",
            description: "L'objet à gagner dans le giveway", // lorsqu'il y aura l'embed, se sera l'objet à gagner
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "image",
            description: "L'URL de l'image représentant l'objet à gagner",
            required: true,
            autocomplete: false,
        },
        {
            type: "role",
            name: "role",
            description: "Le rôle qui aura accès au salon",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "emoji",
            description: "La réaction pour le giveway",
            required: true,
            autocomplete: false,
        },
        {
            type: "integer",
            name: "timer",
            description: "Le temps maximum où les membres peuvent réagir au giveway (secondes)",
            required: false,
            autocomplete: false,
        },
    ],

    async run(bot, message, args, db) {

        try {
            const TABLE = ["giveway", "reactions_giveway"];

            let channel = args.getChannel("salon");
            if (!channel) return await message.reply({ content: "Le salon spécifié n'a pas été trouvé.", ephemeral: true });
            let messageContent = args.getString("gain");
            if (!messageContent) return await message.reply({ content: "Aucun gain n'a été indiqué !", ephemeral: true });
            let imageURL = args.getString("image");
            if (!imageURL) return await message.reply({ content: "Aucune url d'image n'a été indiqué !", ephemeral: true });
            let role = args.getRole("role");
            if (!role) return await message.reply({ content: "Le rôle spécifié n'a pas été trouvé.", ephemeral: true });
            let emoji = args.getString("emoji");
            if (!emoji) return await message.reply({ content: "L'émoji spécifié n'existe pas.", ephemeral: true });
            let timer = args.getInteger("timer");
            if (timer === null) timer = 86400; // 24 heures en milliseconde
            
            // Création de l'embed
            const currentTime = new Date();
            const endTime = new Date(currentTime.getTime() + timer);
            // Utilise les options pour enlever les secondes
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            const formattedEndTime = endTime.toLocaleString(undefined, options);

            const formattedTime = formatTime(timer);

            const Embed = new Discord.EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Giveway pour gagner :`)
                .setAuthor({ name: `${bot.user.tag}`, iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`})
                .addFields(
                    { name: '\u2000', value: '\u2000' }, // Espace insécable
                    { name: 'Gain :', value: `${messageContent}`},
                    { name: '\u2000', value: '\u2000' }, // Espace insécable
                    { name: 'Durée du giveway :', value: `${formattedTime}`, inline: true },
                    { name: 'Fin du giveway :', value: `${formattedEndTime}`, inline: true },
                )
                .setImage(`${imageURL}`)
                .setTimestamp()
                .setFooter({ text: `Développez par Lybe_` });

            let messageBOT = await channel.send({ embeds: [Embed] });

            const config = {
                guildID: message.guild.id,
                channelID: channel.id,
                messageID: messageBOT.id,
                roleID: role.id,
                emoji: emoji
            };

            await insertConfigToDatabase(db, config, TABLE[0]); // await bot.function.insertConfigToDatabase(db, config, TABLE[0]);

            await messageBOT.react(emoji);

            await message.deferReply();
            await message.followUp(`:white_check_mark: La réaction a été ajouté avec succès.`);

            await changePermissionsOverwrites(channel, role);

            handleReaction(bot, messageBOT, config, TABLE); // bot.function.handleReactionGiveway(bot, messageBOT, config, TABLE); // Récupère le tableau en entier

        } catch (err) {

            console.error(err);
            await message.reply(`:no_entry: Une erreur est survenue lors de la configuration du giveway.`);

        }
    }
}

async function changePermissionsOverwrites (channel, role) {

    await channel.permissionOverwrites.create(role.id, {
        ViewChannel: true,
        ReadMessageHistory: true,
    });
}

function formatTime (timer) {
    
    const hours = Math.floor(timer / (60 * 60));
    const minutes = Math.floor((timer % (60 * 60)) / 60);
    const seconds = Math.floor((timer % (60)) / 1000);

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    const formattedTime = `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;

    return formattedTime;
}

async function handleReaction (bot, message, config, table) {
    return new Promise((resolve, reject) => {
        const { guild } = message;

        console.log("Gestion des réactions activée !");

        // Gérer la réaction pour attribuer le rôle
        bot.on("messageReactionAdd", async (reaction, user) => {
            let db = bot.db;
            const member = guild.members.cache.find(member => member.id === user.id);
            if (member && reaction.message.id === config.messageID && reaction.emoji.name === config.emoji) { // Le problème doit se situer ici
                try {
                    const configID = await insertConfigToDatabase(db, config, table[0]);
                    await insertMemberReactionToDatabase(db, configID, user.id, table[1]);
                    resolve();
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            }
        });

        // Gérer la réaction pour retirer le rôle
        bot.on("messageReactionRemove", async (reaction, user) => {
            let db = bot.db;
            const member = guild.members.cache.find(member => member.id === user.id);
            if (member && reaction.message.id === config.messageID && reaction.emoji.name === config.emoji) {
                try {
                    const configID = await getConfigIDFromDatabase(db, config, table[0]);
                    await removeMemberReactionFromDatabase(db, configID, user.id, table[1]);
                    resolve();
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            }
        })
    });
}

async function insertConfigToDatabase (db, config, table) {
    try {
        const selectQuery = `SELECT id FROM ${table} WHERE guildID = ? AND channelID = ? AND messageID = ? AND roleID = ? AND emoji = ?`;
        const selectValue = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
        const [result] = await db.promise().query(selectQuery, selectValue);

        if (result.length > 0) {
            const configID = result[0].id;
            console.log(`${table} trouvée. ID : `, configID);
            return configID;
        } else {
            const insertQuery = `INSERT INTO ${table} (guildID, channelID, messageID, roleID, emoji) VALUES (?, ?, ?, ?, ?)`;
            const insertValues = [config.guildID, config.channelID, config.messageID, config.roleID, config.emoji];
            const [insertResult] = await db.promise().query(insertQuery, insertValues);

            const configID = insertResult.insertId;
            console.log(`${table} insérée avec succès. ID : `, configID);
            return configID;
        }

    } catch (err) {
        console.error(`Erreur lors de l'insertion du ${table} :`, err);
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
        console.error("SQL Error :", err.sql);
        console.error("SQL Error Code :", err.code);
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