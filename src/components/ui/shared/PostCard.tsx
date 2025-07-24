import { useAuthContext } from '@/context/AuthContext';
import { formatDateToRelative } from '@/lib/utils';
import { Models } from 'appwrite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
import { useState } from 'react';
import { useLikePost } from '@/lib/react-query/queries&mutation';
import { useNavigate } from 'react-router-dom';
type PostCardProps = {
    post: Models.Document;
}
const PostCard = ({post}:PostCardProps) => {
    const navigate = useNavigate();
    const {user} = useAuthContext();
//     const likesArray = post.likes.map((user:Models.Document)=>
//         user.$id
//       );
      
    
    
//       const [likes, setlikes] = useState(likesArray);
//       const {mutateAsync:likePost} = useLikePost();
      
    
  return (
    <div className='post-card'>
        <div className='flex-between'>
            <div className='flex gap-4 items-center justify-start'>
                <Link to={`/profile/${post.creator.$id}`}>
                    <img src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator" width={40} height={40} className='rounded-full object-cover aspect-square' loading='lazy' />
                </Link>
                <div className='flex flex-col  items-start'>
                    <p className='base-medium md:body-bold'>{post.creator.username}</p>
                    <p className='small-regular text-gray-500'>{formatDateToRelative(post.$createdAt)}</p>
                </div>
            </div>
            <div className='flex flex-row gap-4 items-center'>

            <Link to={`/update-post/${post.$id}`}>
            <img src="/assets/icons/edit.svg" alt="" className={`${post.creator.$id != user.id && "hidden"} w-[24px]`}/>
            </Link>
            <Link to={`/post/${post.$id}`}>
            <img src="/assets/icons/info.png" alt="" className={`w-[24px]`}/>
            </Link>
            </div>
        </div>
        
         <div className='flex flex-col gap-2 pt-10 md:pt-5'>
            <p className='base-regular'>{post.caption}</p>
            <p className='small-regular text-light-3'>{post.tags.map((tag:string)=>{
                return(`#${tag} `)
            })}</p>
        </div>
        
       <PostStats post = {post} userId = {user.id} usedIn='home' showImage={true}/>

    </div>
  )
}

export default PostCard
