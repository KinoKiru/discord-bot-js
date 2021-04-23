const group = require('../Assets/Groups');
const skip = require('../SoundCommands/skip');
const name = "remove";
group.get("Music Commands").push(name);
module.exports = {

    execute(message, args) {
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;

        if (!serverQueue) {
            return message.channel.send("There is no queue");
        }

        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play music!');
        }

        if (+args[0] > serverQueue.songs.length) {
            return message.channel.send("Given value is higher than queue")
        }

        if (+args[0] <= 0) {
            return message.channel.send("Please give a positieve number");
        }

        if (+args[0] === 1) {
            return skip.execute(message);
        }

        if (!isNaN(+args[0])) {
            const song = serverQueue.songs.splice(+args[0] - 1, 1)
            message.channel.send(`Removed song: ${song[0].title}`);
        } else {
            message.channel.send("Please give an amount!")
        }

    },
    name: name,
    aliases: ['r'],
    description: "removes a song on a given value",
    usage: '!r / !remove'
}