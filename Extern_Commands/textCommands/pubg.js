const group = require('../Assets/Groups');
const name = "pubg";
group.get("Misc").push(name);

//hier geef ik je een yt link
module.exports = {
    execute(message) {
        message.channel.send("https://www.youtube.com/watch?v=zLsf8UNmlJc")
    },
    name: name,
    description: "Geeft je dagelijkse dosis pubg."
}