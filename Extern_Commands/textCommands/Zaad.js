const group = require('../Assets/Groups');
const name = "zaad";
group.get("Misc").push(name);

//hier reageer ik op je message
module.exports = {
    execute(message) {
        message.channel.send("Cool maar je moeder is dik");
    },
    name: name,
    description: 'geeft een text terug.'

}