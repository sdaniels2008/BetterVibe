import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';

import streamAudio from '@/lib/streamAudio'
import { fetchPlaylist, fetchWatch } from '@/lib/fetch';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner';

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
  const { id: playlistID, th } = router.query
  const audioRef = useRef(null);

  const [song, setSong] = useState({});
  const [mode, setMode] = useState('REPEAT_PLAYLIST');

  const playlist = useQuery(['playlists', playlistID], () => fetchPlaylist(playlistID), {
    enabled: Boolean(playlistID),
  });
  const watch = useQuery(['watch', song.id], () => fetchWatch(song.id), {
    enabled: Boolean(song.id),
  });

  const thumbnail = ! playlist.isLoading && th && playlist?.data?.data?.thumbnailUrl?.includes('hqdefault')
    ? th
    : playlist?.data?.data?.thumbnailUrl;

  const songs = playlist?.data?.data?.relatedStreams || [];

  useEffect(() => {
    if( ! watch.isSuccess) {
      return;
    }

    const { audioStreams, hls, duration } = watch.data.data
    streamAudio({streams: audioStreams, hls, duration}, audioRef.current)

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
          <div id="bg-artwork" style={ ! playlist.isSuccess ? {} : { backgroundImage: `url(${thumbnail})` }} />
      <div id="bg-layer" />
    <div className="playlist">
      <Header />
      {playlist.isLoading && <Spinner />}
      {playlist.isSuccess && (
        <div className='text-center p-4'>
          <img src={thumbnail} className="inline" />
          <h1 className='text-lg font-bold mt-4'>{playlist.data.data.name}</h1>
      </div>
      )}

      <Player thumbnail={thumbnail} song={song} audioRef={audioRef} onNextTrack={handleNextTrack} playlist={playlist} />

      {playlist.isSuccess && songs.map((item, index) => <Song song={song} key={item.url} item={item} index={index} onSongClick={handleSongClick} />)}
    </div>
    </>
  )
}

function Player({ thumbnail, song, audioRef, onNextTrack, playlist }) {
  if( ! song.id) {
    return null;
  }

  return (
    <div className='fixed backdrop-blur-md px-2 py-3 w-full inset-x-0 bottom-0'>
      <div className="flex items-center justify-between mb-5">
        <div className='w-2/5'>
          <div id="album-art" className={song.id ? 'active' : ''}>
        <img src={thumbnail} />
            </div>
      </div>

      <div className='w-3/5'>
        <div className='text-sm truncate'>{song.title}</div>
      </div>
      </div>
      <div>
      <audio controls ref={audioRef} onEnded={onNextTrack} autoPlay className="w-full"></audio>
      </div>
    </div>
  );
}

function Song({ item, index, onSongClick, song }) {
  const { minutes, remainingSeconds } = convertDurationToMinutesAndSeconds(item.duration);
  return (
    <div className={`flex justify-between p-4 ${item.url.endsWith(song.id) ? 'text-blue-400' : ''}`}  >
          <div className='flex items-center'>
          <div className="mr-4 w-6 text-center">{index + 1}</div>
          <div onClick={() => onSongClick(item)} className='cursor-pointer'>
            <div>{item.title}</div>
            <div>{item.uploaderName}</div>
          </div>
          </div>
          <div>{minutes}:{remainingSeconds}</div>
        </div>
  );
}

function convertDurationToMinutesAndSeconds(seconds) {
  const minutes = prependZero(Math.floor(seconds / 60));
  const remainingSeconds = prependZero(seconds % 60);
  return { minutes, remainingSeconds };
}

function prependZero(number) {
  return number < 10 ? `0${number}` : number;
}

export default Playlist
