const fs = require("fs");

module.exports = async (bot) => {

    // Scan all file in the folder
    fs.readdirSync("./Commands").filter(f => f.endsWith(".js")).forEach(async file => {

        let command = require(`../Commands/${file}`);
        
        if (!command.name || typeof command.name !== "string") throw new TypeError(`La commande ${file.slice(0, file.length - 3)} n'a pas de nom !`);

        bot.commands.set(command.name, command);

        console.log(`Commande ${file} chargée avec succès !`);
    });
}