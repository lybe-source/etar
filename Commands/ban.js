const Discord = require("discord.js");

module.exports = {

    name: "ban",
    description: "Bannir l'utilisateur",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à bannir",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du bannissement",
            required: false,
            autocomplete: false,
        },
    ],

    async run(bot, message, args) {

        try {

            let user = await bot.users.fetch(args._hoistedOptions[0].value); // Allow to ban someone who isn't in the server
            if (!user) return message.reply("Pas de membre à bannir !");
            let member = message.guild.members.cache.get(user.id);

            let reason = args.getString("raison");
            // console.log(reason);
            if (!reason) reason = "Pas de raison fournie.";

            // Check if the user can ban the member and if the user isn't trying to ban himself
            if (message.user.id === user.id) return message.reply("Essaie pas de te bannir !");
            if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Le propriétaire du serveur ne peut pas être banni !");
            if (member && !member.bannable) return message.reply("Je ne peux pas bannir ce membre !");
            if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas bannir ce membre !");
            if ((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déjà ban !");

            try { await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``); } catch (err) {}

            await message.reply(`${message.user} a banni \`${user.tag}\` pour la raison : \`${reason}\``);

            await message.guild.bans.create(user.id, {reason: reason});

        } catch (err) {

            return message.reply("Aucun membre à bannir trouvé !");
        }
    }
}