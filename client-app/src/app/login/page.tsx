'use client'
import GoogleAuth from '@/components/auth/GoogleAuth';
import GoogleAuthOneTap from '@/components/auth/GoogleAuthOneTap';
import { Login, formSchema as LoginSchema } from '@/components/Login';
import { formSchema as RegisterSchema } from '@/components/Register';
import { Separator } from '@/components/ui/separator';
import { baseURL } from '@/utils/agent';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { z } from 'zod';
import { useUserStore } from '../stores/userStore';

interface pageProps {
  
}

async function onRegister(values: z.infer<typeof RegisterSchema>) {
    await axios.post(`${baseURL}/Account/register`,values,{
      headers:{
        "Content-Type":"application/json",
      },
    });
    window.location.href="/"
    // router.refresh();
    // Doesnt work im calling window.location.reload from login
  }

  async function onLogin(values: z.infer<typeof LoginSchema>) {
    const login = useUserStore.getState().login;
    login(values)
    // router.refresh();
  }

const Page: FC<pageProps> = ({}) => {
    //GOOGLE 1 tap
    GoogleAuthOneTap();
    const router = useRouter();
  return <div className='flex flex-col items-center justify-start min-h-[93dvh] h-full'>
    <div className=' flex flex-col items-center bg-card mt-4 sm:w-[400px] w-[90%] h-fit p-4'>
      <div className='p-8'>
    <span className='font-bold text-2xl mb-4'>Sign in to Reactivities</span>
    <Login className='flex flex-col w-[250px]' onSubmitFnc={onLogin}/>
    <div className='w-[250px] mt-6 mb-3 flex justify-center items-center'>
    <Separator className='w-[21%]'/>
    <span className='font-mono'>or continue with</span>
    <Separator className='w-[21%]'/>
    </div>
    </div>
    
    <GoogleAuth/>
    
    </div>
  </div>
}

export default Page