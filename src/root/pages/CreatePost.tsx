import React from 'react'
import PostForm from '../../components/forms/PostForm';
import ProfileForm from '@/components/forms/ProfileForm';


const CreatePost = () => {
  return (
    <div className='flex flex-1'>
      <div className="common-container">
        <div className='flex-start items-center max-w-5xl w-full gap-3 '>
          <img src="/assets/icons/add-post.svg" alt="Create Post" width={36} height={36}/>
          <h2 className='h3-bold '>Create Post</h2>
        </div>
        <PostForm action={'Create'}/>
      </div>
    </div>
  )
}

export default CreatePost
