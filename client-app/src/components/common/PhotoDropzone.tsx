'use client'
import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props{
  setFiles:(files: any) =>void;
  className:string,
}

export default function PhotoDropzone({setFiles,className}:Props) {
    const dzStyles='w-[200px] border-dashed border-cyan-400 border-2 h-[200px] flex flex-col justify-center items-center'
    const dzActive = 'border-green-400'
    const onDrop = useCallback((acceptedFiles:File[]) => {
      setFiles(acceptedFiles.map((file:any) => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })))
         console.log(acceptedFiles);
      }, [setFiles])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
      return (
        <div className={className}>
        <div {...getRootProps()} className={isDragActive ? `${dzStyles} ${dzActive}`: `hover:border-green-400 ${dzStyles}`}>
          <input {...getInputProps()} />
         
          <Upload className='h-20 w-20'/>
          <p className='font-bold text-xl'>Drop image here</p> 
              
          
        </div>
        </div>
      )
    }