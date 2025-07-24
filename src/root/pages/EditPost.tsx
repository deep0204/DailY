import React from 'react'
import PostForm from '../../components/forms/PostForm';
import { useParams } from 'react-router-dom';
import { useGetPostById } from '@/lib/react-query/queries&mutation';

const EditPost = () => {
  const {id} = useParams();
  const {data:post,isPending:isLoadingPost} = useGetPostById(id ||'');
  if(isLoadingPost || !post){
    return (
      <div className='flex items-center justify-center w-full'>
        <img src="/assets/icons/loader.svg" alt="" />
      </div>
    )
  }
  return (   
    <div className='flex flex-1'>
      <div className="common-container">
        <div className='flex-start items-center max-w-5xl w-full gap-3 '>
          <img src="/assets/icons/add-post.svg" alt="Create Post" width={36} height={36}/>
          <h2 className='h3-bold '>Edit Post</h2>
        </div>
        <PostForm action={'Update'} post={post} key={post.$id}/>
      </div>
    </div>
  )
}

export default EditPost
