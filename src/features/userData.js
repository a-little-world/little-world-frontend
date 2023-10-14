import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const beToFe = (
  str // change from underscore_case to camelCase
) =>
  str
    .split("_")
    .reduce((acc, val, i) => (i === 0 ? val : acc + val.charAt(0).toUpperCase() + val.slice(1)));

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {},
  reducers: {
    initialise: (state, action) => {
      // TODO: this should NEVER be called twice will overwrite the full state
      console.log("PAYLOAD", action.payload);
      // state = {...action.payload};
      state.communityEvents = action.payload.communityEvents;
      state.user = action.payload.user;
      state.notifications = action.payload.notifications;
      state.matches = action.payload.matches;
      state.apiOptions = action.payload.apiOptions;
      state.formOptions = action.payload.apiOptions.profile;
    },
    updateProfile: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state.user.profile[key] = action.payload[key];
      });
    },
  },
});

export const { initialise, updateProfile } = userDataSlice.actions;

export default userDataSlice.reducer;
