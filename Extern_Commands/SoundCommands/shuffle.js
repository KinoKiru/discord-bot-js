
function shuffle (serverQueue, message)
{
    const first = serverQueue.songs.shift();
    const songs = serverQueue.songs;
    for (let i = 0; i < 1000; i++) {

        const rand1 = Math.floor(Math.random() * songs.length);
        const rand2 = Math.floor(Math.random() * songs.length);
        const tmp = songs[rand1];
        songs[rand1] = songs[rand2];
        songs[rand2] = tmp;
    };
    serverQueue.songs.unshift(first);

    message.channel.send("Queue shuffeld!");
}
module.exports = shuffle
