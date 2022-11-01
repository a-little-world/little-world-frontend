import { configureStore } from "@reduxjs/toolkit";

import userDataReducer from "../features/userData";

export default configureStore({
  reducer: {
    userData: userDataReducer,
  },
});
