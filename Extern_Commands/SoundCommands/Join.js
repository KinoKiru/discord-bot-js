
function join(message, voiceChannel, serverQueue)
{
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );


  serverQueue.connection = voiceChannel.join()


   //TODO hier heb ik nog serverQueue.connection voor gezet
}

module.exports = join;