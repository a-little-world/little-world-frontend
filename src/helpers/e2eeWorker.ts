import type { KeyProviderOptions } from 'livekit-client';

import { E2EE_WORKER_ENDPOINT } from '../api/endpoints';
import { environment } from '../environment';

const WORKER_READY_TIMEOUT_MS = 5000;

// One worker is enough for the whole page and cheaper than creating one per call. It is
// never terminated: tracks from later calls keep their transform bound to it.
let e2eeWorker: Promise<Worker> | undefined;

// Native loads the web bundle from a local origin, so a worker served by the backend would be
// cross-origin and the browser forbids constructing a Worker from a cross-origin URL. There it
// is started from the source inlined by scripts/generate-livekit-e2ee-worker.mjs instead; the
// blob: URL inherits the document origin.
const createWorkerFromInlinedSource = async (): Promise<Worker> => {
  const { default: workerSource } =
    await import('../../prebuild/livekit-e2ee-worker-2.22.3');
  return new Worker(
    URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' })),
  );
};

// Web loads the worker from the backend so it is same-origin. Prod serves every webpack asset
// from S3, and a cross-origin worker URL is rejected regardless of CORS, so a webpack worker
// chunk would only work locally. The backend serves the raw worker at E2EE_WORKER_ENDPOINT.
const createWorkerFromBackend = (): Promise<Worker> =>
  Promise.resolve(
    new Worker(`${environment.backendUrl}${E2EE_WORKER_ENDPOINT}`),
  );

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

export const getE2EEWorker = async (
  keyProviderOptions: KeyProviderOptions,
): Promise<Worker> => {
  e2eeWorker ??= (
    environment.isNative
      ? createWorkerFromInlinedSource()
      : createWorkerFromBackend()
  ).catch(error => {
    e2eeWorker = undefined;
    throw error;
  });
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
