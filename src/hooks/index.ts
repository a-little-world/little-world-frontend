import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux';

import { RootState } from '../RootState';

// eslint-disable-next-line
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
