import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';

import streamAudio from '@/lib/streamAudio'
import { fetchPlaylist, fetchWatch } from '@/lib/fetch';



function downloadContent(manifestUri, title) {
  // Construct a metadata object to be stored along side the content.
  // This can hold any information the app wants to be stored with the
  // content.
  const metadata = {
    'title': title,
    'downloaded': Date()
  };

  return window.storage.store(manifestUri, metadata);
}

function setMediaSessionControls() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
      player.state.status = 'pause';

      audio.value.play().catch(err => {
        console.log(err);
        player.state.status = 'play';
      });
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audio.value.pause();
      player.state.status = 'play';
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      if (data.state.urls.length > 2) {
        const i = data.state.urls.findIndex(s => s.url == data.state.url);

        data.getSong(data.state.urls[i - 1].url);
      }
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (data.state.urls.length > 2) {
        const i = data.state.urls.findIndex(s => s.url == data.state.url);

        data.getSong(data.state.urls[i + 1].url);
      }
    });

    navigator.mediaSession.setActionHandler('seekbackward', () => {
      audio.value.currentTime -= 10;
    });

    navigator.mediaSession.setActionHandler('seekforward', () => {
      audio.value.currentTime += 10;
    });
  }
}


function Playlist() {
  const router = useRouter()
  const { id: playlistID } = router.query
  const audioRef = useRef(null);

  const [song, setSong] = useState({});
  const [mode, setMode] = useState('REPEAT_PLAYLIST');

  const playlist = useQuery(['playlists', playlistID], () => fetchPlaylist(playlistID), {
    enabled: Boolean(playlistID),
  });
  const watch = useQuery(['watch', song.id], () => fetchWatch(song.id), {
    enabled: Boolean(song.id),
  });

  const songs = playlist?.data?.data?.relatedStreams || [];

  useEffect(() => {
    if( ! watch.isSuccess) {
      return;
    }

    const { audioStreams, hls, duration } = watch.data.data
    streamAudio({streams: audioStreams, hls, duration}, audioRef.current)

    console.log({song})

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.uploaderName,
        album: playlist.data.data.name,
        artwork: [
          { src: playlist.data.data.thumbnailUrl,  type: 'image/webp' },
        ]
      });
    }
  }, [watch.isSuccess]);

  function handleSongClick(item) {
    setSong({
      id: item.url.replace('/watch?v=', ''),
      ...item,
    })
  }

  function handleNextTrack() {
    const currentSongIndex = songs.findIndex(s => s.url.endsWith(song.id));
    const nextSong = songs[currentSongIndex + 1];
    if(mode === 'REPEAT_PLAYLIST') {
      handleSongClick(nextSong || songs[0]);
    } else if (nextSong) {
      handleSongClick(nextSong);
    }
  }

  async function handleDownload(item) {
    window.storage.list().then(console.log)

    const metadata = {
      id: item.url.replace('/watch?v=', ''),
      'title': item.title,
      'downloaded': Date()
    };
    

    const { useDash } = await import('../../lib/dash');
    const { audioStreams, duration } = watch.data.data
    const dash = useDash(audioStreams, duration);
    const url = 'data:application/dash+xml;charset=utf-8;base64,' + btoa(dash);

    window.storage.store(url, metadata)
  }

  return (
    <>
          <div id="bg-artwork" style={ ! playlist.isSuccess ? {} : { backgroundImage: `url(${playlist.data.data.thumbnailUrl})` }} />
      <div id="bg-layer" />
    <div className="playlist">
      {playlist.isLoading && 'is loading...'}
      {playlist.isSuccess && (
        <div>
          {playlist.data.data.name}
          <div id="album-art" className={song.id ? 'active' : ''}>
        <img src={playlist.data.data.thumbnailUrl} />
            </div>
      </div>
      )}
            {song.id && (
    <div className='shadow'>
      <b>Playing </b>
    {song.title}
    |
    {song.id}
    <audio controls ref={audioRef} onEnded={handleNextTrack} autoPlay></audio>
    </div>
      )}
      {playlist.isSuccess && songs.map(item =>
        <div className={`p-4 ${item.url.endsWith(song.id) ? 'text-blue-400' : ''}`}  key={item.url}>
          <span onClick={() => handleSongClick(item)}>{item.title}</span>
          {item.url.endsWith(song.id) && (
            <>
                      {' | '}
          <span onClick={() => handleDownload(item)}>Download</span>
          </>
          )}
        </div>)}
    </div>
    </>
  )
}



export default Playlist
