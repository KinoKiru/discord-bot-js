const Discord = require('discord.js');
const config = require('./Extern_Commands/Assets/config.json');
const fs = require('fs');
const queue = require('./Extern_Commands/Assets/Queue');
const client = require('./Extern_Commands/Assets/client');
client.commands = new Discord.Collection();
const externCommands = fs.readdirSync('./Extern_Commands');


for (const folders of externCommands) {
    const commandFiles = fs.readdirSync(`./Extern_Commands/${folders}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./Extern_Commands/${folders}/${file}`)
        client.commands.set(command.name, command);
    }
}

client.on('message', async message => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    if (!client.commands.has(commandName)) return;
    if (message.author.bot) return;
    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('there was an error trying to execute that command!');
    }

})



//#region functions
client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (oldMember.channel && !newMember.channel) {
        queue.delete(oldMember.guild.id)
        console.log('old: leaved');
    } else if (newMember.channel && !oldMember.channel) {
        console.log('new: joined');
    } else if (!oldMember.channel && !newMember.channel) {
        console.log('nothing');
    } else if (oldMember.channel === newMember.channel) {
        console.log('same');
    } else {
        console.log('old', oldMember.channel);
        console.log('new', newMember.channel);
    }
});
//#endregion


