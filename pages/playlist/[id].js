import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';

import streamAudio from '@/lib/streamAudio'
import { fetchPlaylist, fetchWatch } from '../fetch/search';

function Playlist() {
  const router = useRouter()
  const { id: playlistID } = router.query
  const audioRef = useRef(null);

  const [song, setSong] = useState({});

  const playlist = useQuery(['playlists', playlistID], () => fetchPlaylist(playlistID), {
    enabled: Boolean(playlistID),
  });
  const watch = useQuery(['watch', song.id], () => fetchWatch(song.id), {
    enabled: Boolean(song.id),
  });

  useEffect(() => {
    if( ! watch.isSuccess) {
      return;
    }

const { audioStreams, hls, duration } = watch.data.data
streamAudio({streams: audioStreams, hls, duration}, audioRef.current)
  }, [watch.isSuccess]);

  function handleSongClick(item) {
    setSong({
      id: item.url.replace('/watch?v=', ''),
      ...item,
    })
  }

  return (
    <div className="App">
      {song.id && (
    <div className='shadow'>
      <b>Playing </b>
    {song.title}
    |
    {song.id}
    <audio controls ref={audioRef}></audio>
    </div>
      )}
  

      {playlist.isLoading && 'is loading...'}
      {playlist.isSuccess && playlist.data.data.relatedStreams.map(item =>
        <div className="p-4 border" onClick={() => handleSongClick(item)}>{item.title}</div>)}
    </div>
  )
}



export default Playlist
