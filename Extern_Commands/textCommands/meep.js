const fetch = require('node-fetch');
const {JSDOM} = require('jsdom');

const group = require('../Assets/Groups');
const name = "meep";
group.get("Misc").push(name);

module.exports = {
    async execute(message, args) {
        message.channel.send(await getRandomHentai(args[0] === 'engels'))
    },
    name: name,
    description: "parameter : (*engels*) wat 18+ content \uD83D\uDE33."
}

async function getRandomHentai(english = false, count = 1) {
    const response = await fetch('https://nhentai.net/random/', {method: english ? 'GET' : 'HEAD'});
    const doc = new JSDOM(await response.text()).window.document;
    let isEnglish = true;
    if (english) {
        isEnglish = !![...doc.querySelectorAll('span.name')].find(el => el.innerHTML === 'english');
        console.log(`[RND] Try #${count}`);
    }
    return isEnglish ? response.url : getRandomHentai(english, count + 1);
}