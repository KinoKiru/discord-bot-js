const {MessageEmbed} = require('discord.js')

function embed_maker(message,serverQueue) {
        if(serverQueue.songs[0] === undefined){ message.channel.send('Unexpected problem has occurred with song'); return false}
        message.channel.send(new MessageEmbed().setTitle(serverQueue.songs[0].title).setThumbnail(serverQueue.songs[0].thumbnail));
}
module.exports = embed_maker;