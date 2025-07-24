import React from 'react'
import { useLocation } from 'react-router-dom';
import { bottombarLinks } from '@/constants';
import { INavLink } from '@/types';
import { NavLink } from 'react-router-dom';
const BottomBar = () => {
  const pathname=useLocation();
  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link:INavLink)=>{
        const isActive = pathname.pathname === link.route;
        return(
                <NavLink to={link.route} key={link.label} className={` px-2 py-2 group ${isActive ? 'bg-primary-500 rounded-lg' : ""} transition`}>
                  <div className='flex flex-col items-center gap-2'>
                    <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive ? 'invert-white' : ""} w-5 h-5`} />
                    <p className='tiny-medium'>{link.label}</p>
                  </div>
                </NavLink>   
                
        )
      })}
    </section>
  )
}

export default BottomBar
