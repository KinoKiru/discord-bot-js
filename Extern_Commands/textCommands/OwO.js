const group = require('../Assets/Groups');
const name = "owo";
group.get("Misc").push(name);

//ik kijk naar de message en dan react ik met 3 emoijs
module.exports = {
    async execute(message) {
        try {
            await message.react('😳');
            await message.react('👉');
            await message.react('👈');
        } catch (error) {
            //als het fout gaat geef ik een message terug
            console.error('One of the emojis failed to react.');
            message.channel.send('One of the emojis failed to react.');
        }
    },
    name: name,
    description: "Gives a response to your message.",
}