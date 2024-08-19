'use client'
import DisplayActivities from "@/components/DisplayActivites"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Login, formSchema as LoginSchema } from "@/components/Login"
import { Register, formSchema as RegisterSchema } from "@/components/Register"
import { useUser } from "@/utils/UserContext"
import axios from "axios"
import { useRouter } from "next/navigation"
import { FC } from "react"
import { z } from "zod"
import { useUserStore } from "./stores/userStore"


interface pageProps {
}

const Page: FC<pageProps> = ({}) => {
const router = useRouter();
const login = useUserStore((state)=> state.login)
    async function onRegister(values: z.infer<typeof RegisterSchema>) {
        await axios.post("http://localhost:5039/api/Account/register",values,{
          headers:{
            "Content-Type":"application/json",
          },
        });
        window.location.href="/"
        // router.refresh();
        // Doesnt work im calling window.location.reload from login
      }

      async function onLogin(values: z.infer<typeof LoginSchema>) {
        login(values)
        // router.refresh();
      }

      const { user, loading, error } = useUser();
      console.log(user);

      if (loading) return <LoadingSpinner></LoadingSpinner>

      if (error) return <div>{error.message}</div>

  return <div className="w-full flex flex-col gap-4 mt-3 items-center">
    {user
    ? (
      <div className="flex flex-col w-full">
        <h1 className="w-fit place-self-center">Welcome Back {user?.displayName}</h1>
        <DisplayActivities/>
        </div>
    )
    :(<>
    <Register onSubmitFnc={onRegister} className="max-w-[85vw]  max-w-[22rem] lg:max-w-[32rem] w-full  p-2 rounded-md" />
    <Login onSubmitFnc={onLogin} className="max-w-[85vw]  max-w-[22rem] lg:max-w-[32rem] w-full  p-2 rounded-md" />
    </>)
  }
    
  </div>
}

export default Page