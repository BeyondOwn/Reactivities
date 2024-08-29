'use client'
import ActivitiesList from "@/components/ActivitiesList";
import Filter from "@/components/Filter";
import { useUser } from "@/utils/UserContext";



export default function DisplayActivities() {

  const {user} = useUser();
  // if (user == undefined){
  //   throw new Error("user undefined");
  // }
  

  return (
    // <div className="flex flex-col items-center text-xl w-full">
    // <GetAllActivities className=" w-[48rem]" url=/>
    // </div>
    
    <div className="flex w-full gap-8 justify-center mt-4">
    <div className="max-w-screen-md w-full flex flex-col items-center gap-2">
      <Filter ></Filter>
        <ActivitiesList />
    </div>
      {/* <ActivityForm className="hidden sm:flex max-w-[26rem] w-full flex-col bg-white h-fit  border-4 border-black p-2 rounded-md"/> */}
    </div>
    
  );
}
