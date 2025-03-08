import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { deleteUser as deleteUserApi, getUsers, User } from "../../data/data";
import { RootState } from "../store";

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => getUsers(),
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: number) => {
    await deleteUserApi(userId);
    return userId;
  },
);

export interface UserState {
  userList: User[];
}

const initialState = {
  userList: [],
} as UserState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // TODO: Add any needed reducers here
    // myAwesomeReducer() {}
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.userList.push(...payload);
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.userList = state.userList.filter(
          (user) => user.id !== action.payload,
        );
      });
  },
});

// TODO: Export any redux actions if needed
// export const { myAwesomeReducer } = userSlice.actions;

export default userSlice.reducer;

export const selectUsers = (state: RootState) => state.user.userList;
