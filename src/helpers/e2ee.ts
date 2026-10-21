import { ExternalE2EEKeyProvider, isE2EESupported, Room } from 'livekit-client';

// One worker is enough for the whole page and cheaper than creating one per call. It is
// never terminated: tracks from later calls keep their transform bound to it.
let e2eeWorker: Worker | undefined;

export const isE2EEAvailable = () =>
  isE2EESupported() &&
  typeof Worker !== 'undefined' &&
  typeof globalThis.crypto?.subtle !== 'undefined';

/**
 * Builds a Room that encrypts all published media with the shared key the backend handed
 * out with the access token. E2EE must be enabled before connecting, otherwise tracks that
 * are published on signal-connected go out unencrypted and have to be republished.
 */
export const createEncryptedRoom = async (key: string): Promise<Room> => {
  const keyProvider = new ExternalE2EEKeyProvider();
  await keyProvider.setKey(key);

  e2eeWorker ??= new Worker(
    new URL('livekit-client/e2ee-worker', import.meta.url),
  );

  const room = new Room({
    encryption: { keyProvider, worker: e2eeWorker },
  });
  await room.setE2EEEnabled(true);
  return room;
};
