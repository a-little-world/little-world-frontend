import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  interestsChoices: [],
  users: [],
  raw: {},
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
    },
  },
});

// Action creators are generated for each case reducer function
export const { initialise } = userDataSlice.actions;

export default userDataSlice.reducer;
