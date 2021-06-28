const queue = require('../Assets/Queue');
const AppendError = require('../Assets/AppendError');

module.exports = {
    execute(message) {
        try {
            let serverQueue = queue.get(message.guild.id);

            if (serverQueue !== undefined && serverQueue.songs.length !== 0) {
                //in allSongs gaan de eerste 20 nummers van de serverQueue en hier pak ik de induvuele song van
                const allSongs = serverQueue.songs.slice(0, 20).map((song, index) => {
                    //returnt de nummer van het liede in de queue, de duration van het liedje en dan de title van het liedje
                    return (index + 1) + ") " + secondsToTime(song.durationSeconds) + " " + song.title;
                }).join('\n');

                let totaltime = 0;
                for (let song of serverQueue.songs) {
                    totaltime += song.durationSeconds;
                }

                //dan stuur ik 1 message met de 20 nummers en replace ik de blokhaken met niks
                message.channel.send('```apache\n' + `total: ${serverQueue.songs.length}\nduration: ${secondsToTime(totaltime)}\n\n` +
                    allSongs.replace(/\[/g, "").replace(/\]/g, "") + '```');

            } else {
                message.channel.send("Queue is empty");
            }
        } catch (error){
            AppendError(error + " In file queue line 29 ");
        }


    },
    name: "queue",
    description: "Shows the queue",
    aliases: ['q'],
    usage: '!q / !queue'
}

//hier gooi ik de seconden naar time
function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600).toString();
    const minutes = Math.floor(seconds / 60 % 60).toString();
    const seconds2 = (seconds % 60 - 1).toString();
    return (hours === '0' ? '' : hours.padStart(2, '0') + ':') + minutes.padStart(2, '0') + ':' + seconds2.padStart(2, '0');
}
