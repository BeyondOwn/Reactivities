'use client'

import { Attendance } from "@/app/models/Attendance";
import { Post } from "@/app/models/post";
import { useAttendanceStore } from "@/app/stores/AttendanceStore";
import { usePostsStore } from "@/app/stores/PostsStore";
import { ActivityForm } from "@/components/ActivityForm";
import CardRecuring from "@/components/cardRecuring";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import agent, { baseURL } from "@/utils/agent";
import { convertUTCDateToLocalDate } from "@/utils/convertUTCDateToLocalDate";
import { onDelete, onJoin, onLeave, onSubmit } from "@/utils/crudUtils";
import { useLoading } from "@/utils/LoadingContext";
import { useScrollTo } from "@/utils/scrollTo";
import { useActivities } from "@/utils/useActivities";
import { usePosts } from "@/utils/usePosts";
import { useUser } from "@/utils/UserContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface activityIdInterface{
  params:{
    activityId: number
  }
  
}

const fetchActivity = async (id: number) => {
  const res = await axios.get(`${baseURL}/Activities/${id}`);
  return res.data;
};

type Refs = {[key:number]:HTMLTextAreaElement}

export default function Page({params}:activityIdInterface) {
  // const postRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = useRef<Refs>({});
  const {user,loading} = useUser();
  const userAttendance = useAttendanceStore((state) => state.userAttendance)
  const setUserAttendance = useAttendanceStore((state)=>state.setUserAttendance)
  const userAttendanceUpdated = useAttendanceStore((state)=> state.userAttendanceUpdated)

  const activityAttendance = useAttendanceStore((state) => state.activityAttendance)
  const setActivityAttendance = useAttendanceStore((state)=>state.setActivityAttendance)
  const activityAttendanceUpdated = useAttendanceStore((state)=> state.activityAttendanceUpdated)

  const router = useRouter();
  const refetch = useActivities().refetch;

  const [loadingPost,setLoadinPost] = useState<boolean>(true);

  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);


  const handleOpenChange = (id: number, isOpen: boolean) => {
    setOpenDialogId(isOpen ? id : null);
  };



  const [scrollToRef, setShouldScrollTo] = useScrollTo<HTMLDivElement>();


  const { loadingStates, setLoadingState } = useLoading();

    
  const { isPending, isError, data, error, refetch:refetchSpecificActivity } = useQuery({
    queryKey: [`activity/${params.activityId}`],
    queryFn: ()=>fetchActivity(params.activityId),
    refetchOnMount:false,
  })


  

  const onSubmitPost = async (postRef:HTMLTextAreaElement,postsToScrollTo:Post[],parentPostId?:any) =>{
    if (postRef){
      const textAreaValue = postRef.value;
      console.log(new Date(Date.now()).toISOString());
    const post = {
      "Date":new Date(Date.now()),
      "Content":textAreaValue,
      "CreatorId":user?.id,
      "CreatorDisplayName":user?.displayName,
      "ActivityId":params.activityId,
      "ParentPostId":parentPostId ? parentPostId : null
    }
    try{
      const res = await agent.requests.post(`${baseURL}/Posts`,post)
      refetchPost();
      toast.success("Posted Succesfully");
      try{
        const posts = await agent.requests.get(`${baseURL}/Posts/${params.activityId}`) as Post[];
      setPosts(posts);

      }
      catch(error){
        console.log(error);
      }
      finally{
        if (postRef !=null){
          postRef.value = "";
        }
        
        
        if (posts !=null){
          setShouldScrollTo(postsToScrollTo[postsToScrollTo?.length-1].id.toString())
        }
      }

    }catch(error){
      console.log(error);
    }
    }
    
  }

useEffect(()=>{
  async function getAttendance(){
    if(!user) return;
      try{
        const userAttendance = await agent.requests.get(`${baseURL}/ActivityAttendance/userId/${user?.id}`) as Attendance[];
        setUserAttendance(userAttendance);
       } 
       catch(error){
        console.log(error);
       }
    }

    async function getActivityAttendance(){
      try{
        const activityAttendanceh = await agent.requests.get(`${baseURL}/ActivityAttendance/activityId/${params.activityId}`) as Attendance[];
      setActivityAttendance(activityAttendanceh);
      }catch(error){
        console.log(error)
      }
    }
  getActivityAttendance();
  getAttendance();
  return() =>{
    setUserAttendance(null);
    setActivityAttendance(null);
  }
},[user])

  useEffect(()=>{
    
  },[userAttendanceUpdated])

  useEffect(()=>{
    
  },[activityAttendanceUpdated])


  const {
    data: dataPost,
    refetch: refetchPost,
    error:errorPost,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = usePosts(params.activityId);
  
  const setPosts = usePostsStore((state) => state.setPosts);

  useEffect(()=>{
    async function getPosts(){
      try{
      const posts = await agent.requests.get(`${baseURL}/Posts/${params.activityId}`) as Post[];
      setPosts(posts);
      }catch(error){
        console.log(error)
      }
      finally{
        setLoadinPost(false);
      }
      
    }
    getPosts();
    return() =>{
      setPosts(null);
      setLoadinPost(true);
    }
  },[])
  
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dataPost) {
      const allPosts = dataPost.pages.flatMap((page) => page.items);
      setPosts(allPosts);
    }
  }, [dataPost, setPosts]);

  const posts = usePostsStore((state)=>state.posts);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  useEffect(()=>{
    
  },[posts])


  if (status === 'pending') {
    return(<div className="flex justify-center items-center h-[calc(92dvh+4px)]">
      <LoadingSpinner className="h-32 w-32 md:w-80 md:h-80 text-blue-500"></LoadingSpinner>
    </div>) 
  }

  if (status === 'error') {
    return <span>{error?.message}</span>
  }
  
 

  if (isPending) {
    return(<div className="flex justify-center items-center h-[90vh] ">
      <LoadingSpinner className="w-80 h-80 text-blue-500"></LoadingSpinner>
    </div>) 
  }


  if (posts == null) return <LoadingSpinner></LoadingSpinner>

  if (isError) {
    return <span>{error.message}</span>
  }


 
  const isAttending = userAttendance?.find((elem) => elem.activityId === data.id);
  const isCreator = user?.id === data.creatorId;
  const isLoading = loadingStates[data.id] || false;
  const topLevelPosts = posts.filter((elem)=>elem.parentPostId === null);

  const formatedDate = convertUTCDateToLocalDate(new Date(data.date));

  return (
    <div className="w-full max-h-[100%] flex flex-col items-center mt-4">
      <div className="flex  lg:max-w-[824px] lg:mr-14 w-full max-w-[90%]">
      <Button className="hidden lg:block bg-secondary-dark rounded-full hover:bg-secondary mr-1"   onClick={()=>router.back()}><ArrowLeft className="text-bg-secondary"/></Button>
    <div className="flex flex-col lg:max-w-screen-md w-full max-w-[100%]">
    <Card className="flex flex-col  rounded-md pb-2 mb-2" >
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
            <CardDescription>{formatDistanceToNow(new Date(formatedDate), {addSuffix: true })}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{data.description}</p>
          </CardContent>
          <CardFooter>
            <p>{data.city}</p>
          </CardFooter>
          <CardContent className="flex flex-col items-center w-max self-end p-2 gap-2">
          {activityAttendance ? 
            <div className="">
            <p className="">There are {activityAttendance?.length} participants</p></div>  : 
          <div className="">
          <div className=" space-y-2">
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>}
          <div className="flex justify-end gap-3  md:justify-end">
          {!isCreator && isAttending ? 
          isLoading  ? 
          (
            <LoadingSpinner className="h-[2.5rem] w-20"></LoadingSpinner>
          )
          :
          (
          <Button className="bg-red-600 hover:bg-red-700 w-20 " onClick={()=>onLeave(params.activityId,user,setLoadingState)}>Leave</Button>
          )
          : !isCreator && !isAttending && userAttendance !=null ?
          isLoading  ?
          (
          <LoadingSpinner className="h-[2.5rem] w-20"></LoadingSpinner>
          )
          :
          (
            <Button className="bg-purple-600 hover:bg-purple-700 w-20" onClick={()=>onJoin(params.activityId,user,setLoadingState)}>Join</Button>
          )
          : null
        }
          {/* <Button className="bg-green-600 hover:bg-green-700 w-20" onClick={()=>onView(params.activityId,router)}>View</Button> */}
          
          {isCreator && (
            <Dialog 
            open={openDialogId === data.id}
            onOpenChange={(isOpen) => handleOpenChange(data.id, isOpen)}
            >
            <DialogTrigger><Button className="bg-blue-600 hover:bg-blue-700 w-20">Edit</Button></DialogTrigger>
            <DialogContent className=" w-full  h-fit overflow-auto lg:max-h-screen max-h-[85vh]  max-w-[85vw] lg:max-w-[32rem]">
              <ActivityForm className="p-4 rounded-md" setOpen={setOpenDialogId} onSubmitFnc={onSubmit} givenActivity={data} refetch={refetchSpecificActivity}/>
            </DialogContent>
          </Dialog>
          ) }
          {isCreator && (
            <Button className="bg-red-600 hover:bg-red-700 w-20" onClick={()=>onDelete(params.activityId,refetch,router)}>Delete</Button>
          )}
          <Button className="bg-purple-600 hover:bg-purple-700 w-20" onClick={()=>router.push(`${params.activityId}/chatroom`)}>ChatRoom</Button>
          </div>

          
          {/* <div className="flex justify-center">
            <div className="bg-gray-300 h-[2px] w-[95%]"></div>
          </div> */}
           
          </CardContent>
          <div className="flex flex-col p-6">
          <Textarea ref={el =>
                           {
                            if (el){
                              textAreaRef.current[data.id] = el
                            }
                    }} className="" placeholder="Type your thoughts here." onFocus={()=>{setIsFocused(true)}} /> 
                    {isFocused && (
                        <div>
                            <Button className="place-self-center mt-2 mr-2" onClick={()=>onSubmitPost(textAreaRef.current[data.id],posts)}>Comment</Button>
                            <Button className='w-20 bg-red-600 hover:bg-red-700' onClick={()=>setIsFocused(false)}>Cancel</Button>
                        </div>
                    )
                  
                    }
          
          </div>
          </Card>
          </div>
          </div>
         
          {/* Comment Section */}
        {loadingPost ? <LoadingSpinner /> : (
          <div className="w-full max-h-[100%] flex flex-col items-center mt-4 gap-6">
            {topLevelPosts.map(post => (
              <div className="rounded-md border max-w-[90%] lg:max-w-screen-md w-full flex flex-col" key={post.id}> 
              <CardRecuring
                className="border-none shadow-none drop-shadow-none"
                key={post.id}
                post={post}
                posts={posts}
                textAreaRef={textAreaRef}
                scrollToRef={scrollToRef}
                onSubmitPost={onSubmitPost}
              />
          </div>
            ))}
            <div ref={observerRef} style={{ height: 20, background: 'transparent' }}>
          {isFetchingNextPage && <p>Loading more...</p>}
          </div>
          </div>
          )
          }
          
          
          </div>
  )
}