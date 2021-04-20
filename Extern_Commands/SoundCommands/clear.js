const group = require('../Assets/Groups');
const name = "clear";
group.get("Music Commands").push(name);
module.exports = {
// hier kijk sla ik de queue(met de key van de server.id) op in de serverqueue
    execute(message) {
        const queue = require('../Assets/Queue');
        let serverQueue = queue.get(message.guild.id);

        //als er nog geen serverqueue is gemaakt geeft hij een error aan de user
        if (!serverQueue) {
            return message.channel.send("There is no queue");
        }

        //hier pak ik het eerste liedje die haal ik tijdelijk weg
        const first = serverQueue.songs.shift();
        //dan clear ik de queue (aka de songs)
        serverQueue.songs = []
        //dan gooi ik weer het eerste nummer erin en dan geef ik een message
        serverQueue.songs.unshift(first);
        message.channel.send("Cleared queue");
    },
    name: name,
    description: "!clear : cleart de queue"

}