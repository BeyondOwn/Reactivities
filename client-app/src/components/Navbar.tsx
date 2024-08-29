'use client'
import { useProfileStore } from '@/app/stores/ProfileStore';
import { useUserStore } from '@/app/stores/userStore';
import { usePhotos } from '@/utils/QueryHelpers/usePhotos';
import { useUser } from '@/utils/UserContext';
import {
  BadgePlus,
  CircleUserRound,
  LogIn,
  LogOut,
  Moon,
  UserCog
} from "lucide-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';
import { Button } from "./ui/button";
import { Separator } from './ui/separator';
import ToggleSwitch from './ui/ToggleSwitch';

interface NavbarProps {
  
}



const Navbar: FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const {error,loading,user} = useUser();
  const isLoggedIn = useUserStore((state)=>state.isLoggedIn);
  const logout = useUserStore((state)=>state.logout);
  const mainPhotoUpdated = useProfileStore((state)=>state.mainPhotoUpdated);
  //drop menu
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

   const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event:MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

    // Add and clean up event listener for clicks outside
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

     // Close the menu when an item is clicked
    const handleItemClick = () => {
    setIsOpen(false);
    };


 const {data,refetch} = usePhotos();

  const profilePic = data?.find((photo)=>photo.isMain === true);

  useEffect(()=>{
    refetch();
  },[mainPhotoUpdated])


  return <div className="z-10 grid grid-cols-3 items-center sticky w-full top-0 left-0 bg-gradient-to-r  px-4 py-2  border-b-2 bg-background">
    <Button className='w-fit text-left bg-primary text-primary-foreground' onClick={()=>router.push('/')}  >Homepage</Button>
    <div className="text-center">
        <Button onClick={()=>router.push('/create-activity')} className='justify-self-center bg-primary text-primary-foreground'><BadgePlus className='h-8 w-8 mr-1'/> Create Activity</Button>
      </div>
      <div className='text-right flex justify-end'>
      {user? (
          <div className="relative inline-block text-left" ref={menuRef}>
          {profilePic ? <Image onClick={toggleMenu} objectFit='stretch' className=' cursor-pointer rounded-full' alt='user profile pic' width={40} height={40} src={profilePic?.url}/>
                  :
                  (<CircleUserRound onClick={toggleMenu} width={32} height={32} className='cursor-pointer'/>)
                  }
          {isOpen && (
            <div className="absolute  right-0 mt-[0.7rem] border-0 ml-8 min-w-[256px] bg-neutral rounded-sm  leading-4">
              <div className='flex flex-col justify-center px-4 py-2 min-h-[56px]'>
                <div className='flex flex-row gap-2 items-center '>
              {profilePic ? <Image  objectFit='stretch' className=' rounded-full' alt='user profile pic' width={40} height={40} src={profilePic?.url}/>
                  :
                  (<CircleUserRound width={24} height={24} className=''/>)
                  }
                  <span className='font-serif font-bold break-words break-all'>{user?.displayName}</span>
                  </div>
                  </div>
                  <Separator/>
              <ul className='flex flex-col '>
                <li
                  onClick={()=>{setIsOpen(false);router.push('/profile')}}
                  className="flex items-center px-4 py-2 hover:bg-neutralHover cursor-pointer rounded-none min-h-[56px] "
                >
                  <div className='flex items-center gap-2  '> 
                  <UserCog width={24} height={24}/>
                  
                  <span className=''>View Profile</span>
                  </div>
                  
                </li>
                <li
                  // onClick={handleItemClick}
                  className="flex items-center px-4 py-2 hover:bg-neutralHover cursor-pointer rounded-none min-h-[56px]"
                >
                  <div className='flex items-center gap-2'>
                  <Moon width={24} height={24}/>
                  <span className='mr-8'>Dark Mode</span>
                  <ToggleSwitch/>
                  </div>
                </li>
                <li
                  onClick={()=>{setIsOpen(false);logout();}}
                  className="flex px-4 py-2 hover:bg-neutralHover cursor-pointer rounded-none items-center min-h-[56px]"
                >
                  <div className='flex items-center gap-2'>
                    <LogOut width={24} height={24}/>
                    <button onClick={logout}>Logout</button>
                  </div>
                  
                </li>
              </ul>
            </div>
          )}
        </div>
      ) 
      : 
      (
        <div className='relative inline-block text-left '>
                <div className='flex items-center  '>
                  <div className='flex gap-2 items-center p-2'>
                  <div className='flex items-center gap-2 justify-center '>
                  <Moon width={24} height={24}/>
                  <span className=''>Dark Mode</span>
                  
                  </div>
                  <ToggleSwitch/>
                  </div>
                  <div onClick={()=>router.push('/login')} className='flex items-center gap-2 ml-4 hover:bg-neutralHover cursor-pointer p-2'>
                    <LogIn width={24} height={24}/>
                    <button >Login</button>
                  </div>
                  
                </div>
                
                  
        </div>
      )}
    
      
  </div>
  </div>
}

export default Navbar