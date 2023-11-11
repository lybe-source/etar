const Discord = require("discord.js");
const Canvas = require("discord-canvas-easy");
const Path = require("path");

module.exports = {

    name: "leaderboard",
    description: "Donne le classement de l'expérience du serveur",
    permission: "Aucune",
    dm: false,
    category: "Expérience",
    options: [],

    async run(bot, message, args, db) {

        db.query(`SELECT * FROM experience WHERE guild = '${message.guildId}'`, async (err, req) => {

            if (req.length < 1) message.reply("Aucun membre n'a de l'expérience sur ce serveur !");

            await message.deferReply();

            const calculXp = (xp, level) => {

                let xptotal = 0;

                for (let i = 0; i < level + 1; i++) xptotal += i * 1000;
                xptotal += xp;

                return xptotal;
            }

            let leaderboard = await req.sort((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)));
            let imagePath = Path.join(__dirname, "../public/img/Leaderboard.jpg");

            const Leaderboard = await new Canvas.Leaderboard()
                .setBot(bot)
                .setGuild(message.guild)
                .setBackground("https://pbs.twimg.com/media/EzFXh-1XEAUagO2?format=jpg&name=4096x4096")
                // .setBackground(imagePath)
                .setColorFont("#FFFFFF");

            for (let i = 0; i < (req.length > 10 ? 10 : req.length); i++) {

                await Leaderboard.addUser(await bot.users.fetch(leaderboard[i].user), parseInt(leaderboard[i].level), parseInt(leaderboard[i].xp), (parseInt(leaderboard[i].level) + 1) * 1000);
            }

            const Image = await Leaderboard.toLeaderboard();

            await message.followUp({files: [new Discord.AttachmentBuilder(Image.toBuffer(), {name: "leaderboard.png"})]});
        });
    }
}