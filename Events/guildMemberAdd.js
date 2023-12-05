const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = async (bot, member) => {

    let db = bot.db;

    db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, req) => {

        if (req.length < 1) return;

        if (req[0].antiraid === "true") {

            try { await member.user.send("Vous ne pouvez pas rejoindre ce serveur car il est en mode antiraid ! Veuillez réessayer plus tard, merci."); } catch (err) {}
            await member.kick("Antiraid actif");
        }

        if (req[0].welchannel === "false") return;

        const selectQuery = "SELECT `welchannel` FROM `server` WHERE guild = ?";
        const selectValue = [member.guild.id];
        const channelID = await db.promise().query(selectQuery, selectValue);
        if (channelID === 'false') return;
        
        const welChannel = member.guild.channels.cache.get(req[0].welchannel);

        const jsonPath = path.join(__dirname, '../welcomeMessages.json');
        const rawdata = fs.readFileSync(jsonPath);
        const messagesData = JSON.parse(rawdata);

        const randomWelcomeMessage = getRandomWelcomeMessage(messagesData);
        const accountCreated = formatDate(member.user.createdAt);
        const joinDate = formatDate(member.joinedAt);
        const formattedMessage = randomWelcomeMessage
            .replace(/{username}/g, member.user.tag)
            .replace(/{accountCreated}/g, accountCreated)
            .replace(/{joinDate}/g, joinDate);

        const file = new Discord.AttachmentBuilder('../Etar-Bot/public/img/transparent_pixel.png'); // Il faudra surement faire mieux voir un canvas
        
        const Embed = new Discord.EmbedBuilder()
            .setColor(`${member.displayHexColor}`)
            .setTitle("Bienvenue à toi")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setImage('attachment://transparent_pixel.png')
            .addFields(
                { name: '\u2000', value: '\u2000' }, // Espace insécable
                { name: 'Message', value: `${formattedMessage}` },
                { name: '\u2000', value: '\u2000' }, // Espace insécable
                { name: 'Date de création', value: accountCreated, inline: true },
                { name: 'Rejoint le', value: joinDate, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${member.id}` })
            ;

        if (welChannel) await welChannel.send({ embeds: [Embed], files: [file] });

        if (req[0].captcha === "false") return;

        let channel = member.guild.channels.cache.get(req[0].captcha);
        if (!channel) return;

        await channel.permissionOverwrites.create(member.user, {
            SendMessages: true,
            ViewChannel : true,
            ReadMessageHistory: true,
        });

        let captcha = await bot.function.generateCaptcha();

        let msg = await channel.send({content: `${member}, vous avez 5 minutes pour compléter le captcha ! Si vous ne le réussissez pas, vous serez exclu du serveur !`, files: [new Discord.AttachmentBuilder((await captcha.canvas).toBuffer(), {name: "captcha.png"})]});

        try {

            let filter = m => m.author.id === member.user.id;
            let response = (await channel.awaitMessages({filter, max : 1, time: 300000, errors: ["time"]})).first();

            if (response.content === captcha.text) {

                await msg.delete();
                await response.delete();
                try { await member.user.send("Vous avez réussi le captcha !"); } catch (err) {}
                await channel.permissionOverwrites.delete(member.user.id);

            } else {

                await msg.delete();
                await response.delete();
                try { await member.user.send("Vous avez échoué le captcha !"); } catch (err) {}
                await channel.permissionOverwrites.delete(member.user.id);
                await member.kick("À raté le captcha");

            }

        } catch (err) {

            await msg.delete();
            try { await member.user.send("Vous avez mis trop de temps pour compléter le captcha !"); } catch (err) {}
            await channel.permissionOverwrites.delete(member.user.id);
            await member.kick("Pas fait le captcha");

        }

    });
}


function getRandomWelcomeMessage (messagesData) {

    const randomIndex = Math.floor(Math.random() * messagesData.welcomeMessages.length);
    
    return messagesData.welcomeMessages[randomIndex];
}

function formatDate (date) {
    
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    return new Intl.DateTimeFormat('fr-FR', options).format(date);
}