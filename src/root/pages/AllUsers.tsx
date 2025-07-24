import ProfileCard from '@/components/ui/shared/ProfileCard';
import { useGetAllUsers } from '@/lib/react-query/queries&mutation';
import { Models } from 'appwrite';
import React from 'react'
import { Link } from 'react-router-dom';

const AllUsers = () => {
  const {data:users,isPending} = useGetAllUsers();
  console.log(users);
  return (
    <div className='flex flex-1'>
    <div className="common-container">
      <div className=' flex flex-col items-start max-w-5xl w-full gap-10 '>
        <div className='flex flex-row gap-5 justify-start'>
          <img src="/assets/icons/people.svg" alt="" width={35} />
          <h2 className='h3-bold'>All Users</h2>
        </div>
      
    
      <div className="user-grid">
        {users?.documents.map((user)=>{
        return(
          
          <ProfileCard user={user}/>

        )
      })}
      
      
    </div>
    </div>
    </div>
    </div>
  )
}

export default AllUsers
