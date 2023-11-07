const Discord = require("discord.js");

module.exports = {

    name: "warn",
    description: "Averti l'utilisateur",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à avertir",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "Raison de l'avertissement",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre");
        if (!user) return message.reply("Pas d'utilisateur trouvé !");
        let member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply("Pas de membre trouvé !");
        let reason = args.getString("raison");
        if (!reason) reason = "Pas de raison fournie.";

        // Check if the user can warn the member and if the user isn't trying to warn himself
        if (message.user.id === user.id) return message.reply("Essaie pas de t'avertir toi-même !");
        if ((await message.guild.fetchOwner()).id === user.id) return message.reply("Le propriétaire du serveur ne peut pas être averti !");
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas avertir ce membre !");
        if ((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Le bot ne peut pas avertir ce membre !");

        try { await user.send(`${message.user.tag} vous a donné un avertissement sur le serveur ${message.guild.name} pour la raison : \`${reason}\``) } catch (err) {}

        await message.reply(`Vous avez donné un avertissement à \`${user.tag}\` pour la raison : \`${reason}\` avec succès !`);

        let ID = await bot.function.createId("WARN");

        const insertQuery = "INSERT INTO warns (guild, user, author, warn, reason, date) VALUES (?, ?, ?, ?, ?, ?)";
        const insertValues = [message.guild.id, user.id, message.user.id, ID, reason, Date.now()];

        // db.query(`INSERT INTO warns (guild, user, author, warn, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`);
        db.query(insertQuery, insertValues, (err, results) => {
            
            if (err) {
                console.error("Erreur lors de l'insertion des données : ", err);
            } else {
                console.log("Données insérées avec succès !");
            }

            db.end();
        });
    }
}