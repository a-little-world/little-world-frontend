// LiveKit doesn't release the PreJoin devices itself, so the join flow used to stop them
// synchronously. That tears down the WebView's communication-mode audio session right as
// the room connects, and the partner's remote audio can latch onto the media stream.
// Keep the preview microphone alive across the transition (stop only the camera) until
// LiveKit's own mic track is live, then release it.
let heldPreviewAudioTracks: MediaStreamTrack[] = [];

export const holdPreviewAudioTracks = () => {
  const video = document.querySelector('video');
  const stream = video?.srcObject as MediaStream | null | undefined;
  if (!stream) return;

  stream.getVideoTracks().forEach(track => {
    track.stop();
    stream.removeTrack(track);
  });

  heldPreviewAudioTracks = stream.getAudioTracks();
};

export const releasePreviewAudioTracks = () => {
  heldPreviewAudioTracks.forEach(track => track.stop());
  heldPreviewAudioTracks = [];
};
