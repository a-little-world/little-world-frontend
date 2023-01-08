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

      const {
        user,
        profile,
        settings,
        notifications,
        state: usrState,
        matches,
        community_events,
        admin_infos: adminInfos,
      } = action.payload;
      console.log(user, profile, settings, notifications, usrState, matches, community_events);
      console.log("ADMIN", adminInfos);

      const others = matches.map((match) => {
        let avatarCfg = "";
        avatarCfg = match.profile.avatar_config;
        return {
          userPk: match.user.hash,
          firstName: match.profile.first_name,
          lastName: "", // TODO: we removed the second name completely, so we can also remove its frontend use
          imgSrc: match.profile.image,
          avatarCfg,
          usesAvatar: match.profile.image_type === "avatar",
          description: match.profile.description,
          type: match.user.is_admin ? "support" : "match",
          extraInfo: {
            about: match.profile.description,
            interestTopics: match.profile.interests,
            extraTopics: match.profile.additional_interests,
            expectations: match.profile.language_skill_description,
          },
        };
      });
      console.log("OTHRS", others);

      let avatarCfg = "";
      avatarCfg = profile.avatar_config;
      const self = {
        userPk: user.hash,
        firstName: profile.first_name,
        lastName: profile.second_name,
        imgSrc: profile.image,
        avatarCfg,
        usesAvatar: profile.image_type === "avatar",
        isAdmin: user.is_admin,
        adminInfos: user.is_admin ? adminInfos : null,
        description: profile.description,
        notifications,
        type: "self",
        extraInfo: {
          about: profile.description,
          interestTopics: profile.interests,
          extraTopics: profile.additional_interests,
          expectations: profile.language_skill_description,
        },
        stateInfo: {
          unconfirmedMatches: usrState.unconfirmed_matches_stack,
          matchingState: usrState.matching_state,
        },
      };

      state.self = self;
      /* TODO can this reference break anything?
       I just don't feel that it makes any sense to do state.users.filter(type === 'self') all the time? 
      */

      // Is it safe to rely on state.users[0] to be self?
      // I mean we do all this [self, ...others] stuff
      // because we might want to update the state of all users right?
      // So if we had also websocket updates for this stuff the profiles of others could reload
      // otherwise I really dont get why we dont just to state.self = self ?
      state.users = [self, ...others];

      const displayLang = (settings.language || Cookies.get("frontendLang") || "en") // fallback to english
        .slice(0, 2); // just use 2-character code for now; ie "en" not "en-gb", "en-us" etc
      state.settings = {
        profilePicture: profile.image_type /* selction 'picture' or 'avatar' */,
        displayLang,
        firstName: profile.first_name,
        lastName: profile.second_name,
        email: user.email,
        password: "", // userDataGET.password <-- TODO: why was this here?
        phone: profile.phone_mobile,
        postCode: profile.postal_code,
        birthYear: profile.birth_year,
      };

      state.communityEvents = community_events;

      /* Stores backend api options globaly */
      state.apiOptions = {
        profile: profile.options,
      };
    },
    updateSettings: (state, action) => {
      Object.entries(action.payload).forEach(([item, value]) => {
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
  },
});

// Action creators are generated for each case reducer function
export const { initialise, updateSettings, updateProfile } = userDataSlice.actions;

export default userDataSlice.reducer;
