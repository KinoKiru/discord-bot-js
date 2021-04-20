const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

//#region login
//hier log ik in en dan geef ik hem een status
client.login(config.token);
client.once('ready', () => {
    console.log('De fabriek staat op volle kracht');
    client.user.setActivity("use !help", {
        type: "PLAYING"
    });
});
//#endregion
module.exports = client;