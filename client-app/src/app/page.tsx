'use client'
import DisplayActivities from "@/components/DisplayActivites"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useUser } from "@/utils/UserContext"
import { FC } from "react"


interface pageProps {
}

const Page: FC<pageProps> = ({}) => {
      const { user, loading, error } = useUser();
      console.log(user);

      if (loading) return <LoadingSpinner></LoadingSpinner>

      if (error) return <div>{error.message}</div>

  return <div className="w-full flex flex-col gap-4 mt-3 items-center">
    
      <div className="flex flex-col w-full">
        <h1 className="w-fit place-self-center">Welcome Back {user?.displayName}</h1>
        <DisplayActivities/>
        </div>
    
  </div>
}

export default Page