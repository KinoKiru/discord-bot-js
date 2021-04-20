const Discord = require('discord.js');
const config = require('./Extern_Commands/Assets/config.json');
const fs = require('fs');
const queue = require('./Extern_Commands/Assets/Queue');
const client = require('./Extern_Commands/Assets/client');
client.commands = new Discord.Collection();
//hier kijk ik in de Extern_Command map
const externCommands = fs.readdirSync('./Extern_Commands');

//voor de aantal mappen in de map Extern_Commands
for (const folders of externCommands) {
    //hier kijk ik dan naar de aantal files in een map lichten aan de map, hier pak ik allen de files die eindigt op .js
    const commandFiles = fs.readdirSync(`./Extern_Commands/${folders}`).filter(file => file.endsWith('.js'));
    //voor elke induvuele files in de totaal aantal files in de folder
    for (const file of commandFiles) {
        //hier kijk ik naar de commands die staan in de desbetreffende file in de folder
        const command = require(`./Extern_Commands/${folders}/${file}`)
        //hier plaats ik in client.commands de command.name(die geef ik aan in de induvuele command), en de geef ik de path naar de command mee
        client.commands.set(command.name, command);
    }
}

//ik kijk of de client een message ontvangt
client.on('message', async message => {
    //hier pak ik de argument die na de command komt
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    //hier pak ik de naam van de gegeven command dus bv: help, play, meep ect
    const commandName = args.shift().toLowerCase();
    //als het bericht niet begint met de prefix doet de bot niks
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    //als de client niet de command name heeft dan returnt hij
    if (!client.commands.has(commandName)) return;
    //als de author een bot is dan doe ik niks
    if (message.author.bot) return;
    //hier pak ik de command name uit client.commands
    const command = client.commands.get(commandName);

    //hier pak ik de commandname en dan de functie die ik overal bij gebruik
    // dus bv: help.execute , play.execute. meep.execute
    try {
        command.execute(message, args);
    } catch (error) {
        //als er een fout onstaat bij de command krijg je een message terug
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


