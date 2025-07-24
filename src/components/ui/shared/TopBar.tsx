import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Button} from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useSignOutAccount } from '@/lib/react-query/queries&mutation'
import { useAuthContext } from '@/context/AuthContext'

const TopBar = () => {
  const {user} = useAuthContext();
  const {mutate:signOut, isSuccess} = useSignOutAccount();
  const navigate = useNavigate();
    useEffect(() => {
      if (isSuccess) {
        navigate(0);
      }else{
        console.log("Sign out failed, please try again later");
      }
    }, [isSuccess])
  return (
    
    <section className='topbar flex-between px-5 py-4'>
      <Link to="/"><img src="/assets/images/logo1.png" alt="profileImage" height={40} width={100} /></Link>
      <div className='flex flex-row items-center'>
        <Button onClick={()=>signOut()}>
          <img src="/assets/icons/logout.svg" alt="logout" className='mr-2' />
          
        </Button>
        <Link to={`/profile/${user.id}`}>
         <img src={user.imageUrl} alt="" height={30} width={30} className='rounded-full'/>
         </Link>
      </div>
    </section>
  )
  
}

export default TopBar
