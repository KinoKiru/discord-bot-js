

function join(message, voiceChannel)
{
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    message.member.voice.channel.join();
}
module.exports = join;