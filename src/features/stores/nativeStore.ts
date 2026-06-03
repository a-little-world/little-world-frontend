import { create } from 'zustand';

import { environment } from '../../environment';

interface NativeStoreState {
  ready: Promise<void>;
  setReady: () => void;
}

const useNativeStore = create<NativeStoreState>(() => {
  let setReady: () => void = () => {};
  const readyPromise = new Promise<void>(resolve => {
    setReady = () => resolve();

    if (!environment.isNative) {
      resolve();
    }
  });

  return {
    ready: readyPromise,
    setReady,
  };
});

export default useNativeStore;
