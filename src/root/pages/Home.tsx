import React from 'react'
import { useGetRecentPosts } from '@/lib/react-query/queries&mutation'
import { Models } from 'appwrite';
import PostCard from '@/components/ui/shared/PostCard';
import { useAuthContext } from '@/context/AuthContext';
const Home = () => {
  const {user} = useAuthContext();
  const {data:posts,isPending:isGettingPosts,isError:isGettingPostsError} = useGetRecentPosts();
  if(isGettingPosts){
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <img src="/assets/icons/loader.svg" alt="" />
      </div>
    )
  }
  return (
    <div className='flex flex-1'>
      <div className="home-container">
        <div className='home-posts'>
          <div className='h3-bold md:h2-bold text-left w-full'> Your Feed</div>
          <ul className='flex flex-col w-full gap-9 flex-1'>
              {posts?.documents.map((post:Models.Document)=>{
                return(
                  <li key={post.$id}>
                    <PostCard post={post}/>
                  </li>
                )
              })}
            </ul>
        </div>
      </div>
      
    </div>
  )
}

export default Home
