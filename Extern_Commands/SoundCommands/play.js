const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const sfdl = require('../Assets/sfdl');
const group = require('../Assets/Groups');
const AppendError = require('../Assets/AppendError');
const skip = require('./skip');
const name = "play";
group.get("Music Commands").push(name);


async function play(msg, serverQueue, queue, start = false) {
    const song = serverQueue.songs[0];
    console.log(song)

    //als het eerste liedje in de serverqueue undifined is dan cleart hij de queue en dan leaved ie
    if (song === undefined) {
    }
    if (serverQueue.songs.length === 0) {
        queue.delete(msg.guild.id);
        serverQueue.connection.disconnect();
        return msg.channel.send('No more songs!');

    }

    if (serverQueue.songs.length <= 1 || start) {
        //als de server.songs.length <= 1 dan speelt hij het liedje af ipv de plaatsen in de queue
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url, {filter: "audioonly", quality: "highestaudio"}))
            .on('finish', () => {
                serverQueue.songs.shift();
                play(msg, serverQueue, queue, true);
            })
            .on('error', (err => {
                AppendError(err.message + " On line: 35, in file: play.js");
                msg.channel.send("song not found");
                skip.execute(msg)
            }));

        //als hij t goed doet dan deelt hij de liedjes sound gedeeld door 5? en dan geeft hij een message met de song title
        serverQueue.connection.dispatcher.setVolume(serverQueue.volume);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    } else {
        //als het meer zijn dan plaatst hij ze in de queue
        msg.channel.send("Added song to queue");
    }
}

module.exports = {
    async execute(message, args) {

        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        console.log(args);

        //als er nog geen serverQueue bestaat dan maak ik er een en set ik die in de queue map
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


        const voiceChannel = message.member.voice.channel;
        //als de user niet in een call zit geeft hij een message
        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play music!');
        }

        //als die in een voice channel zit dan gaat er in connectie de connectie van de bot van de server anders word hij undefined
        let connection = message.guild.voice ? message.guild.connection : undefined;
        //als er geen connectie is dan join ik de call
        if (!connection) {
            connection = await message.member.voice.channel.join();
        }
        //hier zet ik dan ik de serverQueue.connection de connection
        serverQueue.connection = connection;

        //de bot moet de permissions hebben om de channel te kunnen joinen
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

        // deze is om te kijken of ik een argument heb gekregen
        let start;
        if (args[0]) {
            //als de argument begint met een linkje
            if (args[0].startsWith('https://www.youtube.com/watch?v')) {
                //hier pak ik de info van het linkje zoals title ect
                const songInfo = await ytdl.getInfo(args[0]);
                // blijkt songInfo leeg te zijn of undefined dan geef ik een error
                if (songInfo === null || songInfo === undefined) {
                    message.channel.send('Geef een geldige youtube link mee');
                }

                //hier maak ik een object genaamd songs en daar geef ik een title,url,duration,tumbnail uit songInfo
                const songs = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    durationSeconds: (songInfo.videoDetails.lengthSeconds),
                    thumbnail: songInfo.videoDetails.thumbnails[0].url
                }
                console.log('liedje', songs)
                //hier push ik songs naar de songs array van serverQueue, dus als serverQueue.songs leeg is speelt hij deze als eerste af
                serverQueue.songs.push(songs);

                //als de argument begint met deze link dan:
            } else if (args[0].startsWith('https://www.youtube.com/playlist?list=')) {
                //hier pak ik alle info van de afpeelijst link
                const songInfo = await ytpl(args[0]);

                //start is true als er geen liedjes zijn ander blijft hij false
                start = serverQueue.songs.length === 0;

                //hier gooi ik in songs de songInfo.items(aka de songs).map en dan wil ik alleen de:
                //Title, url, duration, en de thumbnail
                const songs = songInfo.items.map(({title, url, duration, bestThumbnail}) => {
                    return {
                        title,
                        url,
                        durationSeconds: timeToSeconds(duration),
                        thumbnail: bestThumbnail.url
                    };
                });
                //hier push ik naar serverQueue.songs alles in songs

                console.log(songs)
                serverQueue.songs.push(...songs);

                //pas als de message is gestuurd gaat hij pas door naar de volgende stap
                await message.channel.send(`Added '${songs.length}' songs to the queue!`);

                //als de link begint met https://open.spotify.com/
            } else if (args[0].startsWith('https://open.spotify.com/')) {
                try {
                    //hier pak ik alleen de song en songs van sfdl.get(play, linkje(https://open.spotify.com/(track of playlist) een van de 2))
                    const {songs, song} = await sfdl.get(message, args[0])
                    //als ik een Playlist heb megegeven
                    if (songs) {
                        //hier stel ik start weer in op false
                        start = serverQueue.songs.length === 0;
                        //hier push ik alle songs van de playlist naar de serverQueue
                        serverQueue.songs.push(...songs);
                        //hij gaat pas verder als ik de message heb gestuurd
                        await message.channel.send(`Added '${songs.length}' songs to the queue!`);
                    } else if (song) {
                        //als het een nummer is dan push ik die dus maar 1 nummer
                        serverQueue.songs.push(song);
                    }
                } catch (error) {
                    AppendError(error + " on line: 151, in file: play.js" + "\n");
                }
            } else {
                //hier pak ik de argumenten en plaats ik die bij elkaar en gooi ik er een spatie tussen
                const words = args.join(' ');

                //in songInfo gooi ik filters van de words
                const songInfo = await ytsr.getFilters(words);
                //hier pak ik de value van de key Type en van Video
                const filter1 = songInfo.get('Type').get('Video');
                //hier mag hij er maar 1 pakken
                const options = {limit: 1}
                //en hier gooi ik de url erin met de optie dat het er maar 1 mag zijn
                const searchResults = await ytsr(filter1.url, options);
                //en dan gooi ik alles in song
                console.log(searchResults.items[0])
                //hier gooi ik de info in de delen
                const songs = {
                    title: searchResults.items[0].title,
                    url: searchResults.items[0].url,
                    durationSeconds: timeToSeconds(searchResults.items[0].duration),
                    thumbnail: searchResults.items[0].bestThumbnail.url
                };
                //hier push ik de song naar de songs array
                serverQueue.songs.push(songs);
                console.log("woord", songs);
            }
        } else {
            // dit is de eerste foutcode die hij gaat terug geven aan de user dit betekent dat er niks is meegegven
            message.channel.send('Ewwow You Wneed two swend cowwect uwl ow pawametews');
        }
        //hier speel ik het nummer af of ik gooi het nummer in de queue
        await play(message, serverQueue, queue, start);
    },
    name: name,
    aliases: ['p'],
    description: "Plays the given item",
    usage: "!play / !p  (*youtube link* / *youtube playlist* / *Tags*)",

};

function timeToSeconds(time) {
    if (!time || time === '') return 0;
    const split = time.split(':');
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (split.length === 3) {
        const [h, m, s] = split;
        hours = +h;
        minutes = +m;
        seconds = +s;
    } else {
        const [m, s] = split;
        minutes = +m;
        seconds = +s;
    }
    return (hours * 3600) + (minutes * 60) + seconds;
}