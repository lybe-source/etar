const Discord = require("discord.js");
const Canvas = require("discord-canvas-easy");
const Path = require("path");

module.exports = {

    name: "rank",
    description: "Niveau du membre",
    permission: "Aucune",
    dm: false,
    category: "Expérience",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'expérience de l'utilisateur",
            required: false,
            autocomplete: false,
        },
    ],

    async run(bot, message, args, db) {

        let user;
        if (args.getUser("utilisateur")) {

            user = args.getUser("utilisateur");
            if (!user || !message.guild.members.cache.get(user?.id)) return message.reply("Ce membre n'a pas été trouvé !");

        } else user = message.user;

        db.query(`SELECT * FROM experience WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

            db.query(`SELECT * FROM experience WHERE guild = '${message.guildId}'`, async (err, all) => {

                if (req.length < 1) return message.reply("Ce membre n'a pas d'expérience !");

                await message.deferReply();

                const calculXp = (xp, level) => {

                    let xptotal = 0;

                    for (let i = 0; i < level + 1; i++) xptotal += i * 1000;
                    xptotal += xp;

                    return xptotal;
                }
                
                let leaderboard = await all.sort(async (a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)));
                let xp = parseInt(req[0].xp);
                let level = parseInt(req[0].level);
                let rank = leaderboard.findIndex(r => r.user === user.id) +1;
                let need = (level + 1) * 1000; // ((level + 1) * 1000) - xp
                let imagePath = Path.join(__dirname, "../public/img/Landscape-Color.jpg");
                let fontPath = Path.join(__dirname, "../src/fonts/Agbalumo-Regular.ttf");

                let Card = await new Canvas.Card()
                    .setGuild(message.guild)
                    .setBackground(imagePath)
                    .setBot(bot)
                    .setColorFont("#FFFFFF")
                    .setRank(rank)
                    .setUser(user)
                    .setColorProgressBar("#FF0000")
                    .setXp(xp)
                    .setLevel(level)
                    .setXpNeed(need)
                    .toCard();

                await message.followUp({files: [new Discord.AttachmentBuilder(Card.toBuffer(), {name: "rank.png"})]});
            });
        });
    }
}