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
import agent, { baseURL } from "@/utils/agent";
import { convertUTCDateToLocalDate } from "@/utils/convertUTCDateToLocalDate";
import { onDelete, onJoin, onLeave, onSubmit, onView } from "@/utils/crudUtils";
import { useLoading } from "@/utils/LoadingContext";
import { useActivities } from "@/utils/useActivities";
import { useUser } from "@/utils/UserContext";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { FC, useEffect, useRef, useState } from 'react';
import { Button } from "../components/ui/button";
import { ActivityForm } from "./ActivityForm";
import { LoadingSpinner } from "./LoadingSpinner";
import { Skeleton } from "./ui/skeleton";

interface ActivitiesListProps {
}

export const ActivitiesList: FC<ActivitiesListProps> = () => {
  const router = useRouter();
  const filterValue = useFilterStore((state) => state.filterValue);
  const userAttendance = useAttendanceStore((state) => state.userAttendance)
  let JoinIsLoading = useAttendanceStore((state)=>state.JoinIsLoading)
  const setUserAttendance = useAttendanceStore((state) => state.setUserAttendance)
  const userAttendanceUpdated = useAttendanceStore((state)=> state.userAttendanceUpdated)
  const activityAttendanceUpdated = useAttendanceStore((state)=> state.activityAttendanceUpdated)
  const activityAttendance = useAttendanceStore((state)=> state.activityAttendance)
  const setActivityAttendance = useAttendanceStore((state)=> state.setActivityAttendance)
  // const setAttendanceUpdated = useAttendanceStore((state)=>state.setUserAttendanceUpdated)
  const {user} = useUser();
  const [refreshKey, setRefreshKey] = useState(0);
  const { loadingStates, setLoadingState } = useLoading();
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  const handleOpenChange = (id: number, isOpen: boolean) => {
    setOpenDialogId(isOpen ? id : null);
  };


 useEffect(()=>{
  async function getAttendance(){
    if(!user) return;
      try{
        const userAttendance = await agent.requests.get(`${baseURL}/ActivityAttendance/userId/${user?.id}`) as Attendance[];
        setUserAttendance(userAttendance);
       } 
       catch(error){
        console.log(error);
       }
    }

    async function getActivityAttendance(){
      try{
        const activityAttendanceh = await agent.requests.get(`${baseURL}/ActivityAttendance/`) as Attendance[];
      setActivityAttendance(activityAttendanceh);
      console.log(activityAttendanceh.length);
      }catch(error){
        console.log(error)
      }
    }

  getActivityAttendance();
  getAttendance();
  return() =>{
    setUserAttendance(null);
    setActivityAttendance(null);
  }
 },[])

  useEffect(()=>{

  },[userAttendanceUpdated,setUserAttendance,user])

  useEffect(()=>{
    
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
    activities:activitiesFromHook
  } = useActivities();
  
  const setActivities = useActivitiesStore((state) => state.setActivities);

  const observerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (activitiesFromHook) {
      
  //     setActivities(activitiesFromHook);
  //   }
  // }, [data, setActivities]);

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
      activitiesFromHook?.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      // console.log(filterValue)
  }
  else {
    activitiesFromHook?.sort((a, b) => a.id - b.id);
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

  if (data == null) return <LoadingSpinner></LoadingSpinner>

  if (status === 'error') {
    return <span>{error?.message}</span>
  }

  // if (userAttendance == null) return <LoadingSpinner></LoadingSpinner>
  // if (user == null) return <LoadingSpinner></LoadingSpinner>
  
  return (
    <>
    {activitiesFromHook?.map((todo,index) => {
      const isAttending = userAttendance?.find((elem) => elem.activityId === todo.id);
      const isCreator = user?.id === todo.creatorId;
      const activityAttendancePersonalized = activityAttendance?.filter((elem)=> elem.activityId === todo.id)
      const isLoading = loadingStates[todo.id] || false;
      const formatedDate = convertUTCDateToLocalDate(new Date(todo.date));
      return (
        <div className="max-w-[90%] lg:max-w-screen-md w-full flex flex-col" key={todo.id.toString()}>
          <Card className="flex flex-col rounded-md p-4 bg-card" >
          <CardHeader>
            <CardTitle>{todo.title}</CardTitle>
            <CardDescription>{formatDistanceToNow(new Date(formatedDate), {addSuffix: true })}</CardDescription>
            <CardDescription className="text-primary font-semibold">Created by {todo.creatorDisplayName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{todo.description}</p>
          </CardContent>
          <CardFooter>
            <p>{todo.city}</p>
          </CardFooter>
          <CardContent className="flex flex-col items-center w-max self-end p-2 gap-2">
          {activityAttendance ? 
            <div className="">
            <p className="">There are {activityAttendancePersonalized?.length} participants</p></div>  : 
          <div className="">
          <div className=" space-y-2">
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>}
          <div className="flex justify-end gap-3  md:justify-end">
          {!isCreator && isAttending ? 
          isLoading ? 
          (
            <LoadingSpinner className="h-[2.5rem] w-20"></LoadingSpinner>
          )
          :
          (
          <Button className="bg-red-600 hover:bg-red-700 w-20 " onClick={()=>onLeave(todo.id,user,setLoadingState)}>Leave</Button>
          )
          : !isCreator && !isAttending && userAttendance !=null ?
          isLoading  ?
          (
          <LoadingSpinner className="h-[2.5rem] w-20"></LoadingSpinner>
          )
          :
          (
            <Button className="bg-purple-600 hover:bg-purple-700 w-20" onClick={()=>onJoin(todo.id,user,setLoadingState)}>Join</Button>
          )
          : null
        }
          <Button className="bg-green-600 hover:bg-green-700 w-20" onClick={()=>onView(todo.id,router)}>View</Button>
          
          {isCreator && (
            <Dialog 
            open={openDialogId === todo.id}
            onOpenChange={(isOpen) => handleOpenChange(todo.id, isOpen)}
            >
            <DialogTrigger><Button className="bg-blue-600 hover:bg-blue-700 w-20">Edit</Button></DialogTrigger>
            <DialogContent className=" w-full  h-fit overflow-auto lg:max-h-screen max-h-[85vh]  max-w-[85vw] lg:max-w-[32rem]">
              <ActivityForm className="p-4 rounded-md" setOpen={setOpenDialogId} onSubmitFnc={onSubmit} givenActivity={todo} refetch={refetch}/>
            </DialogContent>
          </Dialog>
          ) }
          {isCreator && (
            <Button className="bg-red-600 hover:bg-red-700 w-20" onClick={()=>onDelete(todo.id,refetch,router)}>Delete</Button>
          )}
          </div>
          {/* <div className="flex justify-center">
            <div className="bg-gray-300 h-[2px] w-[95%]"></div>
          </div> */}
          </CardContent>
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