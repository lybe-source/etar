const Discord = require("discord.js");

module.exports = {

    name: "reactionrole",
    description: "Envoie le reaction role",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [],

    async run(bot, message, args, db) {

        try {

            const [rows, fields] = await db.promise().query(`SELECT * FROM server WHERE guild = ${message.guildId}`);
            let roles = rows[0].reaction_role.split(" ");
            if (roles.length <= 0) return message.reply("Pas de rôle trouvé");

            let options = [];
            for (let i = 0; i < roles.length; i++) {
                let role = message.guild.roles.cache.get(roles[i]);
                if (!role) return;
                await options.push({label: `@${role.name}`, value: role.id});
            }

            // Changer ça en embed, faire en sorte que tout les rôles ne soient pas sélectionnable dans le salon rôle
            const menu = new Discord.ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
                .setCustomId("reactionrole")
                .setMinValues(0)
                .setMaxValues(roles.length)
                .setPlaceholder("Sélectionnez vos rôles")
                .addOptions(options)
            );

            await message.reply({components: [menu]});

        } catch (err) {
            console.error(err);
            message.reply("Une erreur est survenue lors de l'exécution de la commande.");
        }
    }
}