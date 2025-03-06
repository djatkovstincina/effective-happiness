import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getMembers, BlogPost } from "../../data/data";
import { RootState } from "../store";

export const fetchBlogPosts = createAsyncThunk<BlogPost[]>(
  "blogPosts/fetchBlogPosts",
  async () => getMembers(),
);

export interface BlogState {
  blogList: BlogPost[];
}

const initialState: BlogState = {
  blogList: [],
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBlogPosts.fulfilled, (state, { payload }) => {
      state.blogList = payload;
    });
  },
});

export default blogSlice.reducer;

export const selectBlogPosts = (state: RootState) => state.blog.blogList;
