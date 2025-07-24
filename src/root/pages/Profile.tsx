import React from 'react'
import { useAuthContext } from '../../context/AuthContext';
import { QueryKeys } from '@/lib/react-query/queryKeys';
import { useGetUserById, useGetUserPosts } from '@/lib/react-query/queries&mutation';
import { useParams } from 'react-router-dom';
import { Models } from 'appwrite';
import GridPosts from '@/components/ui/shared/GridPosts';
import { Button } from '@/components/ui/button';
import LikedPosts from './LikedPosts';
import { useState } from 'react';
import { Grid } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const {id} = useParams();
  const {data:user,isPending:isLoadingUser} = useGetUserById(id||'');
  const {data:posts,isPending:isGettingPosts} = useGetUserPosts(id||'')
  if(posts)console.log(posts)
    console.log(user?.liked)
  const [activeTab, setActiveTab] = useState<'posts'|'liked'>('posts')
  if(isGettingPosts||isLoadingUser){
    return (
      <div className='w-full flex justify-center'>
        <img src="/assets/icons/loader.svg" alt=""  width={30}/>
      </div>
    )
  }
  return (
    <div className='flex flex-1 justify-center'>
      <div className='common-container'>
        <div className='flex flex-col md:justify-between md:items-center w-full max-w-5xl md:flex-row items-start'>
            <div className='flex flex-row gap-5 w-full justify-start items-center'>
          <img src={user?.imageUrl} alt="" className='rounded-full mb-5 w-[100px] md:w-[150px] lg:w-[200px] object-cover aspect-square'/>
          <div className='flex flex-col items-start flex-1 gap-1'>
            <div className='flex flex-row gap-4'>
            <div
          className='flex flex-col justify-start gap-1'>
          <p className='h3-bold w-full text-start'>{user?.name}</p>
          <p className='base-regular w-full text-left text-light-3'>@{user?.username}</p>
          </div>
          <p className='text-5xl font-extralight'>|</p>
          <div>
            <p className='h3-bold'>{posts?.total}</p>
            <p className='base-regular text-light-3'>Posts</p>
          </div>
          </div>
          <div>
            <p>{user?.bio||"No bio yet"}</p>
          </div>
          </div>

      </div>
      <div>
        <Link to={`/update-profile/${user?.$id}`} >
      <Button className='flex flex-row shad-button_dark_4'>
      <img src="/assets/icons/edit.svg" alt="" width={25} />
      <p className='hidden lg:block'>Edit Profile</p> 
      </Button>
      </Link> 
      </div>
        </div>
      <hr className='border w-full border-dark-4/80'/>
      <div className='flex flex-row gap-2 w-full justify-start items-center max-w-5xl'>
        <Button className={`${activeTab=='posts'?"shad-button_primary":'shad-button_dark_4'}` } onClick={()=>{
          setActiveTab('posts')
        }}>Posts</Button>
        <Button className={`${activeTab=='liked'?"shad-button_primary":'shad-button_dark_4'}`} onClick={()=>{
          setActiveTab('liked')
        }}>Likes</Button>
      </div>
        <div className='w-full max-w-5xl flex justify-start'>
      {
        activeTab==='liked'?(
          <GridPosts post={user?.liked} showStats={false}/>
        ):
        (
          <GridPosts post={posts?.documents} showStats={false}/>
        )
      }
      </div>
      </div>
    </div>
  )
}

export default Profile

{  }



      // 

      

      