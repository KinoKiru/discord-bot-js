const {MessageEmbed} = require('discord.js');
const AppendError = require('../Assets/AppendError');

const group = require('../Assets/Groups');
const name = "now";
group.get("Music Commands").push(name);

module.exports = {
    execute(message) {
try{
    const queue = require('../Assets/Queue');
    let serverQueue = queue.get(message.guild.id);

    //als er nog geen queue is dan geef ik een message terug aan de user
    if (!serverQueue) {
        return message.channel.send("There is no queue");
    }

    //als er wel een serverqueue is maar er is geen liedje dan geef ik dit terug aan de user
    if (serverQueue.songs[0] === undefined) {
        message.channel.send('Currently there is no song playing');
        return false
    }

    //speelt er nu wel een liedje? dan maak ik een embed die de song title en de foto meegeeft
    message.channel.send(new MessageEmbed().setTitle(serverQueue.songs[0].title).setThumbnail(serverQueue.songs[0].thumbnail));
}catch (e) {
    AppendError(e + " in np on line 28")
}
    },
    name: name,
    aliases: ['np'],
    description: "Returns the current playing song",
    usage: '!np / !now'
}