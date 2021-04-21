// noinspection JSCheckFunctionSignatures

//importeer hier de config,makeembed en de group.map
const config = require("../Assets/config.json");
const {MessageEmbed} = require('discord.js')
const group = require('../Assets/Groups');

// hier expoteer ik de functie
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    //dit is de execute die ook gelinkt staat aan bot.js
    execute(message, args) {
        const data = [];
        const {commands} = message.client;

        //als de argument geen legnte heeft dan laat hij de opties zien qua
        if (!args.length) {
            //als de message komt van mijn id krijg je iets anders dan iemand anders
            if (message.author.id === config.UserId) {
                //hier push ik de messageEmbed naar de array en geef ik de opties mee
                data.push(new MessageEmbed()
                    .setTitle("Commands")
                    .setColor(1127128)
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

            } else { // als je mij niet bent dan krijg je geen Owner Commands te zien
                data.push(new MessageEmbed()
                    .setTitle("Commands")
                    .setColor(1127128)
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

            //hier stuur ik de Help naar je DM's en dan geef ik je een input terug
            return message.author.send(data, {split: true})
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    //als ik je niet een dm kan sturen geef ik je een fout melding en die krijg ik ook
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });

        } //end of if(!args.length)

        //dit is de naam van de command
        const name = args[0].toLowerCase();
        //hier pak ik de naam van de command of als er een alias is voor de command dan pak ik een van de 2
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        //als de command niet bestaat met die naam, dan reply ik
        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        //hier push ik de naam van de command naar de data array
        data.push(`**Name:** ${command.name}`);

        //als ik een alias gebruik dan push ik die ook naar de array
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        //als ik een description heb dan push ik die naar de array
        if (command.description) data.push(`**Description:** ${command.description}`);
        //als ik een usage heb meegegeven dan push ik die naar de array
        if (command.usage) data.push(`**Usage:** ${command.usage}`);
        console.log(command)

        //hier send ik de aparte !help Command
        message.channel.send(data, {split: true});
    }//end of execute
}//end of module.exports