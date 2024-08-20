'use client'

import { Attendance } from "@/app/models/Attendance";
import { useAttendanceStore } from "@/app/stores/AttendanceStore";
import { ActivityForm } from "@/components/ActivityForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import agent from "@/utils/agent";
import { onDelete, onJoin, onLeave, onSubmit, onView } from "@/utils/crudUtils";
import { useActivities } from "@/utils/useActivities";
import { useUser } from "@/utils/UserContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const {user,loading} = useUser();
  const userAttendance = useAttendanceStore((state) => state.userAttendance)
  const setUserAttendance = useAttendanceStore((state)=>state.setUserAttendance)
  const userAttendanceUpdated = useAttendanceStore((state)=> state.userAttendanceUpdated)

  const activityAttendance = useAttendanceStore((state) => state.activityAttendance)
  const setActivityAttendance = useAttendanceStore((state)=>state.setActivityAttendance)
  const activityAttendanceUpdated = useAttendanceStore((state)=> state.activityAttendanceUpdated)

  const router = useRouter();
  const refetch = useActivities().refetch;
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`activity/${params.activityId}`],
    queryFn: ()=>fetchPostById(params.activityId),
  })

  useEffect(()=>{
    async function getAttendance(){
      if(!user) return;
        try{
          const userAttendance = await agent.requests.get(`http://localhost:5039/api/ActivityAttendance/userId/${user?.id}`) as Attendance[];
          setUserAttendance(userAttendance);
         } 
         catch(error){
          console.log(error);
         }
      }
    getAttendance();
    
  },[userAttendanceUpdated])

  useEffect(()=>{
    async function getActivityAttendance(){
      try{
        const activityAttendanceh = await agent.requests.get(`http://localhost:5039/api/ActivityAttendance/activityId/${params.activityId}`) as Attendance[];
      setActivityAttendance(activityAttendanceh);
      console.log(activityAttendanceh.length);
      }catch(error){
        console.log(error)
      }
    }
    getActivityAttendance();
  },[activityAttendanceUpdated])
 

  if (isPending) {
    return(<div className="flex justify-center items-center h-[90vh] ">
      <LoadingSpinner className="w-80 h-80 text-blue-500"></LoadingSpinner>
    </div>) 
  }

  if (user == null) return <LoadingSpinner></LoadingSpinner>

  if (userAttendance == null) return <LoadingSpinner></LoadingSpinner>

  if (activityAttendance == null) return <LoadingSpinner></LoadingSpinner>

  if (isError) {
    return <span>{error.message}</span>
  }
 
  const isAttending = userAttendance.find((elem) => elem.activityId === data.id);
  const isCreator = user.id === data.creatorId;

  return (
    <div className="w-full max-h-[100%] flex flex-col items-center mt-4">
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
          <CardContent className="flex justify-end">There are {activityAttendance?.length} participants</CardContent>
          <div className="flex justify-evenly md:justify-end lg:mr-4 gap-3">
          {!isCreator && isAttending ? 
          (<Button className="bg-red-600 hover:bg-red-700 w-20" onClick={()=>onLeave(params.activityId,user)}>Leave</Button>)
          : !isCreator && !isAttending ?
          (<Button className="bg-purple-600 hover:bg-purple-700 w-20" onClick={()=>onJoin(params.activityId,user)}>Join</Button>)
          : null
        }
          <Button className="bg-green-600 hover:bg-green-700 w-20" onClick={()=>onView(params.activityId,router)}>View</Button>
          
          {isCreator && (
            <Dialog>
            <DialogTrigger><Button className="bg-blue-600 hover:bg-blue-700 w-20">Edit</Button></DialogTrigger>
            <DialogContent className=" w-full  h-fit overflow-auto lg:max-h-screen max-h-[85vh]  max-w-[85vw] lg:max-w-[32rem]">
              <ActivityForm className="p-4 rounded-md" onSubmitFnc={onSubmit} activities={data}/>
            </DialogContent>
          </Dialog>
          ) }
          
          {isCreator && (
            <Button className="bg-red-600 hover:bg-red-700 w-20" onClick={()=>onDelete(params.activityId,refetch,router)}>Delete</Button>
          )}
          </div>
          </Card>
          </div>
          </div>
  )
}