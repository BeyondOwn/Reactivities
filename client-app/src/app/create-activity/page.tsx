'use client'
import { ActivityForm, formSchema } from "@/components/ActivityForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function CreateActivity(){
const router = useRouter();


    async function onCreate(values: z.infer<typeof formSchema>) {
        await axios.post("http://localhost:5039/api/Activities",values,{
          headers:{
            "Content-Type":"application/json",
          },
        });
        console.log(values);
        router.push("/")
      }

    return (
        <div className="flex flex-col items-center">
    <ActivityForm onSubmitFnc={onCreate}  className="max-w-[85vw]  max-w-[22rem] lg:max-w-[32rem] w-full bg-white p-2 rounded-md"/>
    </div>
    )
}