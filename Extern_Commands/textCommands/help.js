// noinspection JSCheckFunctionSignatures

const config = require("../Assets/config.json");
const {MessageEmbed} = require('discord.js')
const group = require('../Assets/Groups');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',

    execute(message, args) {
        const data = [];
        const {commands} = message.client;

        if (!args.length) {
            if (message.author.id === config.UserId) {
                data.push(new MessageEmbed()
                    .setTitle("Commands")
                    .addFields(
                        {
                            name: "Owner commands",
                            value: "```apache\n" + group.get("Owner Commands").join('\n') + "```",
                            inline: true
                        },
                        {
                            name: "Miscellaneous",
                            value: "```apache\n" + group.get("Misc").join('\n') + "```",
                            inline: true
                        },
                        {
                            name: "Music commands",
                            value: "```apache\n" + group.get("Music Commands").join('\n') + "```",
                            inline: true
                        }
                    )
                    .addField("\u200b", ` \nYou can send\`${config.prefix}help [command name]\` to get info on a specific command!`));
            } else {
                data.push(new MessageEmbed()
                    .setTitle("Commands")
                    .addFields(
                        {
                            name: "Miscellaneous",
                            value: "```apache\n" + group.get("Misc").join('\n') + "```",
                            inline: true
                        },
                        {
                            name: "Music commands",
                            value: "```apache\n" + group.get("Music Commands").join('\n') + "```",
                            inline: true
                        }
                    )
                    .addField("\u200b", ` \nYou can send\`${config.prefix}help [command name]\` to get info on a specific command!`));

            }


            return message.author.send(data, {split: true})
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });


        } //end of if(!args.length)

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);

        message.channel.send(data, {split: true});
    }//end of execute
}//end of module.exports