import { useState } from 'react'

import './globals.css'
import { Navigate, Outlet, Router } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Signinform from './auth/forms/Signinform'
import Authlayout from './auth/Authlayout';
import RootLayout from './root/RootLayout'
import {Home , Explore, Saved, AllUsers, CreatePost, EditPost, PostDetails, Profile, UpdateProfile} from './root/pages'
import MockAgent from '../node_modules/undici-types/mock-agent.d';
import Signupform from './auth/forms/Signupform'
import { Toaster } from "@/components/ui/sonner"


function App() {


  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public  */}
        <Route element={<Authlayout />} >
          <Route path='/sign-in' element={<Signinform />}></Route>
          <Route path='/sign-up' element={<Signupform />}></Route>
        </Route>
        
        {/* private  */}
        <Route element={<RootLayout/>}>
          <Route index element={<Home/>}/>
          <Route path='/explore' element={<Explore/>}/>
          <Route path='/saved' element={<Saved/>}/>
          <Route path='/all-users' element={<AllUsers/>}/>
          <Route path='/create-post' element={<CreatePost/>}/>
          <Route path='/update-post/:id' element={<EditPost/>}/>
          <Route path='/post/:id' element={<PostDetails/>}/>
          <Route path='/profile/:id/*' element={<Profile/>}/>
          <Route path='/update-profile/:id' element={<UpdateProfile/>}/>

        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App
