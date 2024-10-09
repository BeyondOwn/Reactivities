import { Attendance } from "@/app/models/Attendance";
import { User } from "@/app/models/user";
import { useAttendanceStore } from "@/app/stores/AttendanceStore";
import { formSchema } from "@/components/ActivityForm";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import agent, { baseURL } from "./agent";


const setUserAttendanceUpdated = useAttendanceStore.getState().setUserAttendanceUpdated
const setActivityAttendanceUpdated = useAttendanceStore.getState().setActivityAttendanceUpdated
// const setJoinIsLoading = useAttendanceStore.getState().setJoinIsLoading;
// const setLeaveIsLoading = useAttendanceStore.getState().setLeaveIsLoading;
const setUserAttendance = useAttendanceStore.getState().setUserAttendance
const setActivityAttendance = useAttendanceStore.getState().setActivityAttendance

export async function onJoin(activityId:number,user:User|null,setLoadingState: (id: number, isLoading: boolean) => void) {
    try{
      setLoadingState(activityId, true); // Start loading
      const userAttendanceUpdated = useAttendanceStore.getState().userAttendanceUpdated
      const activityAttendanceUpdated = useAttendanceStore.getState().activityAttendanceUpdated
      const userAttendancePrev = useAttendanceStore.getState().userAttendance;
      const activityAttendancePrev = useAttendanceStore.getState().activityAttendance;

      const newAttendance: Attendance = {
        userId: user?.id!,
        activityId: activityId,
        user: null,
        activity: null,
      }
      userAttendancePrev?.push(newAttendance);
     
        // Optimistically update the UI
        if (userAttendancePrev !=null){
          setUserAttendance(userAttendancePrev);
          // setUserAttendanceUpdated(userAttendanceUpdated);
        }

        const newActAttendance : Attendance = {
          userId: user?.id!,
          activityId: activityId,
          user:null,activity:null,
          displayName:user?.displayName,
        }
        activityAttendancePrev?.push(newAttendance);
        if (activityAttendancePrev !=null){
          setActivityAttendance(activityAttendancePrev);
        }
        setLoadingState(activityId, false);
        try{
          await agent.requests.post(`${baseURL}/ActivityAttendance/`,{
            userId:user?.id,
            activityId:activityId,
            displayName:user?.displayName
          })
          toast.success("You joined the activity");
        }
        catch(error){
          userAttendancePrev?.pop();
          if(userAttendancePrev !=null)
          {
          setUserAttendance(userAttendancePrev);
          setUserAttendanceUpdated(userAttendanceUpdated);
          }
          activityAttendancePrev?.pop();
          if (activityAttendancePrev !=null){
            setActivityAttendance(activityAttendancePrev)
            setActivityAttendanceUpdated(activityAttendanceUpdated);
          }
          console.log(error)
        }
      
      //Setting User attendance
      const userAttendance = await agent.requests.get(`${baseURL}/ActivityAttendance/userId/${user?.id}`) as Attendance[];
          setUserAttendance(userAttendance);
      //Setting Activity attendance
      if (window.location.href.includes("/activity/")){
        const activityAttendanceh = await agent.requests.get(`${baseURL}/ActivityAttendance/activityId/${activityId}`) as Attendance[];
      setActivityAttendance(activityAttendanceh);
      }
      else{
        const activityAttendanceh = await agent.requests.get(`${baseURL}/ActivityAttendance/`) as Attendance[];
      setActivityAttendance(activityAttendanceh);
      }
      
      //
      setActivityAttendanceUpdated(activityAttendanceUpdated);
      setUserAttendanceUpdated(userAttendanceUpdated);
      // setLoadingState(activityId, false); // Stop loading
     } 
     catch(error){
      console.log(error);
     }
  }

  export async function onLeave(activityId:number,user:User|null,setLoadingState: (id: number, isLoading: boolean) => void) {
    try{
     setLoadingState(activityId, true); // Start loading
     const userAttendanceUpdated = useAttendanceStore.getState().userAttendanceUpdated
     const activityAttendanceUpdated = useAttendanceStore.getState().activityAttendanceUpdated
     const userAttendancePrev = useAttendanceStore.getState().userAttendance;
     const activityAttendancePrev = useAttendanceStore.getState().activityAttendance as Attendance[];
      const newAttendance: Attendance = {
        userId: user?.id!,
        activityId: activityId,
        user: null,
        activity: null,
      }
      const indexToRemove = userAttendancePrev?.findIndex(
        (elem) => elem.activityId === activityId && elem.userId === user?.id
      );
      const Backup:Attendance | undefined = userAttendancePrev?.find((elem) => elem.activityId === activityId && elem.userId === user?.id)
       // If an element is found (index is not -1), remove it from the array
       if(indexToRemove !=undefined)
       {if (indexToRemove !== -1) {
        userAttendancePrev?.splice(indexToRemove, 1);
      }}

      const BackupActivityAttendance:Attendance | undefined = activityAttendancePrev?.find((elem)=> elem.activityId === activityId)
      const indexToRemoveActivityAttendance = activityAttendancePrev?.findIndex((elem)=> elem.activityId === activityId);
      if (indexToRemoveActivityAttendance !=undefined){
        if (indexToRemoveActivityAttendance !== -1){
          activityAttendancePrev?.splice(indexToRemoveActivityAttendance,1);
        }
      }
        // Optimistically update the UI
        if (userAttendancePrev !=null){
          setUserAttendance(userAttendancePrev);
          if (activityAttendancePrev !=null)
          {
            setActivityAttendance(activityAttendancePrev);
          }
          // setUserAttendanceUpdated(userAttendanceUpdated);
        }
         setLoadingState(activityId, false); // Start loading
      try{
        await agent.requests.del(`${baseURL}/ActivityAttendance/`,{
          userId:user?.id,
          activityId:activityId,
        },
        {
          headers:{
            "Content-Type":"application/json"
          }
        }
      )
      toast.info("You left the activity");
      }
      catch(error){
        if (indexToRemove !=undefined){
          if (Backup!=undefined){
            userAttendancePrev?.splice(indexToRemove,0,Backup)
          }
          if (!indexToRemoveActivityAttendance != undefined){
            if (BackupActivityAttendance !=undefined){
              activityAttendancePrev.splice(indexToRemoveActivityAttendance,0,BackupActivityAttendance)
            }
          }
        }
      
      if(userAttendancePrev !=null)
      {
      setUserAttendance(userAttendancePrev);
      setUserAttendanceUpdated(userAttendanceUpdated);
      }
      if(activityAttendancePrev !=null){
        setActivityAttendance(activityAttendancePrev);
        setActivityAttendanceUpdated(activityAttendanceUpdated);
      }
      console.log(error)
    }
     //Setting User attendance
     const userAttendance = await agent.requests.get(`${baseURL}/ActivityAttendance/userId/${user?.id}`) as Attendance[];
     setUserAttendance(userAttendance);
     //Setting Activity attendance
     if (window.location.href.includes("/activity/")){
      const activityAttendanceh = await agent.requests.get(`${baseURL}/ActivityAttendance/activityId/${activityId}`) as Attendance[];
      setActivityAttendance(activityAttendanceh);
     }
     else{
      const activityAttendanceh = await agent.requests.get(`${baseURL}/ActivityAttendance/`) as Attendance[];
     setActivityAttendance(activityAttendanceh);
     }
     //
      setUserAttendanceUpdated(userAttendanceUpdated);
      setActivityAttendanceUpdated(activityAttendanceUpdated);
      // setLoadingState(activityId, false);
     } 
     catch(error){
      console.log(error);
     }
  //  window.location.reload();
  }

  export async function onSubmit(values: z.infer<typeof formSchema>,router:any,refetch:any,setOpen?:Dispatch<SetStateAction<number|null>>,id?:number) {
    try{
     await agent.requests.put(`${baseURL}/Activities/edit/id?id=${id}`,values)
      }
    catch(error){
     console.log(error);
    }
    finally{
      refetch();
      if (setOpen){
        setOpen(null);
      }
      toast.info(`Edited activity id:${id}`);
    }
     
   }
 
 
    export async function onDelete(id:number,refetch:any,router?:any) {
    try{
     await agent.requests.del(`${baseURL}/Activities/id?id=${id}`)
     if(window.location.href.includes("/activity/")){
        router.push("/");
     }
     else{
        refetch();
     }
     
    //  console.log(window.location);
     toast.success(`Deleted activity id:${id}`);
     // location.reload();
    }
    catch(error){
     console.log(error);
    }
     
   }
 
   export async function onView(id:number,router:any) {
    // const activityAttendanceUpdated = useAttendanceStore.getState().activityAttendanceUpdated

     router.push(`https://localhost:3000/activity/${id}`)
    //  setActivityAttendanceUpdated(activityAttendanceUpdated)
   }

   export async function onSetMainPhoto(id:string){
    return await agent.Profiles.setMainPhoto(id);
   }
 

