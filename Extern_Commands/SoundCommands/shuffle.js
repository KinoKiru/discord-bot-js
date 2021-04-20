const group = require('../Assets/Groups');
const name = "shuffle";
group.get("Music Commands").push(name);

module.exports = {
    execute(message) {
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);
        if (!serverQueue) {
            return message.channel.send("There is no queue");
        }
        const first = serverQueue.songs.shift();
        const songs = serverQueue.songs;
        for (let i = 0; i < 1000; i++) {

            const rand1 = Math.floor(Math.random() * songs.length);
            const rand2 = Math.floor(Math.random() * songs.length);
            const tmp = songs[rand1];
            songs[rand1] = songs[rand2];
            songs[rand2] = tmp;
        }
        serverQueue.songs.unshift(first);

        message.channel.send("Queue shuffeld!");
    },
    name: name,
    description: "!shuffle : shuffeld de queue."
}
