'use client'
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Button } from "./ui/button";

interface NavbarProps {
  
}



const Navbar: FC<NavbarProps> = ({}) => {
  const router = useRouter();

  return <div className="sticky w-full top-0 left-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-600 p-4 space-x-4 flex justify-between ">
    <Button onClick={()=>router.push('/')}  variant={'secondary'} >Homepage</Button>
    <div className="flex-1 flex justify-center">
        <Button onClick={()=>router.push('/create-activity')} variant={'secondary'} className='w-36 bg-green-400 hover:bg-green-500'>Create Activity</Button>
      </div>
  </div>
}

export default Navbar