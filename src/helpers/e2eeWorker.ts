import { E2EE_WORKER_ENDPOINT } from '../api/endpoints';
import { environment } from '../environment';

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

export const getE2EEWorker = (): Promise<Worker> => {
  e2eeWorker ??= (
    environment.isNative
      ? createWorkerFromInlinedSource()
      : createWorkerFromBackend()
  ).catch(error => {
    e2eeWorker = undefined;
    throw error;
  });
  return e2eeWorker;
};

export default getE2EEWorker;
