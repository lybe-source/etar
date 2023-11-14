const Discord = require("discord.js");

module.exports = async (bot, interaction) => {

    // Autocomplete the commands
    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

        let entry = interaction.options.getFocused();

        if (interaction.commandName === "help") {
            
            let choices = bot.commands.filter(cmd => cmd.name.includes(entry));
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})));
        }

        if (interaction.commandName === "setcaptcha" || interaction.commandName === "setantiraid") {
            
            let choices = ["on", "off"];
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

            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                ViewChannel: false
            });

            // Need a boucle to put false for ViewChannel at all roles
            // await channel.permissionOverwrites.create([
            //     { id: "1173617417914699887", deny: [ViewChannel] }, // Samouraï
            //     { id: "1170909161010241637", deny: [ViewChannel] }, // Dev

            //     { id: "1170877128414351401", deny: [ViewChannel] }, // All-Games
            //     { id: "1170887655127527475", deny: [ViewChannel] }, // WoW
            //     { id: "1170888611403665458", deny: [ViewChannel] }, // Wakfu
            //     { id: "1170888950198575256", deny: [ViewChannel] }, // Civilization
            //     { id: "1172569125244125348", deny: [ViewChannel] }, // SoT

            //     { id: "1170913046508609596", deny: [ViewChannel] }, // PHP
            //     { id: "1170913426223144960", deny: [ViewChannel] }, // Symfony
            //     { id: "1170913929292161054", deny: [ViewChannel] }, // Laravel
            //     { id: "1170914248264781965", deny: [ViewChannel] }, // Javascript
            //     { id: "1170914601286766663", deny: [ViewChannel] }, // Typescript
            //     { id: "1170914922356543525", deny: [ViewChannel] }, // React
            //     { id: "1170915162836975617", deny: [ViewChannel] }, // Angular
            //     { id: "1170915400519798885", deny: [ViewChannel] }, // VueJS
            //     { id: "1170915667290103928", deny: [ViewChannel] }, // Java
            //     { id: "1170915936631529534", deny: [ViewChannel] }, // Python
            //     { id: "1170916183952851035", deny: [ViewChannel] }, // Ruby
            // ])
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

            await channel.setParent(interaction.channel.parent.id); // ajoute le channel ticket dans la catégorie où se trouve le channel pour le créer
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

            let user = bot.guilds.cache.get(interaction.channel.topic);

            try { await user.send("Votre ticket a été fermé !"); } catch (err) {}

            await interaction.channel.delete();

        }
    }
}