import { User } from "@/app/models/user";
import { useAttendanceStore } from "@/app/stores/AttendanceStore";
import { formSchema } from "@/components/ActivityForm";
import { toast } from "react-toastify";
import { z } from "zod";
import agent from "./agent";


const setUserAttendanceUpdated = useAttendanceStore.getState().setUserAttendanceUpdated
const setActivityAttendanceUpdated = useAttendanceStore.getState().setActivityAttendanceUpdated

export async function onJoin(activityId:number,user:User|null,) {
    try{
      const userAttendanceUpdated = useAttendanceStore.getState().userAttendanceUpdated
      const activityAttendanceUpdated = useAttendanceStore.getState().activityAttendanceUpdated
      await agent.requests.post(`http://localhost:5039/api/ActivityAttendance/`,{
        userId:user?.id,
        activityId:activityId,
        displayName:user?.displayName
      })

      setUserAttendanceUpdated(userAttendanceUpdated);
      setActivityAttendanceUpdated(activityAttendanceUpdated);
      toast.success("You joined the activity");
      // router.push(`http://localhost:3000/activity/${activityId}`)
     } 
     catch(error){
      console.log(error);
     }
  }

  export async function onSubmit(values: z.infer<typeof formSchema>,router:any,refetch:any,id?:number) {
    try{
     await agent.requests.put(`http://localhost:5039/api/Activities/edit/id?id=${id}`,values)
     if(window.location.href.includes("/activity/")){
      refetch();
      router.push("/");
    }
      else{
          refetch();
      }
      toast.info(`Edited activity id:${id}`);
    } 
    catch(error){
     console.log(error);
    }
     
   }
 
 
    export async function onDelete(id:number,refetch:any,router?:any) {
    try{
     await agent.requests.del(`http://localhost:5039/api/Activities/id?id=${id}`)
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
    const activityAttendanceUpdated = useAttendanceStore.getState().activityAttendanceUpdated
     router.push(`http://localhost:3000/activity/${id}`)
     setActivityAttendanceUpdated(activityAttendanceUpdated)
   }
 
 
   
 
   export async function onLeave(activityId:number,user:User|null) {
     try{
      const userAttendanceUpdated = useAttendanceStore.getState().userAttendanceUpdated
      const activityAttendanceUpdated = useAttendanceStore.getState().activityAttendanceUpdated
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
       setUserAttendanceUpdated(userAttendanceUpdated);
       setActivityAttendanceUpdated(activityAttendanceUpdated);
       toast.info("You left the activity");
      } 
      catch(error){
       console.log(error);
      }
   //  window.location.reload();
   }

