const Discord = require("discord.js");

module.exports = {

    name: "roles",
    description: "Ajoute ou retire un rôle au reaction roles",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "action",
            description: "add/remove",
            required: true,
            autocomplete: true,
        },
        {
            type: "role",
            name: "role",
            description: "Le rôle à ajouter ou retirer",
            required: true,
            autocomplete: false,
        },
    ],

    async run(bot, message, args, db) {

        let action = args.getString("action");
        if (action !== "add" && action !== "remove") return message.reply("Indique add ou remove");

        let role = args.getRole("role");
        if (!message.guild.roles.cache.get(role.id)) return message.reply("Pas de rôle trouvé");
        if (role.managed) return message.reply("Indique un rôle non géré"); // Si le rôle est everyone ou here, ou gérer par un bot

        if (action === "add") {

            try {

                const [rows, fields] = await db.promise().query(`SELECT * FROM server WHERE guild = ${message.guildId}`);

                let roles = rows[0].reaction_role.split(" ");
                if (roles.length >= 25) return message.reply("Vous ne pouvez pas rajouter de rôles");

                if (roles.includes(role.id)) return message.reply("Ce rôle est déjà dans le réaction rôle");

                await roles.push(role.id);

                await db.promise().query(`UPDATE server SET reaction_role = '${roles.filter(e => e !== "").join(" ")}' WHERE guild = '${message.guildId}'`);
                await message.reply(`Le rôle \`${role.name}\` a bien été ajouter au reaction role`);

            } catch (err) {
                console.error(err);
                message.reply("Une erreur est survenue lors de l'exécution de la commande `add`.");
            }
        }

        if (action === "remove") {

            try {

                const [rows, fields] = await db.promise().query(`SELECT * FROM server WHERE guild = ${message.guildId}`);

                let roles = rows[0].reaction_role.split(" ");
                if (roles.length <= 0) return message.reply("Aucun rôle à retirer");

                if (!roles.includes(role.id)) return message.reply("Ce rôle n'est pas dans le réaction rôle");

                let number = roles.indexOf(role.id);
                delete roles[number];

                await db.promise().query(`UPDATE server SET reaction_role = '${roles.filter(e => e !== "").join(" ")}' WHERE guild = '${message.guildId}'`);
                await message.reply(`Le rôle \`${role.name}\` a bien été retirer du reaction role`);

            } catch (err) {
                console.error(err);
                message.reply("Une erreur est survenue lors de l'exécution de la commande `remove`.");
            }
        }
    }
}