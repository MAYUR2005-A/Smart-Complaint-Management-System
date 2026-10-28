import React from 'react'
import Nav from './navbar'
import { UserButton, useUser } from '@clerk/react'
import Logo from './Websitelogo.jsx'
import NotificationBell from './notification2.jsx'
const navbar2 = () => {
    const {user}=useUser();
  return (
    <div className='border-1 border-gray-300'>
      <div className='flex flex-row justify-between items-center mr-10 '>
      <Logo/>
      <div className='flex flex-row justify-center items-center gap-20'>
      <NotificationBell/>
      <div className='flex flex-rows justify-center items-center gap-1'>
      <UserButton appearance={
        {
            elements:{
                avatarBox:{
                    width:"40px",
                    height:"40px",
                },
            },
        }
      }/>
      <div>
     <p className='text-[15px] font-semibold'>{user.fullName}</p>
     <p className='text-[13px] text-gray-600'>Resident</p>
     </div>
      </div>
      </div>
      </div>
    </div>
  )
}

export default navbar2
