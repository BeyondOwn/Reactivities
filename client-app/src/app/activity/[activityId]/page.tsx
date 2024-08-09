'use client'

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface activityIdInterface{
  params:{
    activityId: number
  }
  
}

const fetchPostById = async (id: number) => {
  const res = await axios.get(`http://localhost:5039/api/Activities/${id}`);
  return res.data;
};

export default function Page({params}:activityIdInterface) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`activity/${params.activityId}`],
    queryFn: ()=>fetchPostById(params.activityId),
  })

  if (isPending) {
    return(<div className="flex justify-center items-center h-[90vh] ">
      <LoadingSpinner className="w-80 h-80 text-blue-500"></LoadingSpinner>
    </div>) 
  }

  if (isError) {
    return <span>{error.message}</span>
  }
 
  return (
    <div className="w-full max-h-[100%] flex flex-col items-center">
    <div className="flex flex-col lg:max-w-screen-md w-full max-w-[90%]">
    <Card className="flex flex-col  rounded-none border-0" >
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
            <CardDescription>{data.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{data.description}</p>
          </CardContent>
          <CardFooter>
            <p>{data.city}</p>
          </CardFooter>
          </Card>
          </div>
          </div>
  )
}