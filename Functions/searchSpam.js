const Discord = require("discord.js");
const User = new Map();

module.exports = async message => {

    console.log(message);

    if (message.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) return;

    if (User.get(message.author.id)) {

        const data = User.get(message.author.id);
        let difference = message.createdTimestamp - data.lastMessage.createdTimestamp;
        let count = data.msgCount;

        // 3000 = 3000ms
        // If the messages will be send in more than 3000ms
        if (difference > 3000) {

            clearTimeout(data.timer);
            data.msgCount = 1;
            data.lastMessage = message;

            data.timer = setTimeout(() => {
                User.delete(message.author.id);
            }, 10000);

            User.set(message.author.id, data);

        } else {

            count++;

            // If the member sent more than 5 messages in 3000ms
            if (count > 5) {

                await message.channel.send(`Attention ${message.author} a ne pas spammer !`);
                await message.member.timeout(300000, "Spam"); // The member can't send a new message while 5 minutes

                const messages = [...(await message.channel.messages.fetch({ before: message.id })).filter(m => m.author.id === message.author.id).values()].slice(0, 10);
                await message.channel.bulkDelete(messages);

            } else {

                data.msgCount = count;
                User.set(message.author.id, data);

            }

        }
    } else {

        let FN = setTimeout(() => {
            User.delete(message.author.id);
        }, 10000);

        User.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: FN
        });
    }
}