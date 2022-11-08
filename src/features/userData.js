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
