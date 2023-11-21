const fs = require("fs");

module.exports = async (bot) => {

    // Scan all file in the folder
    fs.readdirSync("./Events").filter(f => f.endsWith(".js")).forEach(async file => {

        let event = require(`../Events/${file}`);
        bot.on(file.split(".js").join(""), event.bind(null, bot));
        // bot.on(event.name, (...args) => event.execute(...args, bot));
        console.log(`Évènement ${file} chargé avec succès !`);
    });
}