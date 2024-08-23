import { create } from "zustand";
import { Post } from "../models/post";

interface activityProps{
  posts: Post[] | null;
  setPosts: (activities: Post[] | null
  ) => void;
  postUpdated:boolean,
  setPostUpdated:(prev:boolean) =>void
}

export const usePostsStore = create<activityProps>((set) => ({
  posts: [],
  setPosts: (post) => set({ posts:post }),
  postUpdated:false,
    setPostUpdated: (prev:boolean) => {
        set((state) => ({postUpdated:!prev}))
    },
}));