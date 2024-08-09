'use client'
import ActivitiesList from "@/components/ActivitiesList";
import Filter from "@/components/Filter";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useEffect, useRef } from "react";
import { useActivitiesStore } from "./stores/ActivitiesStore";



export default function Home() {

  const getActivities = useActivitiesStore((state) => state.useActivities)
  getActivities();
  const status = useActivitiesStore((state) => state.status)
  const error = useActivitiesStore((state) => state.error)
  const hasNextPage = useActivitiesStore((state) => state.hasNextPage)
  const fetchNextPage = useActivitiesStore((state) => state.fetchNextPage)
  const isFetchingNextPage = useActivitiesStore((state) => state.isFetchingNextPage)

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  if (status === 'pending') {
    return(<div className="flex justify-center items-center h-[calc(92dvh+4px)] bg-gray-400 bg-opacity-50">
      <LoadingSpinner className="h-32 w-32 md:w-80 md:h-80 text-blue-500"></LoadingSpinner>
    </div>) 
  }

  if (status === 'error') {
    return <span>{error?.message}</span>
  }

  return (
    // <div className="flex flex-col items-center text-xl w-full">
    // <GetAllActivities className=" w-[48rem]" url=/>
    // </div>
    
    <div className="flex w-full gap-8 justify-center mt-4">
    <div className="max-w-screen-md w-full flex flex-col items-center gap-2">
      <Filter ></Filter>
        <ActivitiesList />
        <div ref={observerRef} style={{ height: 20, background: 'transparent' }}>
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </div>
      {/* <ActivityForm className="hidden sm:flex max-w-[26rem] w-full flex-col bg-white h-fit  border-4 border-black p-2 rounded-md"/> */}
    </div>
    
  );
}
