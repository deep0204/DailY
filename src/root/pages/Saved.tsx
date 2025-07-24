import React from 'react'
import { useGetCurrentUser, useGetRecentPosts } from '@/lib/react-query/queries&mutation'
import { Models } from 'appwrite';
import { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import PostCard from '@/components/ui/shared/PostCard';
import { QueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/react-query/queryKeys';
import { useLocation } from 'react-router-dom';


const Saved = () => {

const {user} = useAuthContext();
const {data:currentUser} = useGetCurrentUser();
  const {data:posts,isPending:isGettingPosts,isError:isGettingPostsError,refetch} = useGetRecentPosts();
  return (
    <div className='flex flex-1'>
      <div className="home-container">
        <div className='home-posts'>
          <div className='h3-bold md:h2-bold text-left w-full'>Saved Posts</div>
          {isGettingPosts?(
            <img src="/assets/icons/loader.svg" alt="" />
          ):(
            <ul className='flex flex-col w-full gap-9 flex-1'>
              {posts?.documents.map((post:Models.Document)=>{
                return(
                  currentUser?.save.find((record:Models.Document)=>
                        record?.post?.$id === post.$id
                      ) &&
                  <li key={post.$id}>
                    <PostCard post={post}/>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      
    </div>
  )
}

export default Saved
