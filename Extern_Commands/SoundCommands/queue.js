module.exports = {
    async execute(message) {

        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        if (serverQueue !== undefined && serverQueue.songs.length !== 0) {
            // in all songs gaan de eerste 20
            const allSongs = serverQueue.songs.slice(0, 20).map((song, index) => {
                //hier return ik de list
                return (index + 1) + ") " + song.duration + " " + song.title;
            }).join('\n');

            message.channel.send('```apache\n' +
                allSongs.replace(/\[/g, "").replace(/\]/g, "") + '```');


        } else {
            message.channel.send("Queue is empty");
        }

    },
    name: "queue",
    description: "!queue : laat de queue van liedjes zien"
}
