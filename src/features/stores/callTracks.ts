import type { LocalUserChoices } from '@livekit/components-react';
import {
  createLocalTracks,
  CreateLocalTracksOptions,
  LocalTrack,
} from 'livekit-client';
import { create } from 'zustand';

import { environment } from '../../environment';

type DeviceOptions = false | { deviceId: string };

type CallDeviceOptions = {
  audio: DeviceOptions;
  video: DeviceOptions;
  audioDeviceId?: string;
};

export const getDeviceOptions = (
  choices?: LocalUserChoices | null,
): CallDeviceOptions => ({
  audio: choices?.audioEnabled ? { deviceId: choices.audioDeviceId } : false,
  video: choices?.videoEnabled ? { deviceId: choices.videoDeviceId } : false,
  audioDeviceId: choices?.audioDeviceId,
});

interface CallTracksState {
  tracks: LocalTrack[];
  acquireTracks: (options: CallDeviceOptions) => Promise<void>;
  takeTracks: () => LocalTrack[];
  releaseTracks: () => void;
}

const createTracks = (options: CreateLocalTracksOptions) =>
  createLocalTracks(options).catch(error => {
    console.warn('[call-tracks] could not open device', error);
    return [];
  });

const createMic = async ({ audio, audioDeviceId }: CallDeviceOptions) => {
  if (audio) return createTracks({ audio, video: false });
  if (!environment.isNative) return [];
  // an open mic keeps the WebView in communication mode, so call audio plays on the call stream
  const tracks = await createTracks({
    audio: audioDeviceId ? { deviceId: audioDeviceId } : true,
    video: false,
  });
  await Promise.all(tracks.map(track => track.mute()));
  return tracks;
};

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
  tracks.forEach(track => {
    const { constraints } = track;
    delete constraints.facingMode;
  });
  return tracks;
};

// Opened before the call screen mounts so the mic is already live when the room connects.
// While a preview is still running, the browser shares its devices instead of reopening them.
const useCallTracksStore = create<CallTracksState>((set, get) => ({
  tracks: [],
  acquireTracks: async options => {
    const tracks = (
      await Promise.all([
        createMic(options),
        options.video ? createCamera(options.video) : [],
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
