const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
async function meep(message, args)
{
message.channel.send(await getRandomHentai(args[0] === 'engels'))
}

async function getRandomHentai(english = false, count = 1) {
    const response = await fetch('https://nhentai.net/random/', { method: english ? 'GET' : 'HEAD' });
    const doc = new JSDOM(await response.text()).window.document;
    let isEnglish = true;
    if (english) {
        isEnglish = !![...doc.querySelectorAll('span.name')].find(el => el.innerHTML === 'english');
        console.log(`[RND] Try #${count}`);
    }
    return isEnglish ? response.url : getRandomHentai(english, count + 1);
}

module.exports = meep

