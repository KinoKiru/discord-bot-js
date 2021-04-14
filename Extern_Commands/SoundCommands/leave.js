

function leave(serverQueue, message)
{
    //hier bijden werken, server queue is wel beter want dat zorgt voor de einde van de queue maar manual ontkoppelen neukt het
    if (!serverQueue || serverQueue.songs.length === 0) {
        message.member.voice.channel.leave();
    } else {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
}
module.exports = leave;