import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";

import userReducer from "./user/userSlice";
import blogReduser from "./blog/blogSlice";

const rootReducer = combineReducers({
  user: userReducer,
  blog: blogReduser,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
