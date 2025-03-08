import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BlogPost, editBlogPost, getMembers } from "../../data/data";

export const fetchBlogPosts = createAsyncThunk<BlogPost[]>(
  "blogPosts/fetchBlogPosts",
  async () => getMembers(),
);

export const updateBlogPost = createAsyncThunk(
  "blog/updateBlogPost",
  async (
    { id, title, body }: { id: string; title: string; body: string },
    { getState },
  ) => {
    const state = getState() as { blog: BlogState };
    const existingPost = state.blog.blogList.find((post) => post.id === id);

    if (!existingPost) {
      throw new Error("Post not found");
    }

    const updatedPost = await editBlogPost(id, {
      title,
      body,
      userId: existingPost.userId,
      datePosted: existingPost.datePosted,
    });

    return updatedPost;
  },
);

export interface BlogState {
  blogList: BlogPost[];
  status: "idle" | "loading" | "failed";
}

const initialState: BlogState = {
  blogList: [],
  status: "idle",
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogList: (state, action: PayloadAction<BlogPost[]>) => {
      state.blogList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.fulfilled, (state, { payload }) => {
        state.blogList.push(...payload);
      })
      .addCase(updateBlogPost.fulfilled, (state, { payload }) => {
        const index = state.blogList.findIndex(
          (post) => post.id === payload.id,
        );
        if (index !== -1) {
          state.blogList[index] = payload;
        }
      });
  },
});

export default blogSlice.reducer;
export const selectBlogPosts = (state: { blog: BlogState }) =>
  state.blog.blogList;
