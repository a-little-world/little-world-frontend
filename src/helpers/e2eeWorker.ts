import type { KeyProviderOptions } from 'livekit-client';

const WORKER_READY_TIMEOUT_MS = 5000;

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

// livekit never checks the worker loaded; a dead one silently drops all call media.
// init is safe to send twice, livekit sends it again on room setup.
const waitUntilReady = (
  worker: Worker,
  keyProviderOptions: KeyProviderOptions,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const settle = (error?: Error) => {
      clearTimeout(timeout);
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      if (error) reject(error);
      else resolve();
    };
    const onMessage = (event: MessageEvent) => {
      if (event.data?.kind === 'initAck') settle();
    };
    const onError = (event: ErrorEvent) =>
      settle(new Error(`e2ee worker failed: ${event.message}`));
    const timeout = setTimeout(
      () => settle(new Error('e2ee worker did not respond')),
      WORKER_READY_TIMEOUT_MS,
    );

    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    worker.postMessage({
      kind: 'init',
      data: { keyProviderOptions, loglevel: 'warn' },
    });
  });

// Metro can't emit worker chunks, see scripts/generate-livekit-e2ee-worker.mjs
export const getE2EEWorker = async (
  keyProviderOptions: KeyProviderOptions,
): Promise<Worker> => {
  e2eeWorker ??= createWorkerFromInlinedSource();
  try {
    const worker = await e2eeWorker;
    await waitUntilReady(worker, keyProviderOptions);
    return worker;
  } catch (error) {
    e2eeWorker = undefined;
    throw error;
  }
};

export default getE2EEWorker;
