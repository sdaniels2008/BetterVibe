import axios from 'axios'

const client = axios.create({
  baseURL: `https://watchapi.whatever.social`,
});

export function fetchSearch(term) {
    return client.get(`/search?q=${term}&filter=music_albums`);
}

export function fetchPlaylist(id) {
  return client.get(`playlists/${id}`);
}

export function fetchWatch(id) {
  return client.get(`https://pipedapi.qdi.fi/streams/${id}`)
}
