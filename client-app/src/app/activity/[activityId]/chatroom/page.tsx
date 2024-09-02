'use client'
import { useChatCommentStore } from '@/app/stores/chatCommentStore';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/utils/UserContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


interface pageProps {
    params:{
        activityId: number
    }
}

interface arrayOfUsersInterface{
    user:string,
    color:string
}

const formSchema = z.object({
    body: z.string().min(1).max(600,"Message must contain maximum 600 characters!")
})

const Page: FC<pageProps> = ({params}:pageProps) => {
    const bodyRef = useRef<HTMLTextAreaElement | null>(null);
    const refs = useRef<Record<string, HTMLDivElement | null>>({});
    const [inputValue, setInputValue] = useState('');
    const {user} = useUser();
    const createHubConnection = useChatCommentStore((state)=>state.createHubConnection);
    const addComment = useChatCommentStore((state)=>state.addComment);
    const getUsersInGroup = useChatCommentStore((state)=>state.getUsersInGroup);
    const onlineUsers = useChatCommentStore((state)=>state.onlineUsers)
    const hubConnection = useChatCommentStore((state)=>state.hubConnection);
    const comments = useChatCommentStore((state)=>state.comments);
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardHeight = 24; // Example height of one card (in pixels)
    let arrayOfUsers:arrayOfUsersInterface[] = []
    const [initialScroll, setInitialScroll] = useState(false);

    // useEffect(()=>{
    //     if (comments.length>1){
    //         const lastComment=comments[comments.length-1];
    //         lastComment.createdAt = formatDateToday(convertUTCDateToLocalDate(new Date(lastComment.createdAt)).toString())
    //         console.log("useFfect")
    //     }
    // },[comments])
    
    

    const {clearErrors,register,handleSubmit,getValues,reset,formState:{errors}} = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema)
    });

    const onSubmitMessage = (message:z.infer<typeof formSchema>) =>{
        console.log("message: ",message);
        addComment(message,params.activityId.toString());
        // bottomRef.current?.scrollIntoView({ behavior: 'instant' });
        clearErrors();
        reset();
    }

    const handleKeyDown = (event:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            // Prevent the default behavior (new line)
            console.log("key down")
            event.preventDefault();
            handleSubmit(onSubmitMessage)(); // Call the submit handler
        }
    };

    useEffect(()=>{
        const location = window.location.href;
        return ()=>{
            hubConnection?.stop();
        }
    },[hubConnection])

    useEffect(()=>{
        if (params.activityId)
            console.log("here:",params.activityId)
            {
                if (user !=null){
                    createHubConnection(params.activityId.toString(),user);
                }
            }
          
    },[params.activityId,user])

    useEffect(()=>{
     if (comments.length>1 && !initialScroll){
        bottomRef.current?.scrollIntoView({ behavior: 'instant' });
        setInitialScroll(true);
     }   
    })
    
   
    useEffect(()=>{
        const container = containerRef.current;
        if(container && comments.length>1){
            const isUserAtBottom = () => {
                const scrollPosition = container.scrollHeight - container.scrollTop;
                const containerHeight = container.clientHeight;
                const lastCommentId = comments[comments.length - 1].id.toString();
                const lastCommentRef = refs.current[lastCommentId];
                if (lastCommentRef) {
                return scrollPosition <= containerHeight + lastCommentRef?.offsetHeight
                }
            };
    
            // Scroll to the bottom if the user is at the bottom
            if (isUserAtBottom()) {
                bottomRef.current?.scrollIntoView({ behavior: 'instant' });
            }
        }
        // Function to check if the user is at the bottom
        
    })

    const formatText = (text:string) =>{
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ));
    }

    // Function to convert a hash value to a hex color
    const hashToHex = (hash:any) => {
    const hex = (hash & 0x00FFFFFF).toString(16).padStart(6, '0');
    return `#${hex.toUpperCase()}`;
    };

    // Function to generate a color based on a username
    const generateColor = (username:string) => {
    const hash = username.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
  
    return hashToHex(hash);
  };

    const assignColor = (user:string) =>{
     return generateColor(user);
    }

    // console.log(comments);
  return <div className='flex flex-col items-center justify-center w-full h-[93vh]'>
    <div className='flex flex-col justify-center border-2 border-foreground w-[90%] min-h-[5%] max-h-[5%] border-b-0 bg-background rounded-t-sm'>
        <span className='sm:ml-6 text-3xl font-bold'>Chat</span>
    </div>
    <div className='flex w-[90%] max-h-[76%] sm:max-h-[82%] bg-neutral border-2 border-foreground'>
    <div ref={containerRef} className='scrollbar-thin bg-neutral flex flex-col  w-[100%] max-h-[100%] sm:max-h-[100%]  overflow-x-hidden overflow-y-scroll'>
    <div className='flex flex-col'>
    {comments.map(comment =>(
        <div className=' flex gap-2 sm:pl-4 py-2' ref={el => { refs.current[comment.id.toString()] = el; }} key={comment.id}>
            {/* <Image alt='comment image avatar' src={comment.image}/> */}
            <div className='min-w-[40px]'>{comment.image && comment.image != "empty" ? <Image className='rounded-full' width={40} height={40} alt='user profile pic' src={comment.image}/> : <CircleUserRound className='w-10 h-10'/>}</div>
            <div className='flex flex-col'>
                <div className='flex gap-2 items-center'>
            <span className='sm:text-lg' style={{color:assignColor(comment.displayName)}}>{comment.displayName}</span>
            <span className='text-muted-foreground text-xs'>{comment.createdAt}</span>
                </div>
                
            <span className='break-words break-all text-wrap'>{formatText(comment.body)}</span>
            </div>
        </div>
    ))}
   <div className='h-[1px]' ref={bottomRef}></div>
    </div>
    </div>
    <div className='sm:flex flex-col  items-start hidden  md:min-w-[250px] sm:min-w-[100px] scrollbar-thin overflow-y-scroll'>
        {onlineUsers.map((user)=>(
            <div className='flex pl-4 py-2 gap-2 items-center' key={user.userName}>
                <div className='min-w-[40px]'>{user.image && user.image != "empty" ? <Image className='rounded-full' width={40} height={40} alt='user profile pic' src={user.image}/> : <CircleUserRound className='w-10 h-10'/>}</div>
                <span className='text-lg' style={{color:assignColor(user.displayName)}}>{user.displayName}</span>
                </div>
        ))}
        </div>
        </div>
    <div className='border-2 border-foreground  border-t-0 w-[90%] min-h-[40px]  rounded-b-sm'>
    <form onSubmit={handleSubmit(onSubmitMessage)} className='min-h-[40px]'>
        <Textarea  onKeyDown={handleKeyDown} {...register("body")} className='scrollbar-thin h-auto min-h-[60px] resize-none  focus-visible:ring-0 bg-neutral sm:pl-4 ring-0 outline-none focus:ring-0 rounded-t-none rounded-b-sm border-none  w-full '  placeholder='Message'></Textarea>
    </form>
    {errors.body ? <p className='sm:pl-4 font-bold bg-neutral min-h-[20px]' style={{ color: 'red' }}>{errors.body.message}</p>:<p className='bg-neutral min-h-[20px]' ></p>}
    </div>
  </div>
}

export default Page