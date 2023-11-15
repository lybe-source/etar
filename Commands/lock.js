const Discord = require("discord.js");

module.exports = {

    name: "lock",
    description: "Vérrouille un salon",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Le salon à bloquer",
            required: true,
            autocomplete: false,
        },
        {
            type: "role",
            name: "rôle",
            description: "La rôle à vérrouiller",
            required: false,
            autocomplete: false, // Faire l'autocomplete
        },
    ],

    async run(bot, message, args) {

        let channel = args.getChannel("salon");
        if (!message.guild.channels.cache.get(channel.id)) return message.reply("Ce salon n'existe pas sur le serveur !");
        if (channel.type !== Discord.ChannelType.GuildText && channel.type !== Discord.ChannelType.PublicThread && channel.type !== Discord.ChannelType.PublicThread) return message.reply("Indiquez un salon textuel");

        let role = args.getRole("rôle");
        if (role && !message.guild.roles.cache.get(role.id)) return message.reply("Ce rôle n'existe pas sur le serveur !");
        if (!role) role = message.guild.roles.everyone;

        if (channel.permissionOverwrites.cache.get(role.id)?.deny.toArray(false).includes("SendMessages")) return message.reply(`Le rôle \`${role.name}\` est déjà vérrouillé dans le salon ${channel}`);

        if (channel.permissionOverwrites.cache.get(role.id)) await channel.permissionOverwrites.edit(role.id, {SendMessages: false, AttachFiles: false});
        else await channel.permissionOverwrites.create(role.id, {SendMessages: false, AttachFiles: false});

        await message.reply(`Le rôle \`${role.name}\` a bien été vérrouillé dans le salon ${channel}`);
    }
}