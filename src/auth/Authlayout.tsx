import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'


const Authlayout = () => {
  const isAuth = false;

  return (
    <>
    
    {isAuth?(<Navigate to="/"/>):(
      <section className='flex flex-1 items-center justify-center flex-col py-10'>
        <Outlet/>
      </section>
    )}
    <img src="/assets/images/side-img.png" alt="sideimage" className=' hidden md:block w-1/2 h-screen object-cover bg-no-repeat'/>

    </>
  )
}

export default Authlayout
