function clear(serverQueue, message) {
    const first = serverQueue.songs.shift();
    serverQueue.songs = []
    serverQueue.songs.unshift(first);
    message.channel.send("Cleared queue");
}

module.exports = clear;