const Discord = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");
const { request } = require('undici');

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
        
        // const Embed = new Discord.EmbedBuilder()
        //     .setColor(`${member.displayHexColor}`)
        //     .setTitle("Bienvenue à toi")
        //     .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        //     .setImage('attachment://transparent_pixel.png')
        //     .addFields(
        //         { name: '\u2000', value: '\u2000' }, // Espace insécable
        //         { name: 'Message', value: `${formattedMessage}` },
        //         { name: '\u2000', value: '\u2000' }, // Espace insécable
        //         { name: 'Date de création', value: accountCreated, inline: true },
        //         { name: 'Rejoint le', value: joinDate, inline: true },
        //     )
        //     .setTimestamp()
        //     .setFooter({ text: `ID: ${member.id}` })
        //     ;

        const canvas = new Canvas.createCanvas(1200, 800);
        const ctx = canvas.getContext("2d");

        // const pathToFont = path.resolve(__dirname, '../src/fonts/Agbalumo-Regular.ttf');
        // Canvas.registerFont(pathToFont, { family: 'agbalumo' });
        
        // Image
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const backgroundPath = path.resolve(__dirname, '../public/img/background-neon.jpg');
        const background = await Canvas.loadImage(backgroundPath);
        ctx.drawImage(background, canvas.width / 2 - background.width /2, canvas.height / 2 - background.height / 2);

        // Layer
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, 25, canvas.height);
        ctx.fillRect(canvas.width - 25, 0, 25, canvas.height);
        ctx.fillRect(25, 0, canvas.width - 50, 25);
        ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25);
        ctx.globalAlpha = 1;

        // Title
        const welc = "Bienvenue à toi";
        ctx.font = "bold 90px Arial";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 12;
        ctx.strokeText(welc, 450, 180);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(welc, 450, 180);

        // Welcome message
        ctx.font = "bold 50px Arial";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 10;
        const lines = wrapText(ctx, formattedMessage, 600);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            ctx.strokeText(line, 450, 350 + i * 55); // Ajuster la position en conséquence, le * 30 correspond à l'espacement vertical entre chaque ligne de texte
            ctx.fillStyle = "#EB6123";
            ctx.fillText(line, 450, 350 + i * 55);
        }

        // Date de création du compte
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`Créé le : ${accountCreated}`, 750, canvas.height - 75);
        // Date de rejoignement
        ctx.fillText(`Rejoint le : ${joinDate}`, 750, canvas.height - 35);

        // Discriminator
        // ctx.font = "bold 45px Arial";
        // ctx.strokeStyle = "#000000";
        // ctx.lineWidth = 10;
        // ctx.strokeText(
        //     `#${member.user.discriminator}`,
        //     canvas.width - 620,
        //     canvas.height - 120
        // );
        // ctx.fillStyle = "#EB6123";
        // ctx.fillText(
        //     `#${member.user.discriminator}`,
        //     canvas.width - 620,
        //     canvas.height - 120
        // );

        // Memeber count
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 30px Arial";
        ctx.fillText(
            `${member.guild.memberCount}ème membre`,
            40,
            canvas.height - 35
        );

        // Avatar, Canvas size : 1200x800
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#E96423";
        const img = await Canvas.loadImage(member.displayAvatarURL({ format: "png" }));
        const centerY = (canvas.height - img.height) / 2;
        const centerX = 180;

        // Dessiner le cercle
        ctx.arc(centerX, centerY + img.height / 2, 135, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();

        // Calculer les coordonnées de dessin de l'image en fonction du cercle
        const imgX = centerX - 135;
        const imgY = centerY + img.height / 2 - 135;

        // Dessine l'image
        ctx.drawImage(img, imgX, imgY, 270, 270);
        ctx.restore();

        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'welcome-image.png' });
        if (welChannel) welChannel.send({ files: [attachment] });




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

function wrapText (ctx, text, maxWidth) {
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + ' ' + word).width;

        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    lines.push(currentLine);

    return lines;
}