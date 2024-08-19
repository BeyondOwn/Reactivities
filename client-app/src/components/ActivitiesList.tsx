import { useActivitiesStore } from "@/app/stores/ActivitiesStore";
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
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FC } from 'react';
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { ActivityForm, formSchema } from "./ActivityForm";

interface ActivitiesListProps {
}


const ActivitiesList: FC<ActivitiesListProps> = () => {
  const router = useRouter();
  const filterValue = useFilterStore((state) => state.filterValue);
  const activities = useActivitiesStore((state) => state.activities)

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
    location.reload();
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

  const onJoin = (id:number) => {
    // try{
    //   await agent.requests.put(`http://localhost:5039/api/Activities/id?id=${id}`,values)
    //   location.reload();
    //  } 
    //  catch(error){
    //   console.log(error);
    //  }
    toast.success("You joined the activity");
    router.push(`http://localhost:3000/activity/${id}`)
  }
  
  
  return (
    <>
    {activities.map((todo,index) => (
          <div className="max-w-[90%] lg:max-w-screen-md w-full flex flex-col" key={todo.id.toString()}>
          <Card className="flex flex-col rounded-none border-0 p-4 bg-card" >
          <CardHeader>
            <CardTitle>{todo.title}</CardTitle>
            <CardDescription>{format(todo.date,'do MMMM, yyyy h:mm:ss a')}</CardDescription>
            <CardDescription className="text-primary">Created by {todo.userDisplayName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{todo.description}</p>
          </CardContent>
          <CardFooter>
            <p>{todo.city}</p>
          </CardFooter>
          <div className="flex justify-evenly md:justify-end lg:mr-4 gap-3">
          <Button className="bg-purple-500 hover:bg-purple-600 w-20" onClick={()=>onJoin(todo.id)}>Join</Button>
          <Button className="bg-green-500 hover:bg-green-600 w-20" onClick={()=>onView(todo.id)}>View</Button>
          
          <Dialog>
  <DialogTrigger><Button className="bg-blue-500 hover:bg-blue-600 w-20">Edit</Button></DialogTrigger>
  <DialogContent className=" w-full  h-fit overflow-auto lg:max-h-screen max-h-[85vh]  max-w-[85vw] lg:max-w-[32rem]">
    <ActivityForm className="p-4 rounded-md " onSubmitFnc={onSubmit} activities={activities[index]}/>
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

export default ActivitiesList