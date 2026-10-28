import React from 'react'
import Home from '../assets/homelogo.png'
import {Mail} from 'lucide-react';
import {Phone} from 'lucide-react';
const Footer = () => {
  return (
    <div className='bg-gray-800 py-5'id="Contact">
      <div className='flex flex-row justify-evenly items-center gap-10'>
      <div>
         <div className='flex flex-rows justify-left items-center'>
          <div>
             <img src={Home} alt="" width={70} height={70}/>
            </div>
            <h1 className='font-bold text-2xl text-white'>Smart<span className='text-[#4f46e5]'>Complaint</span></h1>
         </div>
        <div className='ml-5'>
           <p className=' pb-5 text-white w-[70%]'>Making society complaint management simple and easy.</p>
        </div>
        </div>
        <div className='flex flex-col justify-center items-left gap-1'>
          <h2 className='font-semibold text-[18px] pr-10 text-white' >Contact Us</h2>
          <div className='flex flex-row justify-left items-center gap-2'>
            <Mail size={16} color="#0040ff" strokeWidth={2} />
            <div>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@smartcomplaint.com" className='text-white'>support@smartcomplaint.com</a>
            </div>
          </div>
          <div className='flex flex-row justify-left items-center gap-2'>
            <Phone size={16} color="#0040ff" strokeWidth={2} />
            <div>
              <p className='text-white'>+91 9011109101</p>
            </div>
          </div>
        </div>
        </div>
        <hr className='py-4 text-gray-400'/>
        <p className='text-center pb-5 text-gray-300'><span style={{padding:"5px"}}>&copy;</span>2026 SmartComplaintManagementSystem</p>
    </div>
  )
}

export default Footer
