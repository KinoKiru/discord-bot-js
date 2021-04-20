const group = require('../Assets/Groups');
const name = "ping";
group.get("Misc").push(name);

//hier kijk ik naar het verschil tussen een datetime en de datime na het bericht en dan edit ik het bericht
module.exports = {
    async execute(message) {
        const before = Date.now();
        message = await message.channel.send('Pong!');
        const diff = Date.now() - before;
        await message.edit('Pong ' + diff + ' ms')
    },
    name: name,
    description: "ik geef je ping terug."

}
