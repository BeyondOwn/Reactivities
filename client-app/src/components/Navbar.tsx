'use client'
import { useUserStore } from '@/app/stores/userStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useUser } from '@/utils/UserContext';
import {
  CircleUserRound,
  CreditCard,
  LogOut,
  Settings,
  User
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Button } from "./ui/button";
import { ModeToggle } from './ui/theme-toggle';

interface NavbarProps {
  
}



const Navbar: FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const {error,loading,user} = useUser();
  const isLoggedIn = useUserStore((state)=>state.isLoggedIn);
  const logout = useUserStore((state)=>state.logout);

  

  return <div className="grid grid-cols-3 items-center sticky w-full top-0 left-0 bg-gradient-to-r  p-4  border-b-2 bg-background">
    <Button className='w-fit text-left bg-primary text-primary-foreground' onClick={()=>router.push('/')}  >Homepage</Button>
    <div className="text-center">
        <Button onClick={()=>router.push('/create-activity')} className='justify-self-center bg-primary text-primary-foreground'>Create Activity</Button>
      </div>
      <div className='text-right'>
        {user ? 
        (<div className='flex items-center justify-end gap-4' >
          <ModeToggle/>
           <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CircleUserRound className='w-10 h-10'/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <button onClick={logout}>Logout</button>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
          </DropdownMenuContent>
    </DropdownMenu>
    
        </div>)
      :
      <ModeToggle/>}
      
      </div>
      
  </div>
}

export default Navbar