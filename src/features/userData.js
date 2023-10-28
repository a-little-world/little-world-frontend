import { createSlice } from "@reduxjs/toolkit";

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
    updateSearchState: (state, action) => {
      state.user.isSearching = action.payload;
    },
    addMatch: (state, action) => {
      const { category, match } = action.payload;
      state.matches[category].items.push(match);
    },
    removeMatch: (state, action) => {
      const { category, match } = action.payload;
      const { id, ...rest } = match;
      state.matches[category] = state.matches[category].items.filter((m) => m.id !== id);
    },
    updateMatch: (state, action) => {
      const { category, match } = action.payload;
      const { id, ...rest } = match;
      const matchIndex = state.matches[category].findIndex((m) => m.id === id);
      if(matchIndex !== -1)
        state.matches[category][matchIndex] = {...state.matches[category][matchIndex], ...rest};
    },
    changeMatchCategory: (state, action) => {
      const { category, match, newCategory } = action.payload;
      const matchToMove = state.matches[category].items.find((m) => m.id === match.id);
      state.matches[newCategory].items.push(matchToMove);
      state.matches[category].items = state.matches[category].items.filter((m) => m.id !== match.id);
    },
  },
});

export const { 
  initialise, 
  updateProfile, 
  updateSearchState,
  addMatch,
  updateMatch,
  removeMatch,
  changeMatchCategory
} = userDataSlice.actions;

export default userDataSlice.reducer;
