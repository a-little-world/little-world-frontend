import {
  createLocalTracks,
  CreateLocalTracksOptions,
  LocalTrack,
} from 'livekit-client';
import { create } from 'zustand';

type DeviceOptions = false | { deviceId: string };

interface CallTracksState {
  tracks: LocalTrack[];
  acquireTracks: (options: {
    audio: DeviceOptions;
    video: DeviceOptions;
  }) => Promise<void>;
  takeTracks: () => LocalTrack[];
  releaseTracks: () => void;
}

const createTracks = (options: CreateLocalTracksOptions) =>
  createLocalTracks(options).catch(error => {
    console.warn('[call-tracks] could not open device', error);
    return [];
  });

// no camera is named 'default', so open the front one like the preview does; Android picks
// any camera when facingMode is only a preference
const createCamera = async (video: { deviceId: string }) => {
  if (video.deviceId !== 'default') {
    return createTracks({ audio: false, video });
  }
  const tracks = await createLocalTracks({
    audio: false,
    video: { facingMode: { exact: 'user' } as unknown as 'user' },
  }).catch(() => createTracks({ audio: false, video: true }));
  // restarts reuse these constraints; an exact facingMode would block switching cameras
  tracks.forEach(
    track => delete (track.constraints as MediaTrackConstraints).facingMode,
  );
  return tracks;
};

// Opened while the preview is still running, so the browser shares the preview's mic and
// camera instead of reopening them, and they stay open while the call screen takes over.
const useCallTracksStore = create<CallTracksState>((set, get) => ({
  tracks: [],
  acquireTracks: async ({ audio, video }) => {
    const tracks = (
      await Promise.all([
        audio ? createTracks({ audio, video: false }) : [],
        video ? createCamera(video) : [],
      ])
    ).flat();
    get().releaseTracks();
    set({ tracks });
  },
  takeTracks: () => {
    const { tracks } = get();
    set({ tracks: [] });
    return tracks;
  },
  releaseTracks: () => {
    get().tracks.forEach(track => track.stop());
    set({ tracks: [] });
  },
}));

export default useCallTracksStore;
