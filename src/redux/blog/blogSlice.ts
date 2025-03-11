import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { addBlogPost as addBlogPostApi, BlogPost, deleteBlogPost as deleteBlogPostApi, editBlogPost, getMembers } from "../../data/data";
import { UserState } from "../user/userSlice";

export const fetchBlogPosts = createAsyncThunk<BlogPost[]>(
  "blogPosts/fetchBlogPosts",
  async () => getMembers(),
);

export const addBlogPost = createAsyncThunk(
  "blog/addBlogPost",
  async (
    { id, title, body, userId }: { id: string, title: string, body: string, userId: number },
    { getState }
  ) => {
    const state = getState() as { user: UserState };
    const existingUser = state.user.userList.find((user) => user.id === userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const newPost = await addBlogPostApi({
      id,
      title,
      body,
      userId: existingUser.id,
      datePosted: new Date().toISOString(),
    });
    return newPost;
  }
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

export const deleteBlogPost = createAsyncThunk(
  "blog/deleteBlogPost",
  async (id: string) => {
    await deleteBlogPostApi(id);
    return id;
  }
)

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
      .addCase(addBlogPost.fulfilled, (state, { payload }) => {
        state.blogList.push(payload);
      })
      .addCase(updateBlogPost.fulfilled, (state, { payload }) => {
        const index = state.blogList.findIndex(
          (post) => post.id === payload.id,
        );
        if (index !== -1) {
          state.blogList[index] = payload;
        }
      })
      .addCase(deleteBlogPost.fulfilled, (state, { payload }) => {
        state.blogList = state.blogList.filter((post) => post.id !== payload);
      });
  },
});

export default blogSlice.reducer;
export const selectBlogPosts = (state: { blog: BlogState }) =>
  state.blog.blogList;
