import { useSearchPosts } from '@/lib/react-query/queries&mutation'
import { Models } from 'appwrite';
import React from 'react'
import PostStats from './PostStats';
import { useAuthContext } from '@/context/AuthContext';

import { Link } from 'react-router-dom';
type SearchResultsProps = {
  post?: Models.Document[];
}
const SearchResults = ({post}:SearchResultsProps) => {
  const {user} = useAuthContext();
  if(post?.length === 0){
    return (
      <p className='w-full text-center'>{`No Results Found`} </p>
    )
  }
  return (
    <div className='max-w-5xl flex flex-row flex-wrap flex-1 gap-5 p:5 mt-10 w-full items-center justify-start'>
        
      {
        post?.map((item:any)=>{
            return (
                <div className='rounded-xl relative w-full max-w-[500px] aspect-square overflow-hidden shadow-md hover:shadow-xl transition-shadow'>

                    <Link to={`/post/${item.$id}`} key={item.$id}>
                    
                        <img src={item.imageUrl}alt="image" className='w-full h-full object-cover' />
                       
                        
                    
                    </Link>
                    <div className="absolute flex flex-row justify-between w-full p-5 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <img src={user.imageUrl} alt="" width={25} className='rounded-full object-cover aspect-square'/>
                    <PostStats post={item} usedIn='explore' showImage={false} userId={user.id}/>
                    </div>
                    </div>
            )
        })
      }
      </div>
  )
}

export default SearchResults
