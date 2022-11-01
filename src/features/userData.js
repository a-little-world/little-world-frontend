import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userPk: null,
  firstName: null,
  lastName: null,
  email: null,
  usesAvatar: false,
  avatarConfig: null,
  imgSrc: null,
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    initialise: (state, action) => {
      const { selfInfo, userDataGET } = action.payload;
      state.userPk = selfInfo.user_h256_pk;
      state.firstName = userDataGET.first_name;
      state.lastName = userDataGET.second_name;
      state.email = selfInfo.email;
      state.imgSrc = userDataGET.profile_image;
      try {
        state.avatarConfig = JSON.parse(userDataGET.profile_avatar);
        state.usesAvatar = true;
      } catch (error) {
        state.usesAvatar = false;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { initialise } = userDataSlice.actions;

export default userDataSlice.reducer;
