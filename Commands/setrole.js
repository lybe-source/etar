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

    async run(bot, message, args) {

        try {

            let channel = args.getChannel("salon");
            if (!channel) return await message.reply({ content: "Le salon spécifié n'a pas été trouvé.", ephemeral: true });
            channel = message.guild.channels.cache.get(channel.id);
            if (!channel) return message.reply({ content: "Pas de salon trouvé !", ephemeral: true });

            let messageID = args.getString("message");
            if (!messageID) return await message.reply({ content: "Le message spécifié n'a pas été trouvé.", ephemeral: true });
            
            let roleID = args.getRole("role");
            if (!roleID) return await message.reply({ content: "Le rôle spécifié n'a pas été trouvé.", ephemeral: true });

            let emoji = args.getString("emoji");
            if (!emoji) return await message.reply({ content: "L'émoji spécifié n'existe pas.", ephemeral: true });


            const Message = await channel.messages.fetch(messageID);

            // Add reaction to the message
            Message.react(emoji);

            await message.deferReply();

            // While the member click on the reaction to add it
            bot.on('messageReactionAdd', async (reaction, user) => {
                try {
                    if (user.bot) return;
        
                    if (reaction.emoji.name === emoji) {
                        const member = reaction.message.guild.members.cache.get(user.id);
        
                        // Vérifier si le membre a déjà le rôle
                        if (!member.roles.cache.has(roleID)) {
                            await member.roles.add(roleID);

                            let Embed = new Discord.EmbedBuilder()
                                .setColor(bot.color)
                                .setTitle(`Ajout du rôle ${roleID.name}`)
                                .setThumbnail(user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                                .setFooter({text: `Demandé par ${user.tag}`});
                            await message.followUp({ embeds: [Embed], ephemeral: true });
                            return;
                        }
                    }
                } catch (err) {
                    console.error("Erreur lors de la gestion de la réaction : ", err);
                }
            });

            // While the member click on the reaction to remove it
            bot.on('messageReactionRemove', async (reaction, user) => {
                try {
                    if (user.bot) return;

                    if (reaction.emoji.name === emoji) {
                        const member = reaction.message.guild.members.cache.get(user.id);
        
                        console.log(roleID);
                        // Vérifier si le membre a déjà le rôle
                        if (member.roles.cache.has(roleID)) {
                            // Retirer le rôle
                            await member.roles.remove(roleID).catch(err => console.error("Erreur lors de la suppression du rôle : ", err));
                            // await message.interaction.guild.members.cache.get(user.id).roles.remove(roleID).catch(err => console.error("Erreur lors de la suppression du rôle : ", err));

                            let Embed = new Discord.EmbedBuilder()
                                .setColor(bot.color)
                                .setTitle(`Suppression du rôle ${roleID.name}`)
                                .setThumbnail(user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                                .setFooter({text: `Demandé par ${user.tag}`});
                            await message.followUp({ embeds: [Embed], ephemeral: true });
                            return;
                        }
                    }
                } catch (err) {
                    console.error("Erreur lors de la gestion de la réaction : ", err);
                }
            });

            await message.followUp("La réaction a été ajouté avec succès.");
        } catch (err) {
            console.error(err);
            await message.reply("Une erreur est survenue lors de la configuration de la réaction.");
        }
    }
}