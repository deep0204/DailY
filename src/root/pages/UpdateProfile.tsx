
import React from 'react'
import  ProfileForm  from '@/components/forms/ProfileForm';
import { useParams } from 'react-router-dom';
import { getUserById } from '@/lib/appwrite/api';
import { useGetUserById } from '@/lib/react-query/queries&mutation';

const UpdateProfile = () => {
  const {id} = useParams();
  const {data:user} =  useGetUserById(id||'');
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='flex flex-row gap-4 w-full  max-w-5xl items-start justify-start '>
            <img src="/assets/icons/edit.svg" alt="" width={30} />
            <p className='h3-bold'>Update Your Profile</p>
          </div>
        <div className='flex flex-col gap-4 items-start'>
          
          <ProfileForm user={user}/>
        </div>
      </div>
      
    </div>
  )
}

export default UpdateProfile
