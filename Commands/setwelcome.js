const Discord = require("discord.js");

module.exports = {

    name: "setwelcome",
    description: "Paramètre le salon de bienvenue",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "état",
            description: "État du mode bienvenue (on ou off)",
            required: true,
            autocomplete: true,
        },
        {
            type: "channel",
            name: "salon",
            description: "Salon de bienvenue (renseigné si on)",
            required: true,
            autocomplete: false,
        },
    ],

    async run(bot, message, args, db) {

        let etat = args.getString("état");
        if (etat !== "on" && etat !== "off") return message.reply("Indique on ou off");

        if (etat === "off") {

            db.query(`UPDATE server SET welchannel = 'false' WHERE guild = '${message.guildId}'`);
            await message.reply(`:white_check_mark: Le salon de bienvenue est bien désactivé !`);

        } else {

            let channel = args.getChannel("salon");
            if (!channel) return message.reply("Indique un salon pour activer la bienvenue !");
            channel = message.guild.channels.cache.get(channel.id);
            if (!channel) return message.reply("Pas de salon trouvé !");

            db.query(`UPDATE server SET welchannel = '${channel.id}' WHERE guild = '${message.guildId}'`);
            await message.reply(`:white_check_mark: Le salon de bienvenue est bien activé sur le salon ${channel} !`);

        }
    }
}