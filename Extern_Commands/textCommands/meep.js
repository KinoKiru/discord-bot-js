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
// bij start staat de optie voor engels op false, en pakt hij maar 1 hentai
async function getRandomHentai(english = false, count = 1) {
    //hij pakt een random hentai, je hebt de optie voor english en als dat true is dan pakt ie GET en anders false = head
    const response = await fetch('https://nhentai.net/random/', {method: english ? 'GET' : 'HEAD'});
    //hier zet je de respons om in een ingeladen html bestand
    const doc = new JSDOM(await response.text()).window.document;
    //als de je engels hebt dan ga je de if in
    let isEnglish = true;
    if (english) {
        //als english true is dan zoekt ie in de html voor een span en daar de naam, en dan specifiek de engels optie
        isEnglish = !![...doc.querySelectorAll('span.name')].find(el => el.innerHTML === 'english');
        //als er geen vindt dan stuurt hij een reply naar de console
        console.log(`[RND] Try #${count}`);
    }
    // als hij er een heeft gevonden dan returnt hij hem, zo niet dan voegt hij een count.
    return isEnglish ? response.url : getRandomHentai(english, count + 1);
}