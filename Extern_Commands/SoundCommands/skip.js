const ytdl = require('ytdl-core')

function skip(message, serverQueue , queue) {
    //hij kijkt of je wel in de voice channel zit zo nee dan wordt dat vermeld
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    //zit je wel in de voice channel dan kijkt hij of er wel een queue is zo nee? dan geeft hij aan dat hij het niet kan doen
    if (serverQueue.songs.length === 0)
    {
        return message.channel.send("There is no song that I could skip!");
    }

    if (serverQueue.songs.length >= 1){
        message.channel.send(`Skipped **${serverQueue.songs[0].title}**`);
        serverQueue.songs.shift();
        nextSong(serverQueue);
    }
    //hij kijkt in de queue ook of je in de voice channel zit, dan pakt hij de 'speler' en beindigt hij de spelend nummer

}
async function nextSong(queue) {
    if (queue.songs.length !== 0) {
        let dispatcher = queue.connection.play(ytdl(queue.songs[0].url));

        queue.songs[0].dispatcher = dispatcher;
        queue.songs[0].pauseTime = 0;
        dispatcher.on('finish', () => {
            queue.songs.shift();
            nextSong(queue);
        });

        dispatcher.on('error', console.log);
    } else{
        queue.connection.disconnect();
    }
}
module.exports = skip