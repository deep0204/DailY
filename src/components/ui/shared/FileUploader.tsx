import React, { use } from 'react'
import  {useCallback} from 'react'
import {useDropzone,FileWithPath} from 'react-dropzone'
import { useState} from 'react'
import { Divide } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import { useCreatePost } from '@/lib/react-query/queries&mutation'
import { useAuthContext } from '@/context/AuthContext'
import { urlToHttpOptions } from 'url'
type FileUploaderProps = {
  fieldChange : (FILES:File[])=>void;
  mediaUrl?:string;
}
const FileUploader = ({fieldChange, mediaUrl}:FileUploaderProps) => {
  
  const [fileUrl , setFileUrl] = useState(mediaUrl);
  const [file,setFile] = useState<File[]>();
  const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
  }, [fieldChange])
  const {getRootProps, getInputProps,} = useDropzone({onDrop,accept:{'image/*':['.png','.jpg','.jpeg','.svg']}});
  
  return (
    <div {...getRootProps()} className='flex flex-col bg-dark-3 rounded-xl gap-4 cursor-pointer '>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileUrl ?
          ( 
            <>
            <div className='flex flex-1 w-full max-w-5xl p-5 lg:p-10 justify-center'>
              <img src={fileUrl} alt="" className='file_uploader-img'/>
            </div>
            <p className='file_uploader-label'>Click or Drag to replace</p>
            </>
          ):
          (
            <div className='file_uploader-box gap-4 w-full max-w-5xl'>
                <img src="/assets/icons/file-upload.svg" alt="Upload File" width={70} height={70} />
               <h3 className='base-medium'>Drag Your files here</h3>
               <p className='small-regular text-gray-300'> SVG, JPG or PNG</p>
               <Button className='shad-button_dark_4'>Select From Computer</Button>
            </div>
          )
      }
    </div>
  )
}

export default FileUploader
