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
            if (timer === null) timer = 86400; // 24 heures en seconde
            
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

            await bot.function.insertConfigToDatabase(db, config, TABLE[0]);

            await messageBOT.react(emoji);

            await message.deferReply();
            await message.followUp(`:white_check_mark: La réaction a été ajouté avec succès.`);

            await changePermissionsOverwrites(channel, role);

            bot.function.handleReactionGiveway(bot, messageBOT, config, TABLE); // Récupère le tableau en entier

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
