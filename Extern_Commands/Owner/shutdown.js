const client = require('../Assets/client');
const config = require('../Assets/config.json');
const group = require('../Assets/Groups');
const AppendError = require('../Assets/AppendError');
const name = "shutdown"
group.get("Owner Commands").push(name);
module.exports = {
    //ik kijk wie de message stuurt en of die overeenkomt met mijn id, zo ja destoy ik de client
    execute(message) {
        try {
            if (message.author.id === config.UserId) {
                message.channel.send('Shutting down...').then(m => {
                    client.destroy();
                });
            } else {
                message.channel.send("You dont have the rights to preform this action.")
            }
        } catch (error) {
            AppendError(error + " " + "shutdown.js");
        }
    },
    name: name,
    description: "Shutdowns the bot",
    usage: '!shutdown'
}