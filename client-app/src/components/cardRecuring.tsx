import { Post } from '@/app/models/post';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';

interface cardRecuringProps {
    post:Post,
  posts:Post[],
  textAreaRef: React.MutableRefObject<{ [key: number]: HTMLTextAreaElement | null }>;
  scrollToRef: React.MutableRefObject<{ [key: number]: HTMLElement | null }>;
  onSubmitPost: (postRef:HTMLTextAreaElement,postsToScrollTo:Post[],parentPostId?:any) => void;
  className?:string,
}



const CardRecuring: React.FC<cardRecuringProps> = ({className,post,posts,textAreaRef,scrollToRef,onSubmitPost}:cardRecuringProps) => {
    const replies = posts.filter(reply => reply.parentPostId === post.id);
    const [replyState, setReplyState] = useState<boolean>(false);
    const defaultStyle = "p-2 border-none";
    const newStyle = `${defaultStyle} ${className}`
    const formattedText = post.content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ));

      const handleSubmit = (postId: number,) => {
        const postRef = textAreaRef.current[postId];
        if (postRef) {
          onSubmitPost(postRef,posts, postId);
        } else {
          console.error('Textarea reference is null');
        }
      };

      
  return (
    <div className="w-full max-h-[100%] flex flex-col items-center gap-6">
    
                <div className="max-w-[100%] lg:max-w-screen-md w-full flex flex-col"  ref=
                {el => {
                  if (scrollToRef !=null){
                    (scrollToRef.current[post.id] = el)}} 
                  }
                key={post.id}>
                  <Card className={newStyle}>
                    <div className='flex '>
                    <CardTitle className="text-sm mb-1">{post.creatorDisplayName}</CardTitle>
                    <CardDescription className='ml-2 text-sm '>{formatDistanceToNow(new Date(post.date), {addSuffix: true })}</CardDescription>
                    </div>
                    <CardContent className="text-lg max-w-[780px] p-0 pt-2 leading-5 mb-2">
                    <p className="break-all break-words overflow-x-auto">{formattedText}</p>
                    </CardContent>
                    
                    <div className="flex flex-col">
                        {!replyState ? 
                        (
                            <Button className='w-24 flex items-center space-x-2 ' onClick={()=>setReplyState(true)}><MessageSquare className="h-5 w-5" /> <span className='text-sm'>Reply</span></Button>
                        )
                        :
                        (
                            <div className=''>
                                <Textarea ref={el =>
                           {
                            if (el){
                              textAreaRef.current[post.id] = el
                            }
                    }}  className="" placeholder="Type your thoughts here." />
                    <Button className="place-self-center mt-2 mr-2" onClick={()=>handleSubmit(post.id)}>Submit</Button>
                    <Button className='w-20 bg-red-600 hover:bg-red-700' onClick={()=>setReplyState(false)}>Cancel</Button>
                            </div>
                        )}
                    
                    </div>
                    {replies.map(reply => (
                <div className="ml-6" key={reply.id}>
                    <CardRecuring
                        className={newStyle}
                        post={reply}
                        posts={posts}
                        textAreaRef={textAreaRef}
                        scrollToRef={scrollToRef}
                        onSubmitPost={onSubmitPost}
                    />
                </div>
      ))}
                  </Card>
                    {/* show replies */}
                </div>
</div>
)};

export default CardRecuring;
