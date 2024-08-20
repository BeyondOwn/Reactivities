import { Attendance } from "@/app/models/Attendance";
import { useActivitiesStore } from "@/app/stores/ActivitiesStore";
import { useAttendanceStore } from "@/app/stores/AttendanceStore";
import { useFilterStore } from "@/app/stores/FilterStore";
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
import { onDelete, onJoin, onLeave, onSubmit, onView } from "@/utils/crudUtils";
import { useActivities } from "@/utils/useActivities";
import { useUser } from "@/utils/UserContext";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FC, useEffect, useRef, useState } from 'react';
import { Button } from "../components/ui/button";
import { ActivityForm } from "./ActivityForm";
import { LoadingSpinner } from "./LoadingSpinner";

interface ActivitiesListProps {
}


export const ActivitiesList: FC<ActivitiesListProps> = () => {
  const router = useRouter();
  const filterValue = useFilterStore((state) => state.filterValue);
  const userAttendance = useAttendanceStore((state) => state.userAttendance)
  const setUserAttendance = useAttendanceStore((state) => state.setUserAttendance)
  const userAttendanceUpdated = useAttendanceStore((state)=> state.userAttendanceUpdated)
  const activityAttendanceUpdated = useAttendanceStore((state)=> state.activityAttendanceUpdated)
  const activityAttendance = useAttendanceStore((state)=> state.activityAttendance)
  const setActivityAttendance = useAttendanceStore((state)=> state.setActivityAttendance)
  // const setAttendanceUpdated = useAttendanceStore((state)=>state.setUserAttendanceUpdated)
  const {user} = useUser();
  const [refreshKey, setRefreshKey] = useState(0);

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
    
  },[userAttendanceUpdated,setUserAttendance,user])

  useEffect(()=>{
    async function getActivityAttendance(){
      try{
        const activityAttendanceh = await agent.requests.get(`http://localhost:5039/api/ActivityAttendance/`) as Attendance[];
      setActivityAttendance(activityAttendanceh);
      console.log(activityAttendanceh.length);
      }catch(error){
        console.log(error)
      }
    }
    getActivityAttendance();
  },[activityAttendanceUpdated])

  useEffect(()=>{

  },[refreshKey])

  const {
    data,
    refetch,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useActivities();
  
  const setActivities = useActivitiesStore((state) => state.setActivities);

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      const allActivities = data.pages.flatMap((page) => page.items);
      setActivities(allActivities);
    }
  }, [data, setActivities]);

  const {
    activities,
    status: storeStatus,
    error: storeError,
    fetchNextPage: storeFetchNextPage,
    hasNextPage: storeHasNextPage,
    isFetchingNextPage: storeIsFetchingNextPage,
    isFetching: storeIsFetching,
  } = useActivitiesStore();

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
    return(<div className="flex justify-center items-center h-[calc(92dvh+4px)]">
      <LoadingSpinner className="h-32 w-32 md:w-80 md:h-80 text-blue-500"></LoadingSpinner>
    </div>) 
  }

  if (status === 'error') {
    return <span>{error?.message}</span>
  }

  if (userAttendance == null) return <LoadingSpinner></LoadingSpinner>
  if (user == null) return <LoadingSpinner></LoadingSpinner>
  
  return (
    <>
    {activities.map((todo,index) => {
      const isAttending = userAttendance.find((elem) => elem.activityId === todo.id);
      const isCreator = user.id === todo.creatorId;
      const activityAttendancePersonalized = activityAttendance?.filter((elem)=> elem.activityId === todo.id)
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
          <CardContent className="flex justify-end">There are {activityAttendancePersonalized?.length} participants</CardContent>
          <div className="flex justify-evenly md:justify-end lg:mr-4 gap-3">
          {!isCreator && isAttending ? 
          (<Button className="bg-red-600 hover:bg-red-700 w-20" onClick={()=>onLeave(todo.id,user)}>Leave</Button>)
          : !isCreator && !isAttending ?
          (<Button className="bg-purple-600 hover:bg-purple-700 w-20" onClick={()=>onJoin(todo.id,user)}>Join</Button>)
          : null
        }
          <Button className="bg-green-600 hover:bg-green-700 w-20" onClick={()=>onView(todo.id,router)}>View</Button>
          
          {isCreator && (
            <Dialog>
            <DialogTrigger><Button className="bg-blue-600 hover:bg-blue-700 w-20">Edit</Button></DialogTrigger>
            <DialogContent className=" w-full  h-fit overflow-auto lg:max-h-screen max-h-[85vh]  max-w-[85vw] lg:max-w-[32rem]">
              <ActivityForm className="p-4 rounded-md " onSubmitFnc={onSubmit} activities={activities[index]}/>
            </DialogContent>
          </Dialog>
          ) }
          
          {isCreator && (
            <Button className="bg-red-600 hover:bg-red-700 w-20" onClick={()=>onDelete(todo.id,refetch)}>Delete</Button>
          )}
          </div>
          {/* <div className="flex justify-center">
            <div className="bg-gray-300 h-[2px] w-[95%]"></div>
          </div> */}
          </Card>
          
          </div>
      )
      
})}
  <div ref={observerRef} style={{ height: 20, background: 'transparent' }}>
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </>
    
  )
}

export default ActivitiesList