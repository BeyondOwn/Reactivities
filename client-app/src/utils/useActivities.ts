import { paginatedResults } from "@/app/models/paginatedResults";
import { User } from "@/app/models/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import agent from "./agent";

interface ActivitiesProps{
  user: User,
}

async function fetchPage(pageParam:number): Promise<paginatedResults> {
    const result = await agent.requests.get<paginatedResults>(`http://localhost:5039/view/${pageParam}`)
    // console.log(result.data)
    return result;
  }

export const useActivities =() =>{
    return useInfiniteQuery({
        queryKey: ['activities'],
        queryFn: ({pageParam}) => fetchPage(pageParam),
        getNextPageParam: (lastPage, pages) => {
            // Assuming your API returns an object with `hasMore` property
            if (lastPage.hasMore) {
              return pages.length + 1; // next page number
            }
            return undefined; // return undefined to signify the end
          },
          initialPageParam: 1,
          refetchOnMount:true, // Start from page 1
          refetchOnWindowFocus:true,
          // refetchInterval:10000,
        });
  
}