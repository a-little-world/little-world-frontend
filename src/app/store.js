import { configureStore } from "@reduxjs/toolkit";
import tracksReducer from "../features/tracks";

export default configureStore({
  reducer: {
    tracks: tracksReducer,
  },
});
