function stop(message, serverQueue) {
    //hij kijkt of je in de voice channel zit, zo nee dan geeft hij aan dat je in de voice channel moet zitten om de muziek te stoppen
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
//als er geen muziekl in de bestaande queue zit (of op dit moment aan het spelen is) dan geeft hij aan dat er niks is om te skippen
    if (!serverQueue)
        return message.channel.send("There is no song that I could stop!");
//is er wel muziek spelend? dan maakt hij de queue leeg en dan eindigd hij het spelend nummer
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}
module.exports = stop;