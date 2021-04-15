//#region Required files en client
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./Extern_Commands/Assets/config.json');
const Commandfile = require('./Extern_Commands/Assets/commands.json');
const OwnerCMD = require('./Extern_Commands/Assets/OwnerCommands.json');
const zaad = require('./Extern_Commands/Zaad');
const makeEmbed = require('./Extern_Commands/MakeEmbed');
const help = require('./Extern_Commands/help');
const UserInfo = require('./Extern_Commands/UserInfo');
const JanSmit = require('./Extern_Commands/JanSmit');
const Pubg = require('./Extern_Commands/pubg');
const meep = require('./Extern_Commands/meep');
const messageDelete = require('./Extern_Commands/Owner/Delete');
const restart = require('./Extern_Commands/Owner/restart');
const shutdown = require('./Extern_Commands/Owner/shutdown');
const owo = require('./Extern_Commands/OwO');
const join = require('./Extern_Commands/SoundCommands/Join');
const leave = require('./Extern_Commands/SoundCommands/leave');
const queueDisplay = require('./Extern_Commands/SoundCommands/queue');
const {execute:playSongs} = require('./Extern_Commands/SoundCommands/play');
const stop = require('./Extern_Commands/SoundCommands/stop');
const skip = require('./Extern_Commands/SoundCommands/skip');
const pingy = require('./Extern_Commands/ping');
const now = require('./Extern_Commands/SoundCommands/now');
const shuffle = require('./Extern_Commands/SoundCommands/shuffle');
//#endregion

//#region Startup
//hier maak ik de status van de bot en geeft ik een output dat de bot runt
client.once('ready', () => {
    console.log('De fabriek staat op volle kracht');
    client.user.setActivity("Use !commands", {
        type: "PLAYING"
    });
});

// hier pak ik de login token die ik in mijn json heb staan
client.login(config.token);
//#endregion

client.on('message', message => {
//#region Global variables
    //hier pak ik de gehele message en stop ik die in messageArr de split zorgt dat alles na een spatie een eigen stuk in de array krijgt
    const messageArr = message.content.split(' ');
    //hier pak ik de eerste deel van de array(dus de commando)
    const command = messageArr.shift().toLowerCase();
    //hier pak ik de rest van de array
    const param = [...messageArr];
    //checkt of je de owner bent van de server via id
    let isBotOwner = message.author.id === config.UserId;
//zodat andere bot niets kan
    if (message.author.bot) {
        return;
    }
//#endregion
    switch (command) {
        case config.prefix + Commandfile.Zaad:
            zaad(message);
            break;
        case config.prefix + Commandfile.Embed:
            if (param.length !== 2) {
                message.channel.send(`You didn't provide atleast 2 arguments, ${message.author}!`);
            } else
                message.channel.send(makeEmbed(param.shift(), param.shift(), param.join(' ')))
            break; //als je hem zelf maakt
        case config.prefix + Commandfile.help:
            //als je de owner bent krijg je ook de owner commands te zien anders alleen de commands voor iedereen
            help(message, isBotOwner);
            break; //deze command laat alle andere commands zien
        case config.prefix + Commandfile.info:
            UserInfo(message);
            break; //hele mooie info laat ook je foto zien
        case config.prefix + Commandfile.jan: //janmsit text
            JanSmit(message);
            break;
        case config.prefix + Commandfile.Pubg:
            Pubg(message);
            break; //mooie video
        case config.prefix + Commandfile.meep:
            //hier pakt hij de link,
            meep(message, param)
            break;  //hentai command
    }
    //#region OwnerCommands
    //#region shutdown_command
    switch (command) {
        case config.prefix + OwnerCMD.restart:
            if (!isBotOwner) return;
            restart(message, queue, client)
            break;
        case config.prefix + OwnerCMD.Shutdown:
            if (!isBotOwner) return;
            shutdown(message, client)
            break;
    }

    //#endregion
    //#endregion
});  //kijkt naar de messages, maar kan geen emoij react geven

const queue = new Map();
client.on('message', async message => {
    //#region global variable
    //hier pak ik de gehele message en stop ik die in messageArr de split zorgt dat alles na een spatie een eigen stuk in de array krijgt
    const messageArr = message.content.split(' ');
    //hier pak ik de hele zin
    const command = messageArr.shift().toLowerCase();
    //hier pak ik de rest van de array
    const param = [...messageArr];
    //dit is alleen voor de owner aka ik
    let isBotOwner = message.author.id == config.UserId;
    // hier maak ik iets aan
    client.delete = new Discord.Collection();
    //zodat andere bots mij niet kunnen gebruiken
    if (message.author.bot) {
        return;
    }
    //#endregion
    //#region owo function
    switch (command) {
        case (config.prefix + Commandfile.OwO):
            owo(message);
            break;
    }
    //#endregion
    //#region Delete function
    switch (command) {
        case config.prefix + OwnerCMD.Delete:
            if (!isBotOwner) {
                return;
            }
            await messageDelete.execute(message, param)
            break;
    }


    //#endregion
    //#region sound-bot
    let serverQueue = queue.get(message.guild.id);
    // als er nog geen andere liedjes er zijn dan maakt hij een nieuwe queue aan
    if (!serverQueue) {
        serverQueue = {
            textChannel: message.channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        // hij kijkt eerst of er een connectie is dan gooit hij dat in de construct zodat het ipv null true or false is, dan speelt hij het eerste liedje van de queue
        queue.set(message.guild.id, serverQueue);
    }

    switch (command) {
        case config.prefix + Commandfile.join:
            const voiceChannel = message.member.voice.channel;
            join(message, voiceChannel)
            break;
        case config.prefix + Commandfile.leave:
            leave(serverQueue, message);
            break;
        case config.prefix + Commandfile.play:
            await playSongs(message, serverQueue, queue);
            break;
        case config.prefix + Commandfile.skip:
            skip(message, serverQueue, queue);
            break;
        case config.prefix + Commandfile.stop:
            stop(message, serverQueue);
            break;
        case config.prefix + Commandfile.queue:
            queueDisplay(serverQueue, message);
            break;
        case config.prefix + Commandfile.now:
          now(message,serverQueue);
            break;
        case config.prefix + Commandfile.shuffle:
            shuffle(serverQueue, message);
    }
    //#endregion
    switch (command)
    {
        case config.prefix+Commandfile.ping:
            pingy(message);
    }
});
//#region functions
client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (oldMember.channel && !newMember.channel) {
        queue.delete(oldMember.guild.id)
        console.log('old: leaved');
    } else if (newMember.channel && !oldMember.channel) {
        console.log('new: joined');
    } else if (!oldMember.channel && !newMember.channel) {
        console.log('nothing');
    } else if (oldMember.channel === newMember.channel) {
        console.log('same');
    } else {
        console.log('old', oldMember.channel);
        console.log('new', newMember.channel);
    }
});
//#endregion


