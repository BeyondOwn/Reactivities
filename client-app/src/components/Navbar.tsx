'use client'
import { useProfileStore } from '@/app/stores/ProfileStore';
import { useUserStore } from '@/app/stores/userStore';
import { usePhotos } from '@/utils/QueryHelpers/usePhotos';
import { useUser } from '@/utils/UserContext';
import {
  BadgePlus,
  CircleUserRound
} from "lucide-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';
import { Button } from "./ui/button";
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


  return <div className="z-10 grid grid-cols-3 items-center sticky w-full top-0 left-0 bg-gradient-to-r  p-4  border-b-2 bg-background">
    <Button className='w-fit text-left bg-primary text-primary-foreground' onClick={()=>router.push('/')}  >Homepage</Button>
    <div className="text-center">
        <Button onClick={()=>router.push('/create-activity')} className='justify-self-center bg-primary text-primary-foreground'><BadgePlus className='h-8 w-8 mr-1'/> Create Activity</Button>
      </div>
      <div className='text-right'>

      <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Menu
      </button>
      {isOpen && (
        <div className="absolute  right-0 mt-[1.25rem] ml-8 min-w-[256px] bg-neutral border rounded-md">
          <ul className='flex flex-col gap-1'>
            <li
              onClick={()=>{setIsOpen(false);router.push('/profile')}}
              className="px-4 py-2 hover:bg-neutralHover cursor-pointer rounded-md  "
            >
              <div className='flex'>
              {profilePic ? <Image  objectFit='stretch' className=' rounded-full' alt='user profile pic' width={34} height={34} src={profilePic?.url}/>
              :
              (<CircleUserRound className='w-10 h-10'/>)
              }
              
              <div className='flex flex-col ml-1'>
              <span className=''>View Profile</span>
              <span className='font-serif'>{user?.displayName}</span>
              </div>
              
              </div>
              
            </li>
            <li
              // onClick={handleItemClick}
              className="px-4 py-2 hover:bg-neutralHover cursor-pointer rounded-md"
            >
              <div className='flex items-center gap-2'>
              <span className=''>Dark Mode</span>
              <ToggleSwitch/>
              </div>
            </li>
            <li
              onClick={()=>{setIsOpen(false);logout();}}
              className="px-4 py-2 hover:bg-neutralHover cursor-pointer rounded-md"
            >
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
       
           
      
        
      
      
       
      
      
      </div>
      
  </div>
}

export default Navbar