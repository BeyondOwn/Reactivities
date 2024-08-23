import { paginatedResults } from "@/app/models/paginatedResults";
import { Post } from "@/app/models/post";
import { User } from "@/app/models/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import agent from "./agent";

interface ActivitiesProps{
  user: User,
}

async function fetchPage(activityId:number,pageParam:number): Promise<paginatedResults<Post>> {
    const result = await agent.requests.get<paginatedResults<Post>>(`http://localhost:5039/api/posts/infinite/${activityId}/${pageParam}`)
    // console.log(result.data)
    return result;
  }

export const usePosts =(activityId:number) =>{
    return useInfiniteQuery({
        queryKey: [`posts`],
        queryFn: ({pageParam}) => fetchPage(activityId,pageParam),
        getNextPageParam: (lastPage, pages) => {
            // Assuming your API returns an object with `hasMore` property
            if (lastPage.hasMore) {
              return pages.length + 1; // next page number
            }
            return undefined; // return undefined to signify the end
          },
          initialPageParam: 1,
          refetchOnMount:false, // Start from page 1
          refetchOnWindowFocus:true,
          // refetchInterval:10000,
        });
  
}