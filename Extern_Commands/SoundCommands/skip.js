const ytdl = require('ytdl-core')

const group = require('../Assets/Groups');
const name = "skip";
group.get("Music Commands").push(name);

module.exports = {

    execute(message) {
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);
        //hij kijkt of je wel in de voice channel zit zo nee dan wordt dat vermeld
        if (!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        //zit je wel in de voice channel dan kijkt hij of er wel een queue is zo nee? dan geeft hij aan dat hij het niet kan doen
        if (!serverQueue || serverQueue.songs.length === 0) {
            console.log(serverQueue)
            message.member.voice.channel.leave();
            return message.channel.send("There is no song that I could skip!");
        }

        if (serverQueue.songs.length >= 1) {
            message.channel.send(`Skipped **${serverQueue.songs[0].title}**`);
            serverQueue.songs.shift();
            nextSong(serverQueue);
        }
        //hij kijkt in de queue ook of je in de voice channel zit, dan pakt hij de 'speler' en beindigt hij de spelend nummer

    },
    name: name,
    description: "!skip : skipt het nummer die nu aan het spelen is."

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
        queue.connection.dispatcher.setVolume(queue.volume);
        dispatcher.on('error', console.log);
    } else{
        queue.connection.disconnect();
    }
}