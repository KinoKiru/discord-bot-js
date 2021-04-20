const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

//#region login
client.login(config.token);
client.once('ready', () => {
    console.log('De fabriek staat op volle kracht');
    client.user.setActivity("use !help", {
        type: "PLAYING"
    });
});
//#endregion
module.exports = client;