'use client'
import GetActivity from "@/components/GetActivity";
import GetAllActivities from "@/components/GetAllActivities";
import { useState } from "react";

 

export default function Home() {
  const [activity, SetActivity] = useState<string>("") 


  return (
    <div className="flex flex-col justify-center items-center text-3xl">
    <GetActivity url="http://localhost:5039/api/Activities/B3FEF522-E5E4-413B-E0AA-08DCB5500043"/>
    <h1 className="text-red-500 text-6xl font-bold">Break---</h1>
    <GetAllActivities url="http://localhost:5039/api/Activities"/>
    </div>
    
  );
}
