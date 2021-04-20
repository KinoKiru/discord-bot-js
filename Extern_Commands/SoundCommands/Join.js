const group = require('../Assets/Groups');
const name = "join";
group.get("Music Commands").push(name);

module.exports = {

    execute(message) {

        const voiceChannel = message.member.voice.channel;
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        //asl er nog geen serverqueue bestaat dan maak ik er een aan
        if (!serverQueue) {
            serverQueue = {
                textChannel: message.channel,
                connection: null,
                songs: [],
                volume: 1,
                playing: true
            };
            //hij gooit de serverqueue als value erin op de plaats van de key van de server.id
            //dit betekent dus dat de serverqueue gelinkt is aan de server
            queue.set(message.guild.id, serverQueue);
        }

        //als de author van het bericht niet in een call zit dan geeft hij deze message
        if (!voiceChannel)
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );

        //als je in een call zit dan joined de bot
        serverQueue.connection = voiceChannel.join()

    },
    name: name,
    description: "!join : The bot joines your current voice channel."
}

