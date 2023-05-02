import axios from 'axios'

// https://raw.githubusercontent.com/wiki/TeamPiped/Piped-Frontend/Instances.md
const pipedServers = [
  "https://watchapi.whatever.social",
  "https://pipedapi.tokhmi.xyz",
  "https://pipedapi.moomoo.me",
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.qdi.fi",
  "https://pipedapi.syncpundit.io",
  "https://api-piped.mha.fi",
  "https://piped-api.garudalinux.org",
  "https://pipedapi.rivo.lol",
  "https://pipedapi.aeong.one",
  "https://pipedapi.leptons.xyz",
  "https://piped-api.lunar.icu",
  "https://pipedapi-libre.kavin.rocks",
  "https://api.yt.777.tf",
  "https://pa.mint.lgbt",
  "https://pa.il.ax",
  "https://piped-api.privacy.com.de",
  "https://pipedapi.esmailelbob.xyz",
  "https://api.piped.projectsegfau.lt",
  "https://pipedapi.in.projectsegfau.lt",
  "https://pipedapi.us.projectsegfau.lt",
  "https://api.piped.privacydev.net",
  "https://pipedapi.palveluntarjoaja.eu",
  "https://p.plibre.com",
  "https://pipedapi.smnz.de",
  "https://pipedapi.adminforge.de",
  "https://piped-api.hostux.net",
  "https://pdapi.vern.cc",
  "https://pipedapi.chauvet.pro",
  "https://pipedapi.berryez.xyz",
];

// https://raw.codeberg.page/Hyperpipe/pages/api/backend.json
const backends = [
  'https://hyperpipeapi.esmailelbob.xyz',
  'https://hyperpipeapi.onrender.com',
  'https://listenapi.whatever.social',
  'https://musicapi.adminforge.de',
];

const client = axios.create({
  timeout: 3_000,
  baseURL: pipedServers[0],
});

const backendClient = axios.create({
  timeout: 3_000,
  baseURL: backends[0],
});

let currentPipedServer = 0;
let currentBackend = 0;



client.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;

    const delayRetryRequest = new Promise((resolve) => {
      setTimeout(() => {
        currentPipedServer = currentPipedServer + 1;
        currentPipedServer = pipedServers[currentPipedServer] ? currentPipedServer : 0;
        config.baseURL = pipedServers[currentPipedServer]
        console.log("retry the request", config.baseURL);
        resolve();
      }, 200)
    });

    return delayRetryRequest.then(() => client(config));
  }
);

backendClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;

    const delayRetryRequest = new Promise((resolve) => {
      setTimeout(() => {
        currentBackend = currentBackend + 1;
        currentBackend = backends[currentBackend] ? currentBackend : 0;
        config.baseURL = backends[currentBackend]
        console.warn("retry the request", config.baseURL);
        resolve();
      }, 200)
    });

    return delayRetryRequest.then(() => backendClient(config));
  }
);

export function fetchSearch(term) {
  return client.get(`/search?q=${term}&filter=music_songs`);
}

export function fetchPlaylist(id) {
  return client.get(`playlists/${id}`);
}

export function fetchWatch(id) {
  return client.get(`/streams/${id}`)
}

export function fetchGenres() {
  return backendClient.get(`/genres`)
}

export function fetchGenre(id) {
  return backendClient.get(`/genres/${id}`)
}
