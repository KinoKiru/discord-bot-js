const {MessageEmbed} = require('discord.js')

const group = require('../Assets/Groups');
const name = "np";
group.get("Music Commands").push(name);

module.exports = {
    execute(message) {

        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.channel.send("There is no queue");
        }


        if (serverQueue.songs[0] === undefined) {
            message.channel.send('Currently there is no song playing');
            return false
        }

        message.channel.send(new MessageEmbed().setTitle(serverQueue.songs[0].title).setThumbnail(serverQueue.songs[0].thumbnail));
    },
    name: name,
    description: "!np : speelt het current liedje af."
}