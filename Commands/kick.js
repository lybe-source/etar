const Discord = require("discord.js");

module.exports = {

    name: "kick",
    description: "Exclure l'utilisateur",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à exclure",
            required: true,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison de l'exclusion",
            required: false,
        },
    ],

    async run(bot, message, args) {

        let user = args.getUser("membre");
        if (!user) return message.reply("Pas de membre à exclure !");
        let member = message.guild.members.cache.get(user.id);

        if (!member) return message.reply("Ce membre n'est pas sur le serveur !");

        let reason = args.getString("raison");
        // console.log(reason);
        if (!reason) reason = "Pas de raison fournie.";

        // Check if the user can kick the member and if the user isn't trying to kick himself
        if (message.user.id === user.id) return message.reply("Essaie pas de t'exclure !");
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Le propriétaire du serveur ne peut pas être exclu !");
        if (member && !member.kickable) return message.reply("Je ne peux pas exclure ce membre !");
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas exclure ce membre !");

        try { await user.send(`Tu as été exclu du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``); } catch (err) {}

        await message.reply(`${message.user} a exclu ${user.tag} pour la raison : \`${reason}\``);

        await member.kick(reason);

    }
}