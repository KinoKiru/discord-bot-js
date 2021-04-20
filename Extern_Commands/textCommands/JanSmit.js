const janniesmit = require('../Assets/longText.json')
const group = require('../Assets/Groups');
const name = "jansmit";
//hier pak ik de group Misc en push ik de naam van de command
group.get("Misc").push(name);
//hier activeer ik de command en send hij de text in de json file
module.exports = {
    execute(message) {
        message.channel.send(janniesmit.text) // hier geef ik je boem boem bailando

    },
    name: name,
    description: "Gives the song text of Boom Boom Bailando",
}