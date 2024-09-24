import { createSlice } from '@reduxjs/toolkit';

/* eslint no-param-reassign: 0 */
export const tracksSlice = createSlice({
  name: 'tracks',
  initialState: {
    videoId: null,
    audioId: null,
  },
  reducers: {
    setAudio: (state, action) => {
      state.audioId = action.payload;
    },
    setVideo: (state, action) => {
      state.videoId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAudio, setVideo } = tracksSlice.actions;

export default tracksSlice.reducer;
