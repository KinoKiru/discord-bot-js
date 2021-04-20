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
        //hier pak ik het eerste nummer zdat ik die niet shuffle
        const first = serverQueue.songs.shift();
        //dit zijn nu alle nummers behalve de eerste
        const songs = serverQueue.songs;

        //deze shuffle doet ie 1000x
        for (let i = 0; i < (songs.length * 4); i++) {

            const rand1 = Math.floor(Math.random() * songs.length);
            const rand2 = Math.floor(Math.random() * songs.length);

            const tmp = songs[rand1];
            songs[rand1] = songs[rand2];
            songs[rand2] = tmp;
        }
        //en hier voeg ik nummer 1 weer toe op plaats 1
        serverQueue.songs.unshift(first);

        message.channel.send("Queue shuffeld!");
    },
    name: name,
    description: "!shuffle : shuffeld de queue."
}
