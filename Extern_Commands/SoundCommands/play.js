const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const sfdl = require('../Assets/sfdl');

const group = require('../Assets/Groups');
const name = "play";
group.get("Music Commands").push(name);


async function play(msg, serverQueue, queue, start = false) {
    const song = serverQueue.songs[0];

    if (song === undefined) {
        queue.delete(msg.guild.id);
        serverQueue.connection.disconnect();
        return msg.channel.send('No more songs!')
    }

    if (serverQueue.songs.length <= 1 || start) {
        // hier speelt hij het lied af, als hij gefinished is dan gaat hij naar het volgende nummer
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () => {
                serverQueue.songs.shift();
                play(msg, serverQueue, queue, true);
            })
            .on('error', console.error);

        //als hij t goed doet dan deelt hij de liedjes sound gedeeld door 5? en dan geeft hij een message met de song title
        serverQueue.connection.dispatcher.setVolume(serverQueue.volume);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    } else {
        msg.channel.send("Added song to queue");
    }
}

function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600).toString();
    const minutes = Math.floor(seconds / 60 % 60).toString();
    const seconds2 = (seconds % 60 - 1).toString();
    return (hours === '0' ? '' : hours.padStart(2, '0') + ':') + minutes.padStart(2, '0') + ':' + seconds2.padStart(2, '0');
}

module.exports = {

    async execute(message, args) {
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        console.log(args);

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

        // je zou !play ook kunnen gebruiken ipv join
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play music!');
        }

        // Join voice connection
        let connection = message.guild.voice ? message.guild.connection : undefined;
        if (!connection) {
            connection = await message.member.voice.channel.join();
        }
        serverQueue.connection = connection;

        //de bot moet de permissions hebben om de channel te kunnen joinen
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

        // deze is om te kijken of ik een argument heb gekregen
        let start;
        if (args[0]) {
            // dit is voor 1 liedje waar de link voor is meegegeven
            if (args[0].startsWith('https://www.youtube.com/watch?v')) {
                // hier pak ik de link het 2de gedeelte en stop ik die in songInfo
                const songInfo = await ytdl.getInfo(args[0]);
                // blijkt er een fout te zijn dan een fout code
                if (songInfo === null || songInfo === undefined) {
                    message.channel.send('Geef een geldige youtube link mee');
                }

                const songs = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: (songInfo.videoDetails.lengthSeconds),
                    thumbnail: songInfo.videoDetails.thumbnails[0].url
                }
                console.log(songInfo.thumbnail_url)
                serverQueue.songs.push(songs);
                // is de link goed, dan gooi ik die in song, song bestaat uit de title,url en duration van het nummer die haal ik allemaal uit song info
            } else if (args[0].startsWith('https://www.youtube.com/playlist?list=')) {
                // begint het 2de argument aka de link met een linkje voor een paylist
                const songInfo = await ytpl(args[0]);
                start = serverQueue.songs.length === 0;
                const songs = songInfo.items.map(({title, url, duration, bestThumbnail}) => {
                    return {
                        title,
                        url,
                        duration,
                        thumbnail: bestThumbnail.url
                    };
                });
                serverQueue.songs.push(...songs);
                await message.channel.send(`Added '${songs.length}' songs to the queue!`);
            } else if (args[0].startsWith('https://open.spotify.com/')) {
                try {
                    const {songs, song} = await sfdl.get(message, args[0])
                    if (songs) {
                        start = serverQueue.songs.length === 0;
                        serverQueue.songs.push(...songs);
                        await message.channel.send(`Added '${songs.length}' songs to the queue!`);
                    } else if (song) {
                        serverQueue.songs.push(song);
                    }

                } catch (error) {
                    console.log(error)
                }
            } else {
                //hier pak ik de search words en doe ik die blij elkaar
                const words = args.join(' ');
                console.log(words)
                //hier pak ik de zoek woorden
                const songInfo = await ytsr.getFilters(words);
                //hier pakt hij de song die een video is
                const filter1 = songInfo.get('Type').get('Video');
                //hier mag hij er maar 1 pakken
                const options = {limit: 1}
                //en hier gooi ik de url erin met de optie dat het er maar 1 mag zijn
                const searchResults = await ytsr(filter1.url, options);
                //en dan gooi ik alles in song
                console.log(searchResults.items[0])
                const songs = {
                    title: searchResults.items[0].title,
                    url: searchResults.items[0].url,
                    duration: (searchResults.items[0].duration),
                    thumbnail: searchResults.items[0].bestThumbnail.url
                };
                serverQueue.songs.push(songs);
            }
        } else {
            // dit is de eerste foutcode die hij gaat terug geven aan de user dit betekent dat er niks is meegegven
            message.channel.send('Ewwow You Wneed two swend cowwect uwl ow pawametews');
        }
        await play(message, serverQueue, queue, start);
    },
    name: name,
    description: "!play *youtube link* / *youtube playlist* / *zoekterm* : speelt de youtube link af in de voice channel."

};