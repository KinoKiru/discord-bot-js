const {MessageEmbed} = require('discord.js')

const group = require('../Assets/Groups');
const name = "makeembed";
group.get("Misc").push(name);

module.exports = {
    execute(message, args) {

        message.channel.send(new MessageEmbed().setTitle(args.shift()).setAuthor(args.shift()).setDescription(args.join(' ')))

        /* allemaal mooie opties voor een mooie embed
         .setURL('https://discord.js.org/')
         .setAuthor('KinoKiru', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
         .setDescription('')
         .setThumbnail('https://i.imgur.com/wSTFkRM.png')
         .addField('Inline field title', 'Some value here', true)
         .setImage('https://i.imgur.com/wSTFkRM.png')
         .setTimestamp()
         .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');*/
    },
    name: name,
    description: "parameters (*titel* *Author* *desc*) hier mee kan je een Embed maken."

}