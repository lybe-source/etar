const Discord = require("discord.js");

module.exports = {

    name: "closegiveway",
    description: "Change les permissions du rôle pour le salon giveway",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Évênement",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Le salon où lancer le giveway",
            required: true,
            autocomplete: false,
        },
        {
            type: "role",
            name: "role",
            description: "Le rôle des membre qui ont accès au salon giveway",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {

        let channel = args.getChannel("salon");
        if (!channel) return await message.reply({ content: `Aucun salon indiqué !`, ephemeral: true });
        let role = args.getRole("role");
        if (!role) return await message.reply({ content: `Aucun rôle indiqué !`, ephemeral: true });

        await changePermissionsOverwrites(channel, role);

        await message.deferReply();
        await message.followUp(`:white_check_mark: Le salon giveway a été fermé.`);
    }
}

async function changePermissionsOverwrites (channel, role) {

    await channel.permissionOverwrites.delete(role.id);
}
