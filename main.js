const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({ intents });
const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");
const config = require("./config");

bot.commands = new Discord.Collection();
bot.color = "#FFFFFF";
bot.function = {
    createId: require("./Functions/createID"),
    generateCaptcha: require("./Functions/generateCaptcha"),
    searchSpam: require("./Functions/searchSpam"),
    handleReactionGiveway: require("./Functions/handleReactionGiveway"),
    handleReactionRole: require("./Functions/handleReactionRole"),
    insertConfigToDatabase: require("./Functions/insertConfigToDatabase"),
    insertMemberReactionToDatabase: require("./Functions/insertMemberReactionToDatabase"),
    removeMemberReactionFromDatabase: require("./Functions/removeMemberReactionFromDatabase"),
    getConfigIDFromDatabase: require("./Functions/getConfigIDFromDatabase"),
    getConfigIDForGiveway: require("./Functions/getConfigIDForGiveway"),
    insertEndTimeGivewayToDatabase: require("./Functions/insertEndTimeGivewayToDatabase"),
    getEndTimeFromDatabase: require("./Functions/getEndTimeFromDatabase"),
}

// Do this bot online
bot.login(config.token);
loadCommands(bot);
loadEvents(bot);
