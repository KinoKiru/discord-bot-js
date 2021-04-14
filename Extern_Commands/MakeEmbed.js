const {MessageEmbed} = require('discord.js')

function embed_maker(titel, author, desc,) {
    return (
        new MessageEmbed().setTitle(titel).setAuthor(author).setDescription(desc)
    )

    /* allemaal mooie opties voor een mooie embed
     .setURL('https://discord.js.org/')
     .setAuthor('KinoKiru', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
     .setDescription('')
     .setThumbnail('https://i.imgur.com/wSTFkRM.png')
     .addField('Inline field title', 'Some value here', true)
     .setImage('https://i.imgur.com/wSTFkRM.png')
     .setTimestamp()
     .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');*/
}
module.exports = embed_maker;