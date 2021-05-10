const fetch = require('node-fetch');
const {JSDOM} = require('jsdom');

const group = require('../Assets/Groups');
const name = "kanye";
group.get("Misc").push(name);

module.exports = {
    execute(message) {
        fetch("https://api.kanye.rest/")
            .then(res => res.json())
            .then(body => message.channel.send("> *Kanye*: " + body.quote));
    },
    name: name,
    description: "Kanye shares his wisdom with you.",
    usage: '!kanye'
}