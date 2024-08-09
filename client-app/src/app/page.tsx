'use client'
import ActivitiesList from "@/components/ActivitiesList";
import Filter from "@/components/Filter";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useActivitiesStore } from "./stores/ActivitiesStore";



export default function Home() {

  const getActivities = useActivitiesStore((state) => state.useActivities)
  getActivities();
  const isPending = useActivitiesStore((state) => state.isPending)
  const isError = useActivitiesStore((state) => state.isError)
  const error = useActivitiesStore((state) => state.error)
  

  if (isPending) {
    return(<div className="flex justify-center items-center h-[calc(92dvh+4px)] bg-gray-400 bg-opacity-50">
      <LoadingSpinner className="h-32 w-32 md:w-80 md:h-80 text-blue-500"></LoadingSpinner>
    </div>) 
  }

  if (isError) {
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
    </div>
      {/* <ActivityForm className="hidden sm:flex max-w-[26rem] w-full flex-col bg-white h-fit  border-4 border-black p-2 rounded-md"/> */}
    </div>
    
  );
}
