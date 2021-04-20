const client = require('../Assets/client');
const config = require('../Assets/config.json');
const group = require('../Assets/Groups');
const name = "shutdown"
group.get("Owner Commands").push(name);
module.exports = {
    execute(message) {
        if (message.author.id === config.UserId) {
            message.channel.send('Shutting down...').then(m => {
                client.destroy();
            });
        } else {
            message.channel.send("U heeft niet de rechten")
        }
    },
    name: name,
    description: "Shutdowns the bot",
}