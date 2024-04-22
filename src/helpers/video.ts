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
  console.log('CLEARING ACTIVE TRACKS', window.activeTracks);
  window.activeTracks.forEach(track => {
    track.stop();
  });
  window.activeTracks = [];
};
