import React, { useContext, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useSignOutAccount } from '@/lib/react-query/queries&mutation'
import { useAuthContext } from '@/context/AuthContext'
import { sidebarLinks } from '../../../constants/index';
import { INavLink } from '@/types';

const LeftSideBar = () => {
  const { user } = useAuthContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    } else {
      console.log("Sign out failed, please try again later");
    }
  }, [isSuccess])
  return (
    <div className='leftsidebar'>
      <div className='flex flex-col gap-8'>
        <Link to="/">
          <img src="/assets/images/logo1.png" alt="" width={100}/>
        </Link>
        <Link to={`/profile/${user.id}`} className='flex flex-row items-center gap-2'>
          <img src={user.imageUrl} alt="" height={50} width={50} className='rounded-full object-cover aspect-square' />
          <div className='flex flex-col'>
            <p className='body-medium'>{user.name}</p>
            <p className='small-regular text-gray-400'>@{user.username}</p>
          </div>
        </Link>
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li className={`leftsidebar-link px-2 py-2 group ${isActive ? 'bg-primary-500' : ""}`} key={link.label}>
                <NavLink to={link.route} key={link.label}>
                  <div className='flex flex-row items-center gap-2'>
                    <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive ? 'invert-white' : ""}`} />
                    <p className='body-regular'>{link.label}</p>
                  </div>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <div className='flex'>
        <Button onClick={() => signOut()}>
          <img src="/assets/icons/logout.svg" alt="logout" className='mr-2' />
          <p className='small-regular text-gray-300'>Log-out</p>
        </Button>
        
      </div>
    </div>
  )
}

export default LeftSideBar
