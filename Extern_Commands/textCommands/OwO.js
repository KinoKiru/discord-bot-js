const group = require('../Assets/Groups');
const name = "owo";
group.get("Misc").push(name);

module.exports = {
    async execute(message) {
        try {
            await message.react('😳');
            await message.react('👉');
            await message.react('👈');
        } catch (error) {
            console.error('One of the emojis failed to react.');
            message.channel.send('One of the emojis failed to react.');
        }
    },
    name: name,
    description: "geeft je een mooie response.",
}