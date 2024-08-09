'use client'
import { Activity } from "@/app/models/activity";
import ActivitiesList from "@/components/ActivitiesList";
import Filter from "@/components/Filter";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from "react";

export async function fetchGetAll(url: string): Promise<Activity[]> {
  const result = await axios.get<Activity[]>(url)
  console.log(result.data)
  return result.data;
}

export const useGetFetchQuery = (key:QueryKey) => {
  const queryClient = useQueryClient();

  return queryClient.getQueryData(key);
};

export default function Home() {
  const [filterValue,setFilterValue] = useState("")

  const handleFilterChange = (newState:string) => {
    setFilterValue(newState);
  };
  
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['activities'],
    queryFn: ()=>fetchGetAll("http://localhost:5039/api/Activities"),
  })


  if (isPending) {
    return(<div className="flex justify-center items-center h-[calc(92dvh+4px)] bg-gray-400 bg-opacity-50">
      <LoadingSpinner className="h-32 w-32 md:w-80 md:h-80 text-blue-500"></LoadingSpinner>
    </div>) 
  }

  if (isError) {
    return <span>{error.message}</span>
  }

  return (
    // <div className="flex flex-col items-center text-xl w-full">
    // <GetAllActivities className=" w-[48rem]" url=/>
    // </div>
    
    <div className="flex w-full gap-8 justify-center mt-4">
    <div className="max-w-screen-md w-full flex flex-col items-center gap-2">
      <Filter filterValue ={filterValue} onFilterChange={handleFilterChange}></Filter>
        <ActivitiesList filterValue ={filterValue} activities={data} />
    </div>
      {/* <ActivityForm className="hidden sm:flex max-w-[26rem] w-full flex-col bg-white h-fit  border-4 border-black p-2 rounded-md"/> */}
    </div>
    
  );
}
