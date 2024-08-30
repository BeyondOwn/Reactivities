'use client'
import { useChatCommentStore } from '@/app/stores/chatCommentStore';
import { Button } from '@/components/ui/button';
import { useUser } from '@/utils/UserContext';
import { FC, useEffect, useRef, useState } from 'react';


interface pageProps {
    params:{
        activityId: number
    }
}

const Page: FC<pageProps> = ({params}:pageProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState('');
    const {user} = useUser();
    const createHubConnection = useChatCommentStore((state)=>state.createHubConnection);
    const addComment = useChatCommentStore((state)=>state.addComment);
    const comments = useChatCommentStore((state)=>state.comments);
    useEffect(()=>{
        if (params.activityId)
            console.log("here:",params.activityId)
            {
                if (user !=null){
                    createHubConnection(params.activityId.toString(),user);
                }
            }
          
    },[params.activityId,user])

   

   
  return <div>
    {comments.map(comment =>(
        <div key={comment.id}>
            {/* <Image alt='comment image avatar' src={comment.image}/> */}
            <span>Username:{comment.username}</span>
            <span>DisplayName:{comment.displayName} </span>
            <span>{comment.createdAt.toLocaleString()}</span>
            <span>Content: {comment.body}</span>
        </div>
    ))}
    <form>
        <input className='border-foreground border-2' value={inputValue} onChange={(e)=> setInputValue(e.target.value)} ref={inputRef}></input>
        <Button type="button" onClick={()=>{addComment({body:inputValue},params.activityId.toString())
        }}>Send</Button>
    </form>
  </div>
}

export default Page