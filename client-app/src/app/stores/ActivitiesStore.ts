import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { create } from "zustand";
import { Activity } from "../models/activity";
import { paginatedResults } from "../models/paginatedResults";

interface activityProps{
    activities:Activity[];
    useActivities:()=>void;
    status: "error" | "success" | "pending";
    error:Error | null,
    hasNextPage:boolean
    fetchNextPage:()=>void,
    isFetchingNextPage:boolean,
    isFetching:boolean,
    
}

export async function fetchGetAll(url: string): Promise<Activity[]> {
    const result = await axios.get<Activity[]>(url)
    // console.log(result.data)
    return result.data;
  }

  export async function fetchPage(pageParam:number): Promise<paginatedResults> {
    const result = await axios.get<paginatedResults>(`http://localhost:5039/asd/${pageParam}`)
    // console.log(result.data)
    return result.data;
  }

 
export const useActivitiesStore = create<activityProps>((set) => ({
    activities:[],
    status: "pending",
    hasNextPage:false,
    fetchNextPage:()=>{},
    error:new Error("default error"),
    isFetchingNextPage:false,
    isFetching:false,
    useActivities:()=>{
        // const { isPending, isError, data, error } = useQuery({
        //     queryKey: ['activities'],
        //     queryFn: ()=>fetchPage("http://localhost:5039/api/Activities",1,10),
        //   })
        //   set((state) => ({activities:data}))
        //   set((state) => ({isPending:isPending}))
        //   set((state) => ({isError:isError}))
        //   set((state) => ({error:error}))
        //   return data;

        const {
            data,
            error,
            fetchNextPage,
            hasNextPage,
            isFetching,
            isFetchingNextPage,
            status,
          } = useInfiniteQuery({
            queryKey: ['activities'],
            queryFn: ({pageParam}) => fetchPage(pageParam),
            getNextPageParam: (lastPage, pages) => {
                // Assuming your API returns an object with `hasMore` property
                if (lastPage.hasMore) {
                  return pages.length + 1; // next page number
                }
                return undefined; // return undefined to signify the end
              },
              initialPageParam: 1, // Start from page 1
            });

            // Combine all items from all pages
            const allActivities: Activity[] = data ? data.pages.flatMap(page => page.items) : [];

               set((state) => ({activities:allActivities}))
                set((state) => ({status:status}))
                set((state) => ({error:error}))
                set((state) => ({fetchNextPage:fetchNextPage}))
                set((state) => ({hasNextPage:hasNextPage}))
                set((state) => ({isFetchingNextPage:isFetchingNextPage}))
                set((state) => ({isFetching:isFetching}))
                return data;
    }
}))