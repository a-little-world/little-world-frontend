export const clearActiveTracks = () => {
  // LiveKit isn't handling disconnecting user's devices so we must do it manually
  const video = document.querySelector('video');

  const vidStream = video?.srcObject as MediaStream;
  const vidTracks = vidStream?.getTracks();

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
