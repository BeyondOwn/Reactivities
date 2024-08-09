import { Activity } from "@/app/models/activity";
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
import axios from "axios";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { FC } from 'react';
import { z } from "zod";
import { Button } from "../components/ui/button";
import { ActivityForm, formSchema } from "./ActivityForm";

interface ActivitiesListProps {
  activities: Activity[]
  filterValue:string
}


const ActivitiesList: FC<ActivitiesListProps> = ({activities,filterValue}:ActivitiesListProps) => {
  const router = useRouter();
  

  async function onSubmit(values: z.infer<typeof formSchema>,id?:number,) {
    await axios.put("http://localhost:5039/api/Activities/id",values,{
      headers:{
        "Content-Type":"application/json",
      },
      params:{
        id:id
      }
    });
    console.log("VAlues: ",values)
    location.reload();
  }


  async function onDelete(id:number) {
    await axios.delete("http://localhost:5039/api/Activities/id",{
      headers:{
        "Content-Type":"application/json",
      },
      params:{
        id:id
      }
    });
    location.reload();
  }

  const onView = (id:number) => {
    router.push(`http://localhost:3000/activity/${id}`)
  }

    if (filterValue == "date")
    {
      activities.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
      )
  }
  else {
    activities.sort((a, b) => a.id - b.id);
  }
  
  
  return (
    <>
    {activities.map((todo,index) => (
          <div className="max-w-[90%] lg:max-w-screen-md w-full flex flex-col " key={todo.id.toString()}>
          <Card className="flex flex-col rounded-none border-0 p-4" >
          <CardHeader>
            <CardTitle>{todo.title}</CardTitle>
            <CardDescription>{format(todo.date,'do MMMM, yyyy h:mm:ss a')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{todo.description}</p>
          </CardContent>
          <CardFooter>
            <p>{todo.city}</p>
          </CardFooter>
          <div className="flex justify-evenly md:justify-end lg:mr-4 gap-3">
          <Button className="bg-green-500 hover:bg-green-600 w-20" onClick={()=>onView(todo.id)}>View</Button>
          
          <Dialog>
  <DialogTrigger><Button className="bg-blue-500 hover:bg-blue-600 w-20">Edit</Button></DialogTrigger>
  <DialogContent className=" w-full  h-fit overflow-auto lg:max-h-screen max-h-[85vh]  max-w-[85vw] lg:max-w-[32rem]">
    <ActivityForm className="bg-white  p-4 rounded-md " onSubmitFnc={onSubmit} activities={activities[index]}/>
  </DialogContent>
</Dialog>
          <Button className="bg-red-500 hover:bg-red-600 w-20" onClick={()=>onDelete(todo.id)}>Delete</Button>
          </div>
          {/* <div className="flex justify-center">
            <div className="bg-gray-300 h-[2px] w-[95%]"></div>
          </div> */}
          </Card>
          
          </div>
        ))}
    </>
  )
}

export default observer(ActivitiesList)