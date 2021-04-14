async function ping (msg)
{
    const before = Date.now();
    msg = await msg.channel.send('Pong!');
    const diff = Date.now() - before;
    await msg.edit('Pong '+diff+' ms')
}

module.exports = ping
