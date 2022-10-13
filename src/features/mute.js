import { createSlice } from "@reduxjs/toolkit";

export const muteSlice = createSlice({
  name: "mute",
  initialState: {
    video: false,
    audio: false,
  },
  reducers: {
    muteVideo: (state, action) => {
      state.video = action.payload;
    },
    muteAudio: (state, action) => {
      state.audio = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { muteVideo, muteAudio } = muteSlice.actions;

export default muteSlice.reducer;
