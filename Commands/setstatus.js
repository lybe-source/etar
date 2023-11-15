const Discord = require("discord.js");

module.exports = {

    name: "setstatus",
    description: "Change le status du bot",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "activité",
            description: "Activité du bot",
            required: true,
            autocomplete: true,
        },
        {
            type: "string",
            name: "status",
            description: "Status du bot",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "lien",
            description: "URL du stream",
            required: false,
            autocomplete: false,
        },
    ],

    // Manque l'intégration sur le bot quand on met un lien de (listening, watching, competing)
    async run(bot, message, args, db) {

        // Discord.ActivityType.Custom

        let activity = args.getString("activité");
        if (activity !== "Listening" && activity !== "Watching" && activity !== "Playing" && activity !== "Streaming" && activity !== "Competing") return message.reply("Merci de suivre l'autocomplete !");

        let status = args.getString("status");
        if (!status) return message.reply("Veuillez entrer un status pour le bot !");

        if (activity === "Streaming" && args.getString("lien") === null) return message.reply("Veuillez indiquer le lien du stream !");
        if (activity === "Streaming" && !args.getString("lien").match(new RegExp(/^(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/))) return message.reply("Veuillez indiquer une URL Twitch");
        // console.log(Discord.ActivityType[activity]);
        console.log("Lien du status : " + args.getString("lien"));

        if (activity === "Streaming") await bot.user.setActivity(status, {type: Discord.ActivityType[activity], url: args.getString("lien")});
        else await bot.user.setActivity(status, {type: Discord.ActivityType[activity]});
        await message.reply("Status mis à jour avec succès !");
    }
}