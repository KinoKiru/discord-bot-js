const Commandfile = require('../Assets/commands.json')
const OwnerCMD = require('../Assets/OwnerCommands.json')
 const {MessageEmbed} = require('discord.js')

function help (message, isBotOwner)
{
    if (isBotOwner) {
        message.author.send(new MessageEmbed()
            .setTitle("Commands")
            .addField('De music Commands', Commandfile.musicCommands)
            .addField('De Owner Commands', OwnerCMD.Info)
            .setColor(1127128)
            .setDescription(Commandfile.helpText));

    } else {
        message.author.send(new MessageEmbed()
            .setTitle("Commands")
            .setColor(1127128)
            .addField('De music Commands', Commandfile.musicCommands)
            .setDescription(Commandfile.helpText));
    }
    message.channel.send("Look in your DM's for the commands!");
}
module.exports = help;