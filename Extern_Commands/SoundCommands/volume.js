const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const sfdl = require('../Assets/sfdl');
const Discordjs = require('discord.js');

const group = require('../Assets/Groups');
const name = "volume";
group.get("Music Commands").push(name);

module.exports = {
    execute(msg, args) {

        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(msg.guild.id);

        if (!serverQueue) {
            return msg.channel.send("There is no queue");
        }

        if (+args[0] >= 0 && +args[0] < 500) {
            //or connection.dispatcher
            serverQueue.volume = (+args[0] / 100);
            serverQueue.connection.dispatcher.setVolume(+args[0] / 100);
            msg.channel.send("changed volume to " + (args[0]) + "%");
            queue.set(msg.guild.id, serverQueue);

        } else {
            msg.channel.send("Please change volume (1-500)")
            return false;
        }
    },
    name: name,
    description: "!volume *amount* : past het volume aan"
}