
async function owo(message)
{
    try {
        await message.react('😳');
        await message.react('👉');
        await message.react('👈');
    } catch (error) {
        console.error('One of the emojis failed to react.');
        message.channel.send('One of the emojis failed to react.');
    }
}
module.exports = owo;