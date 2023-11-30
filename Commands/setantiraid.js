const Discord = require("discord.js");

module.exports = {

    name: "setantiraid",
    description: "Paramètre l'antiraid",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "état",
            description: "État de l'antiraid (on ou off)",
            required: true,
            autocomplete: true,
        },
    ],

    async run(bot, message, args, db) {

        let etat = args.getString("état");
        if (etat !== "on" && etat !== "off") return message.reply("Indique on ou off");

        if (etat === "off") {

            db.query(`UPDATE server SET antiraid = 'false' WHERE guild = '${message.guildId}'`);
            await message.reply(`:white_check_mark: L'antiraid est bien désactivé !`);

        } else {

            db.query(`UPDATE server SET antiraid = 'true' WHERE guild = '${message.guildId}'`);
            await message.reply(`:white_check_mark: L'antiraid est bien activé sur le serveur !`);

        }
    }
}