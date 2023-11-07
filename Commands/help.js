const Discord = require("discord.js");

module.exports = {

    name: "help",
    description: "Affiche les commandes disponibles",
    permission: "Aucune",
    dm: true,
    category: "Information",
    options: [
        {
            type: "string",
            name: "commande",
            description: "La commande à afficher",
            required: false,
            autocomplete: true,
        },
    ],

    async run(bot, message, args) {

        let command;

        if (args.getString("commande")) {
            command = bot.commands.get(args.getString("commande"));
            if (!command) return message.reply("Pas de commande !");
        }

        // If the user type a command
        if (!command) {

            // Add all categories if they aren't already in the table
            let categories = [];
            bot.commands.forEach(command => {
                if (!categories.includes(command.category)) categories.push(command.category);
            });

            let Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Commandes du bot`)
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .setDescription(`Commandes disponibles : \`${bot.commands.size}\`\nCatégories disponibles : \`${categories.length}\``)
                .setTimestamp()
                .setFooter({text: "Développez par Lybe_"});
            
            // await console.log(categories);
            await categories.sort().forEach(async cat => {

                let commands = bot.commands.filter(cmd => cmd.category === cat);
                // await console.log(commands);
                Embed.addFields({name: `${cat}`, value: `${commands.map( cmd => `\`${cmd.name}\` : ${cmd.description}`).join("\n")}`});
            });

            await message.reply({embeds: [Embed]});

        } else {

            let Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Commande ${command.name}`)
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .setDescription(`Description : \`${command.description}\`\nPermission requise : \`${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\`\nCommande en DM : \`${command.dm ? "Oui" : "Non"}\`\nCatégorie : \`${command.category}\``)
                .setTimestamp()
                .setFooter({text: "Développez par Lybe_"});

            await message.reply({embeds: [Embed]});
        }
    }
}