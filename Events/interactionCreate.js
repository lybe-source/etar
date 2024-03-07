const Discord = require("discord.js");

module.exports = async (bot, interaction) => {

    // Autocomplete the commands
    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

        let entry = interaction.options.getFocused();

        if (interaction.commandName === "help") {
            
            let choices = bot.commands.filter(cmd => cmd.name.includes(entry));
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})));

        }

        if (interaction.commandName === "setcaptcha" || interaction.commandName === "setantiraid" || interaction.commandName === "setantispam" || interaction.commandName === "setwelcome" || interaction.commandName === "ban") {
            
            let choices = ["on", "off"];
            let output = choices.filter(c => c.includes(entry));
            await interaction.respond(entry === "" ? output.map(c => ({name: c, value: c})) : output.map(c => ({name: c, value: c})));

        }

        if (interaction.commandName === "setstatus") {
            
            let choices = ["Playing", "Streaming", "Listening", "Watching", "Competing"];
            let output = choices.filter(c => c.includes(entry));
            await interaction.respond(entry === "" ? output.map(c => ({name: c, value: c})) : output.map(c => ({name: c, value: c})));
            
        }

    }

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        let command = require(`../Commands/${interaction.commandName}`);
        command.run(bot, interaction, interaction.options, bot.db);

    }

    if (interaction.isButton()) {

        if (interaction.customId === "ticket") {

            let channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: Discord.ChannelType.GuildText
            });
            
            await channel.setParent(interaction.channel.parent.id); // ajoute le channel ticket dans la catégorie où se trouve le channel pour le créer

            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                ViewChannel: false
            });
            await channel.permissionOverwrites.create(interaction.user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true,
            });
            await channel.permissionOverwrites.create("1170876592935948349", {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true,
            });

            await channel.setTopic(interaction.user.id);
            await interaction.reply({content: `Votre ticket a correctement été créé : ${channel}`, ephemeral: true});

            let Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle("Création d'un ticket")
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .setDescription("Ticket créé")
                .setTimestamp()
                .setFooter({text: "Développez par Lybe_", iconURL: bot.user.displayAvatarURL({dynamic: true})});

            const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                .setCustomId("close")
                .setLabel("Fermer le ticket")
                .setStyle(Discord.ButtonStyle.Danger)
                .setEmoji("🚮")
            );

            await channel.send({embeds: [Embed], components: [btn]});

        }

        if (interaction.customId === "close") {

            let user = bot.users.cache.get(interaction.channel.topic);

            try { await user.send("Votre ticket a été fermé !"); } catch (err) {}

            await interaction.channel.delete();

        }
    }

}