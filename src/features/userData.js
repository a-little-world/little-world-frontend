import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  raw: {},
  self: {},
  users: [],
  settings: {},
  notifications: [],
  interestsChoices: [],
  status: "no-thing",
};

const beToFe = (
  str // change from underscore_case to camelCase
) =>
  str
    .split("_")
    .reduce((acc, val, i) => (i === 0 ? val : acc + val.charAt(0).toUpperCase() + val.slice(1)));

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    initialise: (state, action) => {
      state.raw = action.payload;
      state = { ...state, ...action.payload };
    },
    setUsers: (state, action) => {
      const { payload } = action;
      const updatedUsers = [...state.users, payload];
      state.users = updatedUsers;
    },
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    fetchNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
    updateSettings: (state, action) => {
      Object.entries(action.payload).forEach(([itemIn, value]) => {
        const item = beToFe(itemIn); // ensure data is frontend formatted; does nothing if already
        state.settings[item] = value;

        // if name is changed, also update the users object
        if (["firstName", "lastName"].includes(item)) {
          state.users = state.users.map((user) => {
            if (user.type === "self") {
              state.self = { ...user, [item]: value };
              return { ...user, [item]: value };
            }
            return user;
          });
        }
      });
    },
    removePreMatch: (state, action) => {
      state.self = {
        ...state.self,
        stateInfo: {
          ...state.self.stateInfo,
          preMatches: state.self.stateInfo.preMatches.filter(
            (match) => match.hash !== action.payload
          ),
        },
      };
    },
    addUnconfirmed: (state, action) => {
      const newSelf = {
        ...state.self,
        stateInfo: {
          ...state.self.stateInfo,
          unconfirmedMatches: [...state.self.stateInfo.unconfirmedMatches, action.payload],
        },
      };
      state.self = newSelf;
      const updatedUsers = state.users.map((user) => {
        if (user.userPk === action.payload) {
          return { ...newSelf };
        }
        return user;
      });
      state.users = updatedUsers;
    },
    updateProfile: (state, action) => {
      state.users = state.users.map((user) => {
        if (user.type === "self") {
          const [key, value] = Object.entries(action.payload)[0];
          const extraInfo = { ...user.extraInfo, [key]: value };
          const more = key === "about" ? { description: value } : {};
          // TODO: for now I retain the self reference
          state.self = { ...user, extraInfo, more };
          return { ...user, extraInfo, more };
        }
        return user;
      });
    },
    readAll: (state) => {
      if (state.notifications.find(({ status }) => status === "unread")) {
        state.notifications = state.notifications.map((notif) => {
          if (notif.status === "unread") {
            return { ...notif, status: "read" };
          }
          return notif;
        });
      }
    },
    readNotif: (state, action) => {
      state.notifications.map((el) =>
        el.hash === action.payload ? (el.state = "read") : el.state
      );
    },
    archiveNotif: (state, action) => {
      state.notifications.map((el) =>
        el.hash === action.payload ? (el.state = "archive") : el.state
      );
    },
    updateSearching: (state, { payload }) => {
      state.self.stateInfo.matchingState = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initialise,
  updateSettings,
  updateProfile,
  addUnconfirmed,
  readAll,
  readNotif,
  archiveNotif,
  removePreMatch,
  setStatus,
  setUsers,
  fetchNotifications,
  updateSearching,
} = userDataSlice.actions;

export const FetchNotificationsAsync =
  ({ pageNumber: page, itemPerPage }) =>
  async (dispatch) => {
    dispatch(setStatus("loading"));
    const result = await notifications.getAll({ pageNumber: page, itemPerPage });
    dispatch(setStatus("data"));
    dispatch(fetchNotifications(result));
  };
export const ArchiveNotificationAsync = (hash) => async (dispatch) => {
  dispatch(setStatus("loading"));
  const result = await notifications.archive(hash);
  dispatch(archiveNotif(hash));
  dispatch(setStatus("data"));
};
export const ReadNotificationAsync = (hash) => async (dispatch) => {
  dispatch(setStatus("loading"));
  const result = await notifications.read(hash);
  dispatch(readNotif(hash));
  dispatch(setStatus("data"));
};

export default userDataSlice.reducer;
