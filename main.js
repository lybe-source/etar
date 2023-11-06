const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });
const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");
const config = require("./config");

bot.commands = new Discord.Collection();

// Do this bot online
bot.login(config.token);
loadCommands(bot);
loadEvents(bot);



// Event bot when a message will be send
// bot.on("messageCreate", async message => {

//     if (message.content === "!ping") return bot.commands.get("ping").run(bot, message);
// });

// Event bot, example = send a message or a member join the server
// bot.on("ready", async () => {

//     console.log(`${bot.user.tag} est bien en ligne !`);
// });