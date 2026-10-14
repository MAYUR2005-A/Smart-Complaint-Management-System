import React, { useState,useEffect } from 'react'
import Img from '../assets/homelogo.png'
import { SignIn, SignUp } from '@clerk/react'
import {useNavigate} from 'react-router-dom'
import { useUser } from '@clerk/react'
const navbar = () => {
  const {user,isSignedIn}=useUser();
  const navigate=useNavigate();
  const [loggedIn, setloggedIn] = useState(false)
  const [registered, setRegistered] = useState(false)
    useEffect(() => {
    if (isSignedIn && user) {
      if (user?.publicMetadata?.role === 'Admin') {
        navigate('/admin')
      } else {
        navigate('/resident')
      }
    }
  }, [isSignedIn, user, navigate])
  const login = () => {
    setloggedIn(true)
  }

  const closeLogin = () => {
    setloggedIn(false)
  }

  const register = () => {
    setRegistered(true)
  }

  const closeRegister = () => {
    setRegistered(false)
  }

  return (
    <div>
      <nav className='flex items-center justify-between fixed bg-white gap-50 w-full'>
        <div className='flex flex-row items-center'>
          <img src={Img} alt="" width={80} height={80} />

          <div>
            <h1 style={{ fontSize: "15px", fontWeight: "bold" }}>
              Smart<span className='text-[#4f46e5]'>Complaint</span>
            </h1>
            <h3 style={{ fontSize: "11px" }}>
              Better Homes. Happier Communities
            </h3>
          </div>
        </div>

        <div className='flex justify-between gap-20'>
          <a href="#Home" className="relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full">
            Home
          </a>

          <a href="#Features" className="relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
            Features
          </a>

          <a href="#Working" className="relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
            How it Works
          </a>

          <a href="#Contact" className="relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
            Contact
          </a>
        </div>

        <div className='flex justify-between gap-6 mr-10'>
          <button
            className='bg-white border px-8 py-3 border-indigo-500 rounded-4xl hover:cursor-pointer transition-all duration-150 hover:bg-black hover:text-white'
            onClick={login}
          >
            Login
          </button>

          <button
            className='bg-indigo-500 border px-8 py-3 rounded-4xl text-white hover:cursor-pointer transition-all duration-150 hover:bg-black hover:text-white'
            onClick={register}
          >
            Register
          </button>
        </div>
      </nav>

      {loggedIn && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40'>
          <div className='relative'>
            <button
              onClick={closeLogin}
              className='absolute right-5 top-3 z-1 text-gray-500 hover:text-black text-xl font-bold hover:cursor-pointer'
            >
              ✕
            </button>

            <SignIn />
          </div>
        </div>
      )}

      {registered && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40'>
          <div className='relative'>
            <button
              onClick={closeRegister}
              className='absolute right-5 top-3 z-1 text-gray-500 hover:text-black text-xl font-bold hover:cursor-pointer'
            >
              ✕
            </button>

            <SignUp />
          </div>
        </div>
      )}
    </div>
  )
}

export default navbar