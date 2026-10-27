import { environment } from '../environment';

// One worker is enough for the whole page and cheaper than creating one per call. It is
// never terminated: tracks from later calls keep their transform bound to it.
let e2eeWorker: Promise<Worker> | undefined;

const createWorkerFromInlinedSource = async (): Promise<Worker> => {
  const { default: workerSource } =
    await import('../../prebuild/livekit-e2ee-worker-2.22.3');
  return new Worker(
    URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' })),
  );
};

/**
 * Web builds let webpack emit a worker chunk via `new URL(..., import.meta.url)`.
 * Metro (the native WebView bundle) can neither emit worker chunks nor provide a
 * usable `import.meta.url`, so it starts the worker from the livekit-client source
 * inlined by scripts/generate-livekit-e2ee-worker.mjs instead.
 */
export const getE2EEWorker = (): Promise<Worker> => {
  e2eeWorker ??= (
    environment.isNative
      ? createWorkerFromInlinedSource()
      : Promise.resolve(
          new Worker(new URL('livekit-client/e2ee-worker', import.meta.url)),
        )
  ).catch(error => {
    e2eeWorker = undefined;
    throw error;
  });
  return e2eeWorker;
};

export default getE2EEWorker;
