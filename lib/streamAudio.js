export default async function streamAudio(res, audioDomElement) {
  const shaka = import('shaka-player/dist/shaka-player.compiled.js');

  let url, mime;

  if (window.MediaSource !== undefined && res.streams.length > 0) {
    const { useDash } = await import('./dash.js');

    const dash = useDash(res.streams, res.duration);

    url = 'data:application/dash+xml;charset=utf-8;base64,' + btoa(dash);
    mime = 'application/dash+xml';
  } else if (res.hls) {
    url = res.hls;
    mime = 'application/x-mpegURL';
  } else if (res.streams.length > 0) {
    url = res.streams[0].url;
    mime = res.streams[0].mimeType;
  }

  function createPlayer() {
    return shaka
      .then(shaka => shaka.default)
      .then(shaka => {
        shaka.polyfill.installAll();

        if (shaka.Player.isBrowserSupported) {
          const audioPlayer = new shaka.Player(audioDomElement);

          // const codecs = store.getItem('codec');
          const codecs = null;

          audioPlayer
            .getNetworkingEngine()
            .registerRequestFilter((_type, req) => {
              const headers = req.headers;

              let url = new URL(req.uris[0]);

              if (url.pathname.indexOf('/videoplayback') > -1) {
                if (headers.Range) {
                  url.searchParams.set('range', headers.Range.split('=')[1]);
                  req.headers = {};
                  req.uris[0] = url.toString();
                }
              }
            });

          audioPlayer.configure({
            preferredAudioCodecs: codecs ? codecs.split(':') : ['opus', 'mp4a'],
            manifest: {
              disableVideo: true,
            },
          });

          console.log('>> Audio player created.', window.audioPlayer)
          window.audioPlayer = audioPlayer;

          window.storage = new shaka.offline.Storage(audioPlayer);
          window.storage.configure({
            offline: {
              // progressCallback(content, progress) {
              //   console.log(progress)
              // },
              trackSelectionCallback: selectTracks
            }
          });
        }
      });
  }

  // const quality = store.getItem('quality');
  const quality = null;

  if( ! window.audioPlayer) {
    await createPlayer();
  }

  if (url) {
    window.audioPlayer
      .load(url, 0, mime)
      .then(() => {
        window.audioPlayer.configure('abr.enabled', true);

        if (quality && quality != 'auto') {
          window.audioPlayer.configure('abr.enabled', false);

          const tracks = window.audioPlayer.getVariantTracks(),
            bandwidths = tracks.map(i => i.bandwidth);

          let sel;

          if (quality == 'best') sel = Math.max(...bandwidths);
          else if (quality == 'worst') sel = Math.min(...bandwidths);

          if (sel)
            window.audioPlayer.selectVariantTrack(
              tracks[bandwidths.indexOf(sel)],
            );
        }
      })
      .catch(err => {
        console.error('Code: ' + err.code, err);
      });
  }
  
}


function selectTracks(tracks) {
  // This example stores the highest bandwidth variant.
  //
  // Note that this is just an example of an arbitrary algorithm, and not a best
  // practice for storing content offline.  Decide what your app needs, or keep
  // the default (user-pref-matching audio, best SD video, all text).
  const found = tracks
      .filter(function(track) { return track.type == 'variant'; })
      .sort(function(a, b) { return a.bandwidth - b.bandwidth; })
      .pop();
  console.log('Offline Track bandwidth: ' + found.bandwidth, found);
  return [ found ];
}
