import { useEffect, useRef } from 'react'
import axios from 'axios'

import streamAudio from '@/lib/streamAudio'

const client = axios.create({
  baseURL: `https://watchapi.whatever.social`,
});

function Song() {
  const audioRef = useRef(null);

  useEffect(() => {
    async function getSong() {
    const term = 'gloria';

const search = (await client.get(`/search?q=${term}&filter=music_albums`)).data;

let result
for(const item of search.items) {
  if(result) continue;

  // TODO: use url parser instead of split
  console.log(item.uploaderName, item.url)
  result = item;
}

const playlistID = result.url.split('/playlist?list=')[1]

const playlist = (await client.get(`playlists/${playlistID}`)).data;

const songName = 'Unholy';
const song = playlist.relatedStreams.find(s => s.title === songName);

const watchID = song.url.split('/watch?v=')[1];

console.log({watchID})


return (await client.get(`https://pipedapi.qdi.fi/streams/${watchID}`)).data;
}

  getSong()
    .then(({ audioStreams, hls, duration }) => {
      return streamAudio({streams: audioStreams, hls, duration}, audioRef.current)
    })
  }, [])

  return (
    <div className="App">
      <audio controls ref={audioRef}></audio>
    </div>
  )
}



export default Song
