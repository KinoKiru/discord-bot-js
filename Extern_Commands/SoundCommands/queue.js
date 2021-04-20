module.exports = {
    async execute(message) {

        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        if (serverQueue !== undefined && serverQueue.songs.length !== 0) {
            //in allSongs gaan de eerste 20 nummers van de serverQueue en hier pak ik de induvuele song van
            const allSongs = serverQueue.songs.slice(0, 20).map((song, index) => {
                //returnt de nummer van het liede in de queue, de duration van het liedje en dan de title van het liedje
                return (index + 1) + ") " + song.duration + " " + song.title;
            }).join('\n');

            //dan stuur ik 1 message met de 20 nummers en replace ik de blokhaken met niks
            message.channel.send('```apache\n' +
                allSongs.replace(/\[/g, "").replace(/\]/g, "") + '```');


        } else {
            message.channel.send("Queue is empty");
        }

    },
    name: "queue",
    description: "!queue : laat de queue van liedjes zien"
}
