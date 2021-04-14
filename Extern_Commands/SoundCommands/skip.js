function skip(message, serverQueue) {
    //hij kijkt of je wel in de voice channel zit zo nee dan wordt dat vermeld
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    //zit je wel in de voice channel dan kijkt hij of er wel een queue is zo nee? dan geeft hij aan dat hij het niet kan doen
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    //hij kijkt in de queue ook of je in de voice channel zit, dan pakt hij de 'speler' en beindigt hij de spelend nummer
    serverQueue.connection.end();
}
module.exports = skip