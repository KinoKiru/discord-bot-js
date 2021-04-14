const config = require('../Assets/config.json')
function restart(message, queue, client)
{
    message.channel.send('Restarting...').then(m => {

        const serverQueue = queue.get(message.guild.id);
        if (serverQueue && serverQueue.connection){
            serverQueue.connection.disconnect()
        }

        queue.delete(message.guild.id)
        client.destroy()
        client.login(config.token);
        message.channel.send('Done!');
    });
    client.user.setActivity("Use !commands", {
        type: "PLAYING"
    });
}
module.exports = restart;
