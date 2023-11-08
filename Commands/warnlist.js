const Discord = require("discord.js");

module.exports = {

    name: "warnlist",
    description: "Affiche les avertissements d'un membre",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false, // Allow or not to dm the bot with this command
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à surveiller",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre");
        if (!user) return message.reply("Pas d'utilisateur !");
        let member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply("Pas de membre !");

        const selectQuery = 'SELECT * FROM `warns` WHERE `guild` = ? AND `user` = ?';
        const selectValues = [message.guild.id, user.id];
            
        db.query(selectQuery, selectValues, async (err, req) => {

            if (err) console.error("Erreur lors de la sélection des données : ", err);

            if (req.length < 1) return message.reply("Ce membre n'a pas d'avertissement !");
            await req.sort((a, b) => parseInt(b.date) - parseInt(a.date)); // from newest to oldest

            let Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Avertissement de ${user.tag}`)
                .setThumbnail(user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setFooter({text: "Développez par Lybe_"});

            for (let i = 0; i < req.length; i++) {

                Embed.addFields([{name: `Avertissement n°${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n> **ID** : \`${req[i].warn}\`\n> **Raison** : \`${req[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:F>`}]);
            }

            await message.reply({embeds: [Embed]});
        });
    }
}