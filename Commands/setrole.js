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

            let fetchedMessage = await channel.messages.fetch(messageID);

            const config = {
                guildID: message.guild.id,
                channelID: channel.id,
                messageID: fetchedMessage.id,
                roleID: role.id,
                emoji: emoji
            };

            await bot.function.insertConfigToDatabase(db, config, TABLE[0]);


            // Ajouter la réaction au message
            await fetchedMessage.react(emoji);

            await message.deferReply();
            await message.followUp(`:white_check_mark: La réaction a été ajouté avec succès.`);

            bot.function.handleReactionRole(bot, fetchedMessage, config, TABLE); // Récupère le tableau en entier

        } catch (err) {
            console.error(err);
            await message.reply(`:no_entry: Une erreur est survenue lors de la configuration de la réaction.`);
        }
    }
}
