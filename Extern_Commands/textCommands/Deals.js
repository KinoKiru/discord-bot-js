const fetch = require('node-fetch');
const {JSDOM} = require('jsdom');
const {convert} = require('exchange-rates-api');
const {MessageEmbed} = require('discord.js');
const paginationEmbed = require('discord.js-pagination');

const group = require('../Assets/Groups');
const name = "deals";
group.get("Misc").push(name);

module.exports = {
    async execute(message) {

        let index = 0

        const deals = await getDealsFromPageAsync()
        const stores = await getStoresAsync()

        const fields = await generateFields(deals, stores)
        let embed = new MessageEmbed()
            .setTitle('Triple A Deals')
            .setThumbnail(deals[index].thumb)
            .addFields(fields[index])

        let sendMessage = await message.channel.send(embed)
        await sendMessage.react('◀️')
        await sendMessage.react('▶️')
        const filter = (reaction) => {
            return ['◀️', '▶️'].includes(reaction.emoji.name)
        }
        while (true) {
            const collected = await sendMessage.awaitReactions(filter, {max: 1, time: 50000, errors: ['time']})
            const reaction = collected.first()
            let embed
            if (reaction.emoji.name === '▶️') {
                index = index + 1
            }
            if (reaction.emoji.name === '◀️' && (index - 1) < 0) {
                index = index - 1
            }
            console.log(deals[index])
            embed = new MessageEmbed()
                .setTitle('Triple A Deals')
                .setThumbnail(deals[index].thumb)
                .setDescription(`Current dealpage ${index}/${fields.length}`)
                .addFields(fields[index])
            await sendMessage.edit(embed)
            await sendMessage.reactions.removeAll()
            await sendMessage.react('◀️')
            await sendMessage.react('▶️')
        }
    },
    name: name,
    description: "Gives you a deal on a game.",
    usage: '!deals'
}

async function getDealsFromPageAsync() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/deals?AAA=true", requestOptions)
    const jsonReponse = await fetchStores.json()
    return jsonReponse
}

async function getStoresAsync() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/stores", requestOptions)
    const jsonReponse = await fetchStores.json()
    return jsonReponse
}

async function generateFields(deals, stores) {
    let retVal = []

    for (const deal of deals) {
        let storeName
        for (const store of stores) {
            if (store.storeID === deal.storeID) {
                storeName = store.storeName

            }
        }
        retVal.push({
            name: `${deal.title} on ${storeName}`,
            value: `Normal price €${await (rates(+deal.normalPrice))}
                 Sale Price €${await (rates(+deal.salePrice))}`
        })
    }

    return retVal
}

async function rates(price) {
    let amount = await convert(price, 'USD', 'EUR');
    return amount.toFixed(2)
}