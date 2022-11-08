import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  raw: {},
  users: [],
  settings: {},
  notifications: [],
  interestsChoices: [],
};

const dummyNotifications = [
  {
    id: 2347,
    status: "unread",
    type: "appointment",
    text: "new appoinment?",
    dateString: "27th October, 2022 at 3:00pm",
    unixtime: 1666364400,
  },
  {
    id: 2346,
    status: "read",
    type: "new friend",
    text: "New friend: George McCoy",
    dateString: "27th October, 2022 at 3:00pm",
    unixtime: 1666364400,
  },
  {
    id: 1973,
    status: "archive",
    type: "missed call",
    text: "missed call",
    dateString: "You missed appointment",
    unixtime: 1640995200,
  },
];

const dummyNotifications2 = [
  {
    id: 2347,
    status: "read",
    type: "appointment",
    text: "Notifications will be added soon",
    dateString: "27th October, 2022 at 3:00pm",
    unixtime: 1666364400,
  },
];

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    initialise: (state, action) => {
      state.raw = action.payload;

      const { matches, selfInfo, userDataGET } = action.payload;

      const others = matches.map((match) => {
        let avatarCfg = "";
        try {
          avatarCfg = JSON.parse(match.profile_avatar);
        } catch {}
        return {
          userPk: match["match.user_h256_pk"],
          firstName: match.first_name,
          lastName: match.second_name,
          imgSrc: match.profile_image,
          avatarCfg,
          description: match.description,
          type: match.user_type === 1 ? "support" : "match",
          extraInfo: {
            about: match.description,
            interestTopics: match.interests.map(Number),
            extraTopics: match.additional_interests,
            expectations: match.language_skill_description,
          },
        };
      });
      let avatarCfg = "";
      try {
        avatarCfg = JSON.parse(userDataGET.profile_avatar);
      } catch {}
      const self = {
        userPk: selfInfo.user_h256_pk,
        firstName: userDataGET.first_name,
        lastName: userDataGET.second_name,
        imgSrc: userDataGET.profile_image,
        avatarCfg,
        description: userDataGET.description,
        type: "self",
        extraInfo: {
          about: userDataGET.description,
          interestTopics: userDataGET.interests.map(Number),
          extraTopics: userDataGET.additional_interests,
          expectations: userDataGET.language_skill_description,
        },
      };
      state.users = [self, ...others];

      state.interestsChoices = action.payload.userDataOPTIONS.actions.POST.interests.choices;

      const displayLang = (userDataGET.display_lang || Cookies.get("frontendLang")).slice(0, 2);
      state.settings = {
        displayLang,
        firstName: userDataGET.first_name,
        lastName: userDataGET.second_name,
        email: selfInfo.email,
        password: userDataGET.password,
        phone: userDataGET.mobile_number,
        postCode: userDataGET.postal_code,
        birthYear: userDataGET.birth_year,
      };

      state.notifications = dummyNotifications;
    },
    updateSettings: (state, action) => {
      Object.entries(action.payload).forEach(([item, value]) => {
        state.settings[item] = value;

        // if name is changed, also update the users object
        if (["firstName", "lastName"].includes(item)) {
          state.users = state.users.map((user) => {
            if (user.type === "self") {
              return { ...user, [item]: value };
            }
            return user;
          });
        }
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
    updateProfile: (state, action) => {
      state.users = state.users.map((user) => {
        if (user.type === "self") {
          const [key, value] = Object.entries(action.payload)[0];
          const extraInfo = { ...user.extraInfo, [key]: value };
          const more = key === "about" ? { description: value } : {};
          return { ...user, extraInfo, more };
        }
        return user;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { initialise, updateSettings, readAll, updateProfile } = userDataSlice.actions;

export default userDataSlice.reducer;
