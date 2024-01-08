import { createSlice, createSelector } from '@reduxjs/toolkit';

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    incomingCalls: [],
  },
  reducers: {
    initialise: (state, action) => {
      // TODO: this should NEVER be called twice will overwrite the full state
      console.log('PAYLOAD', action.payload, { state, action });
      // state = {...action.payload};
      state.communityEvents = action.payload?.communityEvents;
      state.user = action.payload?.user;
      state.notifications = action.payload?.notifications;
      state.matches = action.payload?.matches;
      state.apiOptions = action.payload?.apiOptions;
      state.formOptions = action.payload?.apiOptions.profile;
      state.incomingCalls = [
        {
          userId:
            'd20095ab-b24a-421e-9d61-816ae184c36d-454b2663-0abc-403d-bb07-9825b79695d6',
        },
      ];
      state.callSetup = action.payload?.callSetup || null; // { userId: user.hash } or null
      state.activeCall = action.payload?.activeCall || null; // { userId: user.hash, tracks: {} } or null
    },
    updateProfile: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state.user.profile[key] = action.payload[key];
      });
    },
    updateEmail: (state, action) => {
      if (state.user) {
        state.user.email = action.payload;
      } else {
        state.user = { email: action.payload };
      }
    },
    updateSearchState: (state, action) => {
      state.user.isSearching = action.payload;
    },
    initCallSetup: (state, action) => {
      state.callSetup = action.payload;
    },
    cancelCallSetup: (state, action) => {
      state.callSetup = null;
    },
    initActiveCall: (state, action) => {
      const { userId, tracks } = action.payload;
      state.activeCall = { userId, tracks };
    },
    stopActiveCall: (state, action) => {
      state.activeCall = null;
    },
    addMatch: (state, action) => {
      const { category, match } = action.payload;
      state.matches[category].items.push(match);
    },
    addIncomingCall: (state, action) => {
      const { userId } = action.payload;
      state.incomingCalls.push({ userId });
    },
    removeMatch: (state, action) => {
      const { category, match } = action.payload;
      const { id } = match;
      state.matches[category] = state.matches[category].items.filter(
        m => m.id !== id,
      );
    },
    updateMatch: (state, action) => {
      const { category, match } = action.payload;
      const { id, ...rest } = match;
      const matchIndex = state.matches[category].findIndex(m => m.id === id);
      if (matchIndex !== -1)
        state.matches[category][matchIndex] = {
          ...state.matches[category][matchIndex],
          ...rest,
        };
    },
    updateMatchProfile: (state, action) => {
      console.log('REDUCER', action.payload);
      const { partnerId, profile } = action.payload;
      Object.keys(state.matches).forEach(category => {
        const matchIndex = state.matches[category].items.findIndex(
          m => m.partner.id === partnerId,
        );
        if (matchIndex !== -1)
          state.matches[category].items[matchIndex].partner = {
            ...state.matches[category].items[matchIndex].partner,
            ...profile,
          };
      });
    },
    changeMatchCategory: (state, action) => {
      const { category, match, newCategory } = action.payload;
      const matchToMove = state.matches[category].items.find(
        m => m.id === match.id,
      );
      state.matches[newCategory].items.push(matchToMove);
      state.matches[category].items = state.matches[category].items.filter(
        m => m.id !== match.id,
      );
    },
    blockIncomingCall: (state, action) => {
      const { userId } = action.payload;
      state.incomingCalls = state.incomingCalls.filter(
        call => call.userId !== userId,
      );
    },
    updateConfirmedData: (state, action) => {
      state.matches.confirmed = action.payload;
    },
  },
});

export const {
  initialise,
  addMatch,
  updateEmail,
  updateProfile,
  updateSearchState,
  updateMatchProfile,
  updateMatch,
  removeMatch,
  changeMatchCategory,
  blockIncomingCall,
  updateConfirmedData,
  initCallSetup,
  cancelCallSetup,
  initActiveCall,
  stopActiveCall,
} = userDataSlice.actions;

export const selectMatchByPartnerId = (matches, partnerId) => {
  for (const category in matches) {
    const match = matches[category].items.find(m => m.partner.id === partnerId);
    if (match) return match;
  }
  return null;
};

export const selectMatchesDisplay = createSelector(
  [state => state.userData.matches],
  ({ confirmed, support }) =>
    confirmed.currentPage === 1
      ? [...support.items, ...confirmed.items]
      : [...confirmed.items],
);

export default userDataSlice.reducer;
