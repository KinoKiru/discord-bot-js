const group = require('../Assets/Groups');
const name = "leave";
group.get("Music Commands").push(name);


module.exports = {
    execute(message) {
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);
        //hier bijden werken, server queue is wel beter want dat zorgt voor de einde van de queue maar manual ontkoppelen neukt het
        if (!serverQueue || serverQueue.songs.length === 0) {
            message.member.voice.channel.leave();
        } else {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
    },
    name: name,
    description: "!leave : de bot stopt met spelen en leaved."

}