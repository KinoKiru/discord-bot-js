const {MessageEmbed} = require('discord.js')
const luuk = '112125196059574272'

function User_info (message)
{
    if (luuk){
        message.channel.send(new MessageEmbed()
            .setTitle("User Information")
            .addField('Username', message.author.username) //als je een derde parameter mee geeft de true gaat hij op dezelfde line
            .addField('Creation date' ,  message.author.createdAt.getDate()+"-"+ (message.author.createdAt.getMonth()+1)+'-'+(message.author.createdAt.getFullYear()+6))
            .addField("User ID", message.author.id)
            .addField('Current server', message.guild.name)
            .setColor("0xF1C40F")
            .setThumbnail(message.author.avatarURL())
        )
    } else

    message.channel.send(new MessageEmbed()
        .setTitle("User Information")
        .addField('Username', message.author.username) //als je een derde parameter mee geeft de true gaat hij op dezelfde line
        .addField('Creation date' ,  message.author.createdAt.getDate()+"-"+ (message.author.createdAt.getMonth()+1)+'-'+message.author.createdAt.getFullYear())
        .addField("User ID", message.author.id)
        .addField('Current server', message.guild.name)
        .setColor("0xF1C40F")
        .setThumbnail(message.author.avatarURL())
    )
}
module.exports = User_info