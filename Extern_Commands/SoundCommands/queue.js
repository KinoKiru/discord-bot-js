function queue(serverQueue, message) {
    if ( serverQueue !== undefined && serverQueue.songs.length !== 0) {
        const allSongs = serverQueue.songs.slice(0, 30).map((song, index) => {
            return (index + 1) + ") " + song.title + " " + song.duration;
        }).join('\n');
        message.channel.send('```apache\n' +
            allSongs +
                '```');
    } else {
        message.channel.send("Queue is empty");
    }

}

module.exports = queue;
