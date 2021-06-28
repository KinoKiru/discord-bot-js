const ytdl = require('ytdl-core')
const AppendError = require('../Assets/AppendError');
const group = require('../Assets/Groups');
const name = "skip";
group.get("Music Commands").push(name);

module.exports = {

    execute(message) {
        try {
            const queue = require('../Assets/Queue');
            let serverQueue = queue.get(message.guild.id);
            //hij kijkt of je wel in de voice channel zit zo nee dan wordt dat vermeld
            if (!message.member.voice.channel)
                return message.channel.send(
                    "You have to be in a voice channel to stop the music!"
                );
            //als er nog geen serverqueue bestaat of dat er geen liedjes zijn dan leaved ie en geeft hij een message aan de user
            if (!serverQueue || serverQueue.songs.length === 0) {
                console.log(serverQueue)
                message.member.voice.channel.leave();
                return message.channel.send("There is no song that I could skip!");
            }

            //als er 1 of meer liedjes in de queue zitten dan geeft hij aan welk nummer hij skipt en dan gaat hij naar het volgend nummer
            if (serverQueue.songs.length >= 1) {
                message.channel.send(`Skipped **${serverQueue.songs[0].title}**`);
                serverQueue.songs.shift();
                nextSong(serverQueue);
            }
        } catch (e) {
            AppendError(e + " in skip on line 32");
        }

    },
    name: name,
    description: "skips the current playing song",
    aliases: ['s'],
    usage: '!s / !skip'

}

async function nextSong(queue) {

    //als er meer dan 0 nummers in zitten dan
    if (queue.songs.length !== 0) {
        //hij played de nummer die erna kwam
        let dispatcher = queue.connection.play(ytdl(queue.songs[0].url, {
            filter: "audioonly",
            quality: "highestaudio"
        }));

        queue.songs[0].dispatcher = dispatcher;
        queue.songs[0].pauseTime = 0;
        dispatcher.on('finish', () => {
            queue.songs.shift();
            nextSong(queue);
        });
        queue.connection.dispatcher.setVolume(queue.volume);
        dispatcher.on('error', console.log);
    } else {
        queue.connection.disconnect();
    }
}