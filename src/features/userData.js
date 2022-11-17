import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  email: null,
  interestsChoices: [],
  users: [],
  raw: {},
  settings: {},
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    initialise: (state, action) => {
      state.raw = action.payload;

      const { user, profile, settings, notifications, state: usrState, matches } = action.payload;
      console.log(user, profile, settings, notifications, usrState, matches);

      const others = matches.map((match) => {
        let avatarCfg = "";
        try {
          avatarCfg = JSON.parse(match.profle.profile_avatar_config);
        } catch {}
        return {
          userPk: match.user.hash,
          firstName: match.profile.first_name,
          lastName: match.profile.second_name,
          imgSrc: match.profile.profile_image,
          avatarCfg,
          description: match.profile.description,
          type: match.user.is_admin ? "support" : "match",
          extraInfo: {
            about: match.profile.description,
            interestTopics: match.profile.interests.map(Number),
            extraTopics: match.profile.additional_interests,
            expectations: match.profile.language_skill_description,
          },
        };
      });
      console.log("OTHRS", others);

      let avatarCfg = "";
      try {
        avatarCfg = JSON.parse(user.profile.profile_avatar_config);
      } catch {}
      const self = {
        userPk: user.hash,
        firstName: profile.first_name,
        lastName: profile.second_name,
        imgSrc: profile.profile_image,
        avatarCfg,
        description: profile.description,
        type: "self",
        extraInfo: {
          about: profile.description,
          interestTopics: profile.interests.map(Number),
          extraTopics: profile.additional_interests,
          expectations: profile.language_skill_description,
        },
      };
      state.users = [self, ...others];

      state.interestsChoices = profile.options.interests;

      const displayLang = (settings.language || Cookies.get("frontendLang") || "en") // fallback to english
        .slice(0, 2); // just use 2-character code for now; ie "en" not "en-gb", "en-us" etc
      state.settings = {
        displayLang,
        firstName: profile.first_name,
        lastName: profile.second_name,
        email: user.email,
        password: "", // userDataGET.password <-- TODO: why was this here?
        phone: profile.phone_mobile,
        postCode: profile.postal_code,
        birthYear: profile.birth_year,
      };
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
export const { initialise, updateSettings, updateProfile } = userDataSlice.actions;

export default userDataSlice.reducer;
