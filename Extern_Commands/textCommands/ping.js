const group = require('../Assets/Groups');
const name = "ping";
group.get("Misc").push(name);

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
