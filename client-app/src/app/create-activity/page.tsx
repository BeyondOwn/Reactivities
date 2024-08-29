'use client'
import { ActivityForm, formSchema } from "@/components/ActivityForm";
import agent from "@/utils/agent";
import { useActivities } from "@/utils/useActivities";
import { useUser } from "@/utils/UserContext";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";

export default function CreateActivity(){
const router = useRouter();
const refetch = useActivities().refetch;
const user = useUser().user;

    async function onCreate(values: z.infer<typeof formSchema>) {
      // values["userActivity"] = 
      //   {
      //     "userId": "string",
      //     "displayName": "string",
      //     "user": "string",
      //     "activityId": 0,
      //     "activity": "string"
      //   }
      
      console.log(values)
        await agent.requests.post("http://localhost:5039/api/Activities",values);
        console.log(values);
        refetch();
        toast.success(`Created activity succesfully!`)
        router.push("/")
      }

    return (
        <div className="flex flex-col items-center mt-4">
      {user? (
        <ActivityForm onSubmitFnc={onCreate}  className="max-w-[85vw]  max-w-[22rem] lg:max-w-[32rem] w-full  p-2 rounded-md"/>
      )
      :
      (<div className="flex flex-col items-center"> You need to be logged in
        <div onClick={()=>router.push('/login')} className='flex items-center gap-2 hover:bg-neutralHover cursor-pointer p-2'>
                    <LogIn width={24} height={24}/>
                    <button >Login</button>
                  </div>
      </div>)}
    
    </div>
    )
}