
function shutdown(message,client){
    message.channel.send('Shutting down...').then(m => {
        client.destroy();
    });
}
module.exports = shutdown