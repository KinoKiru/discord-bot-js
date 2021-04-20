const group = require('../Assets/Groups');
const name = "join";
group.get("Music Commands").push(name);

module.exports = {

    execute(message) {
        const voiceChannel = message.member.voice.channel;
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            serverQueue = {
                textChannel: message.channel,
                connection: null,
                songs: [],
                volume: 1,
                playing: true
            };
            // hij kijkt eerst of er een connectie is dan gooit hij dat in de construct zodat het ipv null true or false is, dan speelt hij het eerste liedje van de queue
            queue.set(message.guild.id, serverQueue);
        }

        if (!voiceChannel)
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );


        serverQueue.connection = voiceChannel.join()

    },
    name: name,
    description: "!join : De bot joined je voice channel."
}

