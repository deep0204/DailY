import { useDeletePost, useGetPostById } from '@/lib/react-query/queries&mutation';
import React from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { formatDateToRelative } from '@/lib/utils';
import PostStats from '../../components/ui/shared/PostStats';
import { useGetCurrentUser } from '@/lib/react-query/queries&mutation';
import { Models } from 'appwrite';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
const PostDetails = () => {
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id)
  const { data: post, isPending: isLoadingPost } = useGetPostById(id || '');
  const { data: user, isPending: isLoadingUser } = useGetCurrentUser();
  const deleteCurrPost = async () => {
    if (post) {
      await deletePost({ postId: post.$id, imageId: post.imageId });
      navigate('/');
    }
    else{
      toast.error("Error Deleting Post");
    }
  }
  if (isLoadingPost || isLoadingUser) {
    return (
      <div className='flex flex-col items-center justify-center w-full'>
        <img src="/assets/icons/loader.svg" alt="" />
      </div>
    )
  }
  return (
    <div className='post_details-container'>
      <div className='post_details-card relative'>
        <img src={post?.imageUrl} alt="" className='post_details-img' draggable={false} onContextMenu={(e) => e.preventDefault()} />
        <div className='flex flex-col w-full justify-between'>
          <div className='post_details-info'>

          <div className='flex flex-row justify-between w-full items-center'>
            <div className='flex gap-4 items-center justify-start'>
              <Link to={`/profile/${post?.creator.$id}`}>
                <img src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator" width={40} height={40} className='rounded-full object-cover aspect-square' />
              </Link>
              <div className='flex flex-col  items-start'>
                <p className='base-medium md:body-bold'>{post?.creator.username}</p>
                <p className='small-regular text-gray-500'>{formatDateToRelative(post?.$createdAt || '')}</p>
              </div>
            </div>
            <div className='flex flex-row gap-4 items-center'>
              <Link to={`/update-post/${post?.$id}`}>
                <img src="/assets/icons/edit.svg" alt="" className={`${post?.creator.$id != user?.$id && "hidden"} w-[24px]`} />
              </Link>
              <Dialog>
                <DialogTrigger><img src={isDeletingPost?"/assets/icons/loader.svg":"/assets/icons/delete.svg"} alt="" width={25} className={`${post?.creator.$id != user?.$id && "hidden"} w-[24px]`}/></DialogTrigger>
                <DialogContent >
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your post.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button type="submit" onClick={deleteCurrPost} className='shad-button_primary'>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <hr className='border w-full border-dark-4/80'/>

          <p>{post?.caption}</p>
          <p className='small-regular text-light-3'>{post?.tags.map((tag: string) => {
            return (`#${tag} `)
          })}</p>

        </div>
        <div className='p-6'>
          <PostStats post={post} userId={user?.$id || ''} usedIn='details' showImage={false}/>
        </div>
        </div>
      </div>

    </div>
  )
}

export default PostDetails
