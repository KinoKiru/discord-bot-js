const group = require('../Assets/Groups');
const name = "clear";
group.get("Music Commands").push(name);
module.exports = {

    execute(message) {
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.channel.send("There is no queue");
        }

        const first = serverQueue.songs.shift();
        serverQueue.songs = []
        serverQueue.songs.unshift(first);
        message.channel.send("Cleared queue");
    },
    name: name,
    description: "!clear : cleart de queue"

}