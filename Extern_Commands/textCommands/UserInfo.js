const {MessageEmbed} = require('discord.js')

const group = require('../Assets/Groups');
const name = "userinfo";
group.get("Misc").push(name);

//hier maak ik een embed aan met wat info over de user
module.exports = {
    execute(message) {
        message.channel.send(new MessageEmbed()
            .setTitle("User Information")
            .addField('Username', message.author.username) //als je een derde parameter mee geeft de true gaat hij op dezelfde line
            .addField('Creation date', message.author.createdAt.getDate() + "-" + (message.author.createdAt.getMonth() + 1) + '-' + message.author.createdAt.getFullYear())
            .addField("User ID", message.author.id)
            .addField('Current server', message.guild.name)
            .setColor("0xF1C40F")
            .setThumbnail(message.author.avatarURL())
        )
    },
    name: name,
    description: "geeft je discord naam + je User ID en nog wat andere info."


}