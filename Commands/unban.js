const Discord = require("discord.js");

module.exports = {

    name: "unban",
    description: "Débannir l'utilisateur",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "Le utilisateur à débannir",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du débannissement",
            required: false,
            autocomplete: false,
        },
    ],

    async run(bot, message, args) {

        try {

            let user = args.getUser("utilisateur");
            if (!user) return message.reply("Pas d'utilisateur !");
            let reason = args.getString("raison");
            if (!reason) reason = "Pas de raison fournies.";

            // Checking if this user is ban
            if (!(await message.guild.bans.fetch()).get(user.id)) return message.reply("Cet utilisateur n'est pas banni !");

            // Trying to send a private message
            try { await user.send(`Tu as été débanni par ${message.user.tag} pour la raison : \`${reason}\``) } catch (err) {}

            await message.reply(`${message.user} a débanni \`${user.tag}\` pour la raison : \`${reason}\``);

            // Unban this user
            await message.guild.members.unban(user, reason);

        } catch (err) {

            return message.reply("Aucun utilisateur !");
        }
    }
}