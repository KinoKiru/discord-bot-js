const janniesmit = require('../Assets/longText.json')
const group = require('../Assets/Groups');
const name = "jansmit";
group.get("Misc").push(name);
module.exports = {
    execute(message) {
        message.channel.send(janniesmit.text) // hier geef ik je boem boem bailando

    },
    name: name,
    description: "Geeft je de text van Boom Boom Bailando."

}