const Discord = require("discord.js");

module.exports = {

    name: "clear",
    description: "Éfface de 1 à 100 messages du chat spécifié dans la commande",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Salon de discution où éffacer les messages",
            required: true,
            autocomplete: false,
        },
        {
            type: "number",
            name: "nombre",
            description: "Nombre de messages à supprimer",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        let channel = args.getChannel("salon");
        if (!channel) return message.reply("Le salon doit être renseigné !"); // if no channel is specified, it will be the channel where the command was run
        if (channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Pas de salon !");

        let number = args.getNumber("nombre");
        if (!parseInt(number)) return message.reply("Le nombre doit être renseigné !");
        if (parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Il nous faut un nombre entre `0` et `100` inclus !");

        await message.deferReply();

        try {

            let messages = await channel.bulkDelete(parseInt(number));

            await message.followUp({content: `J'ai bien supprimé \`${messages.size}\` message(s) dans le salon ${channel} !`, ephemeral: true}); // followUp is like reply() but use it with deferReply()

        } catch (err) {

            let messages = [...(await channel.messages.fetch()).filter(msg => !msg.interaction && (Date.now() - msg.createdAt) <= 1209600000).values()];
            if (messages.length <= 0) return message.followUp("Aucun message à supprimé car ils datent tous de plus de 14 jours dans le salon ou que se sont des interactions "+ `${channel}` +" !");
            await channel.bulkDelete(messages);
            await message.followUp({content: `J'ai pu supprimé uniquement \`${messages.length}\` message(s) car les autres dataient de plus de 14 jours ou que se sont des interactions dans le salon ${channel} !`, ephemeral: true});
        }
    }
}