import { Attendance } from "@/app/models/Attendance";
import { useActivitiesStore } from "@/app/stores/ActivitiesStore";
import { useFilterStore } from "@/app/stores/FilterStore";
import { useUserStore } from "@/app/stores/userStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import agent from "@/utils/agent";
import { useActivities } from "@/utils/useActivities";
import { useUser } from "@/utils/UserContext";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { ActivityForm, formSchema } from "./ActivityForm";
import { LoadingSpinner } from "./LoadingSpinner";

interface ActivitiesListProps {
}


const ActivitiesList: FC<ActivitiesListProps> = () => {
  const router = useRouter();
  const filterValue = useFilterStore((state) => state.filterValue);
  const activities = useActivitiesStore((state) => state.activities)
  const setActivities = useActivitiesStore((state)=> state.setActivities)
  const userAttendance = useUserStore((state) => state.userAttendance)
  const setUserAttendance = useUserStore((state) => state.setUserAttendance)
  const {user} = useUser();
  const [attendanceUpdated, setAttendanceUpdated] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const {data} = useActivities();

  async function onSubmit(values: z.infer<typeof formSchema>,id?:number,) {
   try{
    await agent.requests.put(`http://localhost:5039/api/Activities/id?id=${id}`,values)
    location.reload();
   } 
   catch(error){
    console.log(error);
   }
    
    
  }


  async function onDelete(id:number) {
   try{
    await agent.requests.del(`http://localhost:5039/api/Activities/id?id=${id}`)
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger re-fetch
    // location.reload();
   }
   catch(error){
    console.log(error);
   }
    
  }

  const onView = (id:number) => {
    router.push(`http://localhost:3000/activity/${id}`)
  }


    if (filterValue == "date")
    {
      activities.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      // console.log(filterValue)
  }
  else {
    activities.sort((a, b) => a.id - b.id);
    // console.log(filterValue)
  }

  async function onJoin(activityId:number) {
    try{
      await agent.requests.post(`http://localhost:5039/api/ActivityAttendance/`,{
        userId:user?.id,
        activityId:activityId,
        displayName:user?.displayName
      })

      setAttendanceUpdated((prev) => !prev);
      toast.success("You joined the activity");
      // router.push(`http://localhost:3000/activity/${activityId}`)
     } 
     catch(error){
      console.log(error);
     }
  }

  async function onLeave(activityId:number) {
    try{
      await agent.requests.del(`http://localhost:5039/api/ActivityAttendance/`,{
        userId:user?.id,
        activityId:activityId,
      },
      {
        headers:{
          "Content-Type":"application/json"
        }
      }
    )
      setAttendanceUpdated((prev) => !prev);
      toast.info("You left the activity");
     } 
     catch(error){
      console.log(error);
     }
  //  window.location.reload();
  }
  
 

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
    
  },[attendanceUpdated])

  useEffect(()=>{

  },[refreshKey])

  if (userAttendance == null) return <LoadingSpinner></LoadingSpinner>
  
  return (
    <>
    {activities.map((todo,index) => {
      const isAttending = userAttendance.find((elem) => elem.activityId === todo.id);
      const isCreator = userAttendance.find((elem) => elem.userId === todo.creatorId);
      return (
        <div className="max-w-[90%] lg:max-w-screen-md w-full flex flex-col" key={todo.id.toString()}>
          <Card className="flex flex-col rounded-none p-4 bg-card" >
          <CardHeader>
            <CardTitle>{todo.title}</CardTitle>
            <CardDescription>{format(todo.date,'do MMMM, yyyy h:mm:ss a')}</CardDescription>
            <CardDescription className="text-primary font-semibold">Created by {todo.creatorDisplayName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{todo.description}</p>
          </CardContent>
          <CardFooter>
            <p>{todo.city}</p>
          </CardFooter>
          <div className="flex justify-evenly md:justify-end lg:mr-4 gap-3">
          {!isCreator && isAttending ? 
          (<Button className="bg-red-500 hover:bg-red-600 w-20" onClick={()=>onLeave(todo.id)}>Leave</Button>)
          : !isCreator && !isAttending ?
          (<Button className="bg-purple-500 hover:bg-purple-600 w-20" onClick={()=>onJoin(todo.id)}>Join</Button>)
          : null
        }
          <Button className="bg-green-500 hover:bg-green-600 w-20" onClick={()=>onView(todo.id)}>View</Button>
          
          {isCreator && (
            <Dialog>
            <DialogTrigger><Button className="bg-blue-500 hover:bg-blue-600 w-20">Edit</Button></DialogTrigger>
            <DialogContent className=" w-full  h-fit overflow-auto lg:max-h-screen max-h-[85vh]  max-w-[85vw] lg:max-w-[32rem]">
              <ActivityForm className="p-4 rounded-md " onSubmitFnc={onSubmit} activities={activities[index]}/>
            </DialogContent>
          </Dialog>
          ) }
          
          {isCreator && (
            <Button className="bg-red-500 hover:bg-red-600 w-20" onClick={()=>onDelete(todo.id)}>Delete</Button>
          )}
          </div>
          {/* <div className="flex justify-center">
            <div className="bg-gray-300 h-[2px] w-[95%]"></div>
          </div> */}
          </Card>
          
          </div>
      )
          
})}
    </>
  )
}

export default ActivitiesList