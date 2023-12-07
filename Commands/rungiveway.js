const Discord = require("discord.js");

module.exports = {

    name: "rungiveway",
    description: "Lancer un giveway",
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
            name: "message",
            description: "L'identifiant de l'embed du giveway",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {

        let winnerUser;

        try {
            const TABLE = ["giveway", "reactions_giveway"];

            let channel = args.getChannel("salon");
            if (!channel) return await message.reply({ content: "Le salon spécifié n'a pas été trouvé.", ephemeral: true });
            let messageID = args.getString("message");
            if (!messageID) return await message.reply({ content: "Aucun message n'a été indiqué !", ephemeral: true });
            
            const config = {
                guildID: message.guild.id,
                channelID: channel.id,
                messageID: messageID,
            };

            // Récupération des données dont j'ai besoin
            const configID = await bot.function.getConfigIDForGiveway(db, config, TABLE[0]);

            try {
                const selectQuery = `SELECT * FROM ${TABLE[1]} WHERE configID = ?`;
                const selectValue = [configID];
                const [rows, fields] = await db.promise().query(selectQuery, selectValue);
            
                if (rows.length > 0) {
                    const randomIndex = Math.floor(Math.random() * rows.length);

                    let winnerID = rows[randomIndex].userID;
                    winnerUser = await bot.users.fetch(winnerID);
                } else {
                    return message.reply("Aucun gagnant séléctionner, veuillez relancer la commande !");
                }

            } catch (err) {
                console.error("Erreur lors de la sélection du vainqueur avec la requête SQL :", err);
                throw err;
            }

            // Création de l'embed
            let winnerUserTag = winnerUser.tag.charAt(0).toUpperCase() + winnerUser.tag.slice(1); // Mise en majuscule de la première lettre du tag

            const Embed = new Discord.EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Le gagnant du giveway est :`)
                .setAuthor({ name: `${bot.user.tag}`, iconURL: `${bot.user.displayAvatarURL({dynamic: true})}`})
                .addFields(
                    { name: '\u2000', value: '\u2000', inline: false },
                    { name: 'Vainqueur :', value: `${winnerUserTag}` },
                )
                .setImage(winnerUser.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: `Développez par Lybe_` });

            await channel.send({ embeds: [Embed] });

            await message.deferReply();
            await message.followUp(`:white_check_mark: Le giveway a été lancé.`);

        } catch (err) {

            console.error(err);
            await message.reply(`:no_entry: Une erreur est survenue lors du lancement du giveway.`);

        }
    }
}

async function changePermissionsOverwrites (channel, role) {

    await channel.permissionOverwrites.create(role.id, {
        ViewChannel: true,
        ReadMessageHistory: true,
    });
}
