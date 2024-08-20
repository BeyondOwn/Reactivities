'use client'
import { ActivityForm, formSchema } from "@/components/ActivityForm";
import agent from "@/utils/agent";
import { useActivities } from "@/utils/useActivities";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";

export default function CreateActivity(){
const router = useRouter();
const refetch = useActivities().refetch;

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
    <ActivityForm onSubmitFnc={onCreate}  className="max-w-[85vw]  max-w-[22rem] lg:max-w-[32rem] w-full  p-2 rounded-md"/>
    </div>
    )
}