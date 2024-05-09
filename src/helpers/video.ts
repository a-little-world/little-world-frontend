export const clearActiveTracks = () => {
  // LiveKit isn't handling disconnecting user's devices so we must do it manually
  const video = document.querySelector('video');

  const vidStream = video?.srcObject as MediaStream;
  const vidTracks = vidStream?.getTracks();

  vidTracks?.map(track => {
    track?.stop();
    vidStream.removeTrack(track);
  });
};
