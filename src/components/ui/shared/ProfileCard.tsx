import { Models } from 'appwrite'
import React from 'react'
import { Button } from '@/components/ui/button';
import { formatDateToRelative } from '@/lib/utils';
import { Link } from 'react-router-dom';
type ProfileCardProps = {
  user: Models.Document;
}
const ProfileCard = ({ user }: ProfileCardProps) => {
  return (

    <div className='flex-col gap-4 flex-1 border-none p-5 rounded-3xl flex items-center justify-center'>
      <div className='flex flex-col gap-2 justify-center items-center'>
        <img src={user.imageUrl} alt="" width={35} className='rounded-full aspect-square object-cover' />
        <h2 className='h3-bold'>{user.name}</h2>
        <p className='small-regular text-light-1'>@{user.username}</p>
        <p className='small-regular text-light-4'>Since {formatDateToRelative(user.$createdAt)}</p>

      </div>
      <Link to={`/profile/${user.$id}`} key={user.$id}>
        <Button className='shad-button_primary'>Go to Profile</Button>
      </Link>

    </div>
  )
}

export default ProfileCard
