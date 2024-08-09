import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { create } from "zustand";
import { Activity } from "../models/activity";

interface activityProps{
    activities:Activity[];
    useActivities:()=>Activity[] | undefined;
    isPending:boolean
    isError:boolean
    error:Error | null
}

export async function fetchGetAll(url: string): Promise<Activity[]> {
    const result = await axios.get<Activity[]>(url)
    console.log(result.data)
    return result.data;
  }

 
export const useActivitiesStore = create<activityProps>((set) => ({
    activities:[],
    isPending:false,
    isError:false,
    error:new Error("default error"),
    useActivities:()=>{
        const { isPending, isError, data, error } = useQuery({
            queryKey: ['activities'],
            queryFn: ()=>fetchGetAll("http://localhost:5039/api/Activities"),
          })
          set((state) => ({activities:data}))
          set((state) => ({isPending:isPending}))
          set((state) => ({isError:isError}))
          set((state) => ({error:error}))
          return data;
    }
}))