import React, { useEffect, useState } from 'react'
import { ImageGravity, Models } from 'appwrite';
import { useDeleteSavedPost, useGetCurrentUser, useGetUserById, useLikePost, useSavePost } from '@/lib/react-query/queries&mutation';
import { getCurrentUser, getUserById } from '@/lib/appwrite/api';
import { checkIsLiked } from '@/lib/utils';
import { Loader } from 'lucide-react';
type PostStatsProps = {
    post?: Models.Document,
    userId:string,
    showImage:boolean,
    usedIn:string
}
const PostStats = ({post,userId,usedIn,showImage}:PostStatsProps) => {
  const likesArray = post?.likes.map((user:Models.Document)=>
    user.$id
  );
 
  
  const [likes, setlikes] = useState(likesArray);
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setisProcessing] = useState(false)
  const {mutateAsync:likePost} = useLikePost();
  const {mutateAsync:savePost,isPending:isSavingPost} = useSavePost();
  const {mutateAsync:deleteSavePost,isPending:isDeletingSaved} = useDeleteSavedPost();
  const {data:currentUser,isPending:isGettingUser} = useGetUserById(userId)
  console.log(currentUser)
  
  const savedPostRecord = currentUser?.save.find((record:Models.Document)=>
      record?.post?.$id === post?.$id
    )
  useEffect(() => {
    setIsSaved(!!savedPostRecord)  
  }, [currentUser]);
  const [showHeart, setShowHeart] = useState(false);
  
  const triggerHeart = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };
  const handleLikeOnDoubleClick = async (e:React.MouseEvent)=>{
          e.stopPropagation();
          triggerHeart();
          let newLikes = [...likes];
          const hasLiked = newLikes.includes(currentUser?.$id)
          if(!hasLiked){
            newLikes.push(currentUser?.$id);
            setlikes(newLikes);
            await likePost({postId:post?.$id||'',likesArray:newLikes}); 
          }
        }
  const handleLike = async (e:React.MouseEvent)=>{
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId)
    if(hasLiked){
      newLikes = newLikes.filter((id)=> id!==userId);
    }else{
      newLikes.push(userId);
    }
    setlikes(newLikes);
    
    await likePost({postId:post?.$id||'',likesArray:newLikes}); 
    
  }
  const handleSave = async (e:React.MouseEvent)=>{
    e.stopPropagation();
    // if(isProcessing) return;
    setisProcessing(true);
    try {
      if(savedPostRecord){
      await deleteSavePost({savedRecord:savedPostRecord.$id});
      setIsSaved(false);
    }else{
      await savePost({postId:post?.$id||'',userId:userId})
      setIsSaved(true);
    }
    } catch (error) {
      console.log(error)
    }finally{
      setisProcessing(false)
    }
    
  }
  if(isGettingUser){
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <img src="/assets/icons/loader.svg" alt="" />
      </div>
    )
  }
  return (
    <div className="flex-flex-col">
      
        <div className={`${!showImage && "hidden"} py-5 md:py-10 relative`}>
                  {
                      showHeart&& <img src="/assets/icons/popHeart.png" alt="" className="absolute inset-0 m-auto w-20 h-20 opacity-80 animate-slowHeart z-50"/>
                  }
                  
                  <img src={post?.imageUrl||''} alt=""  onDoubleClick={handleLikeOnDoubleClick} onContextMenu={(e) => e.preventDefault()} draggable={false} className='rounded-lg'/>
              </div>
      
    <div className='flex justify-between items-center gap-2'>
      <div className="flex gap-2">
        <img src={`/assets/icons/${checkIsLiked(likes,userId)?'liked':'like'}.svg`} alt="like" width={22} height={22} className='cursor-pointer' onClick={handleLike} />
        <div className={`${usedIn!="home"&&"hidden"}`}>{likes.length} <span className='small-regular'>{likes.length==1?'like':'likes'}</span></div>
      </div>
      <div className="flex gap-2">
        {
        isProcessing || isSavingPost || isDeletingSaved?(<img src='/assets/icons/loader.svg' width={25}/>):(<img src={`/assets/icons/${isSaved?'saved':'save'}.svg`} alt="like" width={22} height={22} className='cursor-pointer' onClick={handleSave}  />)  
        }
        
        </div>
      </div>
    </div>
  )
}

export default PostStats
