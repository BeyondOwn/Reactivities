'use client'
import { PhotoCropper } from '@/components/common/PhotoCropper';
import PhotoDropzone from '@/components/common/PhotoDropzone';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import agent from '@/utils/agent';
import { useLoading } from '@/utils/LoadingContext';
import { usePhotos } from '@/utils/QueryHelpers/usePhotos';
import { useUser } from '@/utils/UserContext';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Check, ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Photo } from '../models/photo';
import { useProfileStore } from '../stores/ProfileStore';


interface pageProps {
}

async function getProfilePics(username:string){
  const profile = await agent.Profiles.get(username);
  return profile.photos;
}

async function setMainPhoto(photoId:string,handleClose:()=>void){
  const setLoading = useProfileStore.getState().setLoading;
  const mainPhotoUpdated = useProfileStore.getState().mainPhotoUpdated;
  const setMainPhotoUpdated = useProfileStore.getState().setMainPhotoUpdated;
  try{
    setLoading(true);
    await agent.Profiles.setMainPhoto(photoId);
    setMainPhotoUpdated(mainPhotoUpdated);
    toast.success(`Main photo changed successfully`)
  }catch(error){
    console.log(error);
    toast.error(`${error}`)
  }
  finally{
    handleClose();
    setLoading(false);
  }
}

async function DeletePhoto(id:string,handleClose:()=>void,refetch:any){
  const setLoading = useProfileStore.getState().setLoading;
  try{
    setLoading(true);
    await agent.Profiles.deletePhoto(id);
    toast.success(`Photo Deleted successfully`)
  }catch(error){
    console.log(error)
    toast.error(`${error}`)
  }
  finally{
    refetch();
    setLoading(false);
    handleClose()
  }
  
}

async function onCrop(refetch:any,setLoadingState:(id:number,truth:boolean)=>void,file:string) {
  const setLoading = useProfileStore.getState().setLoading;
  const cropper = useProfileStore.getState().cropper;
  
  if (cropper){
    setLoadingState(0,true);
    try {
      cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (blob) {
          console.log(blob)
          await agent.Profiles.uploadPhoto(blob,file);
          refetch(); // Call refetch after the upload is complete
          setLoadingState(0,false);
          toast.success("File Uploaded")

        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  }


const Page: FC<pageProps> = () => {
  const [files,setFiles] = useState<any>([]);
  // const [cropper,setCropper] = useState<Cropper>();
  const cropper = useProfileStore((state)=>state.cropper);
  const previewRef = useRef<HTMLDivElement>(null);
  const [pics,setPics] = useState<Photo[] | null>(null);
  const {user} = useUser();
  const [openDialogId, setOpenDialogId] = useState<string|null>(null);
  const loading = useProfileStore((state)=>state.loading);

  const {loadingStates,setLoadingState} = useLoading();
  const cropperLoading = loadingStates[0] || false;
  
  const handleOpen = (id:string) => setOpenDialogId(id);
  const handleClose = () => setOpenDialogId(null);
  
  

 const {data,refetch} = usePhotos();

 
  useEffect(()=>{
    return () =>{
      files.forEach((file:any) => URL.revokeObjectURL(file.preview));
    }
  },[files])

  // useEffect(()=>{
  //   async function getProfilePicsEffect(){
  //     if(user){
  //       try{
  //         const pictures = await getProfilePics(user?.username);
  //         if (pictures){
  //           setPics(pictures);
  //         }
  //       }
  //       catch(error){
  //         console.log(error)
  //       }
        
  //     }
  //   }


  //   getProfilePicsEffect();
  //   return ()=>{
  //     setPics(null);
  //   }
  // },[user])
 useEffect(()=>{

 },[data,refetch])

  if (user == null) return <LoadingSpinner/>

 

  return <div className='w-full max-h-[100%] flex flex-col items-center'>
   <div className='bg-card p-4 mt-4 flex flex-col flex-grow items-center  w-[80%]  min-h-[54rem] lg:min-h-[22rem]'>
    <div className='flex gap-2 place-self-start'>
    <ImageIcon className='h-7 w-7'/>
    <span className='font-semibold text-xl '>Photos</span>
    </div>
   
    <div className='grid lg:grid-cols-3 place-items-center items-center  gap-14 w-[100%] '>
    
    <div className='flex flex-col col-span-1 gap-1 max-h-[200px] flex-grow'>
    <span className='font-semibold text-lg'>Step 1 - Add Photo</span>
    <PhotoDropzone className='flex flex-col ' setFiles={setFiles}/>
    </div>
    
    <div className='max-h-[200px] flex-grow'>
    <span className='font-semibold text-lg'>Step 2 - Resize Image</span>
    <div className='min-h-[200px] w-[205px] gap-1 border-2 border-primary'>
    {files && files.length > 0 && (
      <PhotoCropper imagePreview={files[0].preview} />
    )}
    </div>
    </div>

    <div className='max-h-[200px]  flex-grow gap-1 '>
    <span className='font-semibold text-lg'>Step 3 - Preview & Upload</span>
   
      <div ref={previewRef} className='img-preview min-h-[200px] overflow-hidden  border-2 border-primary'></div>
      <div className='flex py-2 flex-grow rounded-sm'>
        {cropperLoading ? (<LoadingSpinner className='w-[50%]'/>)
        :(
          <Button onClick={()=>onCrop(refetch,setLoadingState,files[0].path)} className='w-[50%] bg-green-600 hover:bg-green-700'><Check/></Button>
        )}
    
    <Button onClick={()=> {
      setFiles([]);
      previewRef?.current?.querySelector('img')?.remove();
      }} className='w-[50%] bg-gray-500 hover:bg-gray-600'><X/></Button>
    </div>
    </div>
    
   
    </div>
    
  </div>

  <div className='flex flex-col bg-card mt-4 px-4 min-h-[20rem] w-[80%]'>
    <span className='place-self-start  font-semibold text-xl  py-2 px-5'>Set Main Photo - Click Any</span>
    {data ? 
    (
     <div className='flex flex-wrap px-5  w-[100%]'>
      {data.map((photo,index)=>(
        <Dialog 
        open={openDialogId === photo.id} 
        onOpenChange={(isOpen) => {
            if (!isOpen) handleClose(); // Close the dialog when `onOpenChange` is called with false
          }}
        key={photo.id}>
          <DialogTrigger asChild>
            <div className='w-[205px] h-[230px] flex flex-col items-center'>
          <Image onClick={() => handleOpen(photo.id)} className='transition-transform duration-300 ease-out hover:scale-105 hover:border-l-4 
          hover:border-b-4 hover:border-purple-500' 
          alt='' width={200} height={200} src={photo.url}/>
          {photo.isMain ? 
            (
              <span>Main Photo</span>
            ):null}
          {/* <div className="absolute inset-0 bg-white opacity-10 z-20"></div> */}
          </div>
          
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center max-w-[80%] sm:max-w-[400px] overflow-hidden">
          {loading ? (<LoadingSpinner/>):
            (
              <>
              <DialogTitle className='text-center break-all break-words'>Do you want to set this picture as main Profile Picture?</DialogTitle>
          <Image  alt='' width={200} height={200} src={photo.url}/>
          <DialogFooter className='flex flex-col w-[200px] sm:flex-col sm:space-x-0 '>
            <div className='flex flex-row'>
          <Button disabled={photo.isMain} onClick={()=>{
            setMainPhoto(photo.id,handleClose);
          }} className='w-[50%] bg-green-600 hover:bg-green-700'>Yes</Button>
          <Button onClick={()=>{
             handleClose();
          }} className='w-[50%] bg-gray-500 hover:bg-gray-600'>No</Button>
          </div>
          <Button disabled={photo.isMain} onClick={()=>{
             DeletePhoto(photo.id,handleClose,refetch);
          }} className=' w-[100%] bg-red-500 hover:bg-red-600'>Delete</Button>
        </DialogFooter></>
            )}
          
          </DialogContent>
          
          </Dialog>
      ))}
     </div>
    )
    :
    <LoadingSpinner/>
  }
  </div>
  </div>
}

export default Page