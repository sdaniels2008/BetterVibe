import axios from 'axios'

const client = axios.create({
  baseURL: `https://watchapi.whatever.social`,
});

export function fetchSearch(term) {
    return client.get(`/search?q=${term}&filter=music_albums`);
}
