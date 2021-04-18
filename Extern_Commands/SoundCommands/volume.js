const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const sfdl = require('./sfdl');
const Discordjs = require('discord.js');

function volume (serverQueue, args, msg, queue) {


    if (+args[0] >= 0 && +args[0] < 500 ){
        //or connection.dispatcher
        serverQueue.volume = (+args[0] / 100);
        serverQueue.connection.dispatcher.setVolume(+args[0] / 100);
        msg.channel.send("changed volume to " + (args[0])+"%");
        queue.set(msg.guild.id, serverQueue);

    } else
    {
        msg.channel.send("Please change volume (1-500)")
        return false;
    }
}

module.exports = volume;