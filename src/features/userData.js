import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {},
  reducers: {
    initialise: (state, action) => {
      // TODO: this should NEVER be called twice will overwrite the full state
      console.log("PAYLOAD", action.payload, { state, action });
      // state = {...action.payload};
      state.communityEvents = action.payload?.communityEvents;
      state.user = action.payload?.user;
      state.notifications = action.payload?.notifications;
      state.matches = action.payload?.matches;
      state.apiOptions = action.payload?.apiOptions;
      state.formOptions = action.payload?.apiOptions.profile;
    },
    updateProfile: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state.user.profile[key] = action.payload[key];
      });
    },
    updateSearchState: (state, action) => {
      state.user.isSearching = action.payload;
    },
  },
});

export const { initialise, updateProfile, updateSearchState } = userDataSlice.actions;

export default userDataSlice.reducer;
