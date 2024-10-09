import { baseURL } from "@/utils/agent";
import axios from "axios";
import { create } from "zustand";
import { Activity } from "../models/activity";
import { paginatedResults } from "../models/paginatedResults";

interface activityProps{
  activities: Activity[];
  status: 'loading' | 'error' | 'success' | 'idle';
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isFetching: boolean;
  setActivities: (activities: Activity[]) => void;
}

export async function fetchGetAll(url: string): Promise<Activity[]> {
    const result = await axios.get<Activity[]>(url)
    // console.log(result.data)
    return result.data;
  }
 
  export async function fetchPage(pageParam:number): Promise<paginatedResults<Activity>> {
    const result = await axios.get<paginatedResults<Activity>>(`${baseURL}/api/${pageParam}`)
    // console.log(result.data)
    return result.data;
  }

 
export const useActivitiesStore = create<activityProps>((set) => ({
  activities: [],
  status: 'idle',
  error: null,
  fetchNextPage: () => {},
  hasNextPage: undefined,
  isFetchingNextPage: false,
  isFetching: false,
  setActivities: (activities) => set({ activities }),
}));