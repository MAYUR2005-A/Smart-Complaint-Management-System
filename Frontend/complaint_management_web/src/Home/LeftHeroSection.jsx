import React, { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Siren } from 'lucide-react'
import { MoveRight } from 'lucide-react'
import User4 from './user4'
import { SignIn } from '@clerk/react'
const LeftHeroSection = () => {
  const [loggedin, setloggedin] = useState(false)
  const login = () => {
    setloggedin(true)
  }

  const closeLogin = () => {
    setloggedin(false)
  }

  return (
    <div>
      <div className='mt-30 ml-10'>
        <div className='flex mx-3 my-1 justify-left items-center bg-[#e2ebff] w-fit px-2 py-1 rounded-4xl'>
          <ShieldCheck size={16} />
          <h3 className='text-[14px] px-1'>
            Society Complaint Management
          </h3>
        </div>

        <div className='mx-3'>
          <h1 style={{ fontSize: "70px", fontFamily: "" }}>
            <b>Report. Track.</b>
          </h1>

          <h1 style={{ fontSize: "70px", color: "#4f46e5", marginBottom: "10px" }}>
            <b>Resolve.</b>
          </h1>

          <p className='w-[50%] py-2 px-0.5'>
            A smarter way to manage your housing society complaints. Register complaints easily and track their progress — all in one place.
          </p>
        </div>

        <div className='flex flex-row items-center px-2 py-3 mt-3'>
          <div>
            <button className='text-sm cursor-pointer flex flex-row justify-center items-center bg-indigo-500 text-white py-3 px-4 rounded-4xl w-fit mr-7 transition-all duration-150 hover:bg-black hover:text-white' onClick={login}>
              <Siren size={20} className='mr-4' />
               Get Started
              <MoveRight size={20} className='ml-4' />
            </button>
          </div>
        </div>

        {loggedin && (
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
      </div>
    </div>
  )
}

export default LeftHeroSection