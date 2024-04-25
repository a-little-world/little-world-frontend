const selectedTracks = { video: null, audio: null };

const removeTrack = track => {
  track
    .stop()
    .detach()
    .forEach(e => {
      e.remove();
    });
  selectedTracks[track.kind] = null;
};

export const removeActiveTracks = () => {
  if (selectedTracks.video) {
    removeTrack(selectedTracks.video);
  }
  if (selectedTracks.audio) {
    removeTrack(selectedTracks.audio);
  }
};

export const saveTrack = (track, id) => {
  const { kind } = track;
  selectedTracks[kind] = track;
  selectedTracks[kind].deviceId = id; // need this for restarting after mute
  if (localStorage.getItem(`${kind} muted`) === 'true') {
    selectedTracks[kind].disable();
  }
  return selectedTracks[track.kind];
};

export const clearActiveTracks = () => {
  // LiveKit isn't handling disconnecting user's devices so we must do it manually
  const video = document.querySelector('video');
  const audio = document.querySelector('audio');

  const vidStream = video?.srcObject as MediaStream;
  const audioStream = audio?.srcObject as MediaStream;

  const vidTracks = vidStream?.getTracks();
  const audioTracks = audioStream?.getTracks();
  console.log({ audioTracks, audio, vidTracks, video });

  vidTracks?.map(track => {
    track?.stop();
    vidStream.removeTrack(track);
  });

  // navigator.mediaDevices
  //   .getUserMedia({ video: false, audio: true })
  //   .then((mediaStream: MediaStream) => {
  //     const tracks = mediaStream.getTracks();
  //     console.log({ mediaStream, tracks });
  //     tracks?.forEach(track => {
  //       track.stop();
  //       mediaStream.removeTrack(track);
  //     });
  //   });

  // navigator.mediaDevices
  //   .getUserMedia({ video: true, audio: true })
  //   .then((mediaStream: MediaStream) => {
  //     const tracks = mediaStream.getTracks();
  //     console.log({ mediaStream, tracks });
  //     tracks?.forEach(track => {
  //       track?.stop();
  //       // mediaStream.removeTrack(track);
  //     });
  //   })
  //   .catch(error => console.log('media error', { error }));

  // navigator.mediaDevices
  //   .getUserMedia({ video: true, audio: false })
  //   .then((mediaStream: MediaStream) => {
  //     const tracks = mediaStream.getTracks();
  //     console.log({ mediaStream, tracks });
  //     tracks?.forEach(track => {
  //       track?.stop();
  //       mediaStream.removeTrack(track);
  //     });
  //   })
  //   .catch(error => console.log('media error', { error }));
};
