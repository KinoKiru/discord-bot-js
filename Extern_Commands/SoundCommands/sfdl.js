const ytsr = require('ytsr');
const fetch = require('node-fetch');
let headers;
let expires;

async function refreshToken() {
    try {
        const token = await (await fetch('https://open.spotify.com/get_access_token?reason=transport&productType=web_player')).json();
        headers = {'Authorization': 'Bearer ' + token['accessToken']};
        expires = token['accessTokenExpirationTimestampMs'];
        console.log('Got meself a new token matey');
    } catch (error) {
        console.log(error)
    }
}

refreshToken().then();

/**
 *
 * Can be used like:
 * const {song, songs} = require('./path/to/sfdl');
 * if (song) {
 *  // One song
 * } else {
 *  // Array of songs
 * }
 * 
 * @param {*} msg 
 * @param {*} url 
 * @returns {song | songs}
 */
async function get(msg, url) {
    if (url) {

        if (Date.now() >= expires) {
            await refreshToken()
        }

        //https://open.spotify.com/playlist/11o2tmMwFcfQ54ZFmgw9wY
        const playlist_id = url.split('/playlist/')[1];
        const song_id = url.split('/track/')[1];
        if (playlist_id) {
            const offset = 0;
            const limit = 100;

            // get 'limit' tracks and parse it
            result = await (await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?offset=${offset}&limit=${limit}`,
                { headers },
            )).json();


            const songs = (await Promise.all(result.tracks.items.map(async ({track}) => {
                const song = await searchYT(track.artists[0].name + ' ' + track.name, track);
                if (!song) {
                    await msg.channel.send('Could not find a youtube equivalent of ' + track.name);
                    return undefined;
                }
                return song;
            }))).filter(m => m !== undefined);

            return {songs};

        } else if (song_id) { //dit is voor 1 nummer
            track = await (await fetch(`https://api.spotify.com/v1/tracks/${song_id}/`,
                {headers},
            )).json();

            let song = await searchYT(track.name + ' ' + track.artists[0].name, track);
            console.log(song);
            if (!song) {
                msg.channel.send('Could not find a youtube equivalent of ' + track.name);
            }
            return {song};
        } else {
            throw Error('Could not find any songs from this url');
        }
    } else {
        throw Error('Url should not be empty');
    }
}

async function searchYT(query, track) {

    const filters1 = await ytsr.getFilters(query);
    const filter1 = filters1.get('Type').get('Video');

    if (filter1.url) {
        //hij pakt 20 songs en kijkt welke tussen de timespan past en pakt dan de relavante
        const [result] = (await ytsr(filter1.url, {limit: 20})).items.filter(function (song) {
            //true meenemen false niet meenemen
            let trackTime = msToSeconds(track.duration_ms);
            let songToSeconds = timeToSeconds(song.duration);
            // return of true als het binnen 2 minuten range is anders false en wordt hij niet meegenomen
            return trackTime < (songToSeconds + 120) && trackTime > (songToSeconds - 120);
        });

        if (result) {
            return {
                title: result.title,
                url: result.url,
                isLive: result.isLive,
                duration: result.duration || '',
                durationSeconds: timeToSeconds(result.duration),
                thumbnail: result.bestThumbnail.url
            };
        }
    }
}

function timeToSeconds(time) {
    if (!time || time === '') return 0;
    const split = time.split(':');
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (split.length === 3) {
        const [h, m, s] = split;
        hours = +h;
        minutes = +m;
        seconds = +s;
    } else {
        const [m, s] = split;
        minutes = +m;
        seconds = +s;
    }
    return (hours * 3600) + (minutes * 60) + seconds;
}

function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600).toString();
    const minutes = Math.floor(seconds / 60 % 60).toString();
    const seconds2 = Math.max(0, seconds % 60 - 1).toString();
    return (hours === '0' ? '' : hours.padStart(2, '0') + ':') + minutes.padStart(2, '0') + ':' + seconds2.padStart(2, '0');
}

function msToSeconds(ms) {
    return Math.floor(Math.max(0, ms / 1000));
}

module.exports = {
    get,
    searchYT
}
