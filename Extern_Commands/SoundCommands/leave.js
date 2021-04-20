const group = require('../Assets/Groups');
const name = "leave";
group.get("Music Commands").push(name);


module.exports = {
    execute(message) {
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        //als er geen serverqueue is of er zijn geen liedjes dan leaved de bot
        if (!serverQueue || serverQueue.songs.length === 0) {
            message.member.voice.channel.leave();
        } else {
            //als er wel liedjes zijn dan clear ik alle liedjes en dan eindig ik de afspeler en leaved de bot
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
    },
    name: name,
    description: "!leave : The bot leaves the current voice channel."

}