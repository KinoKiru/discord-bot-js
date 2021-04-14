const ytsr = require('ytsr');
const fetch = require('node-fetch');
let headers;
fetch('https://open.spotify.com/get_access_token?reason=transport&productType=web_player')
    .then(res => res.json())
    .then(json => {
        headers = { 'Authorization': 'Bearer ' + json['accessToken'] }
    })
    .catch(console.log);

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

            const songs = await Promise.all(result.items.map(async ({ track }) => {
                duration = msToSeconds(track.duration_ms);
                const song = await searchYT(track.name);
                if (song) {
                    return {
                        title: track.name,
                        url: song.url,
                        duration: secondsToTime(duration),
                        durationSeconds: duration,
                        thumbnail: (track.album.images[0] || {}).url
                    };
                } else {
                    msg.channel.send('Could not find a youtube equivalent of ' + track.name);
                }
            }));
            return { songs };
        } else if (song_id) {
            track = await (await fetch(`https://api.spotify.com/v1/tracks/${song_id}/`,
                { headers },
            )).json();

            const duration = msToSeconds(track.duration_ms);
            let song = await searchYT(track.name);
            if (song) {
                song = {
                    title: track.name,
                    url: song.url,
                    duration: secondsToTime(duration),
                    durationSeconds: duration,
                    thumbnail: (track.album.images[0] || {}).url
                };
            } else {
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

async function searchYT(query) {
    const filters1 = await ytsr.getFilters(query);
    const filter1 = filters1.get('Type').get('Video');
    if (filter1.url) {
        const [result] = (await ytsr(filter1.url, { limit: 1 })).items;
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