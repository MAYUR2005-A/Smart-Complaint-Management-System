import React from 'react'
import Reg from '../assets/reg.png'
const Card = (props) => {
  return (
    <div>
       <div className='m-8 bg-[#e9efff] w-[85%] rounded-2xl shadow-black shadow-2xl'>
       <div className='flex flex-row justify-between items-center gap-10 p-10'>
        <div className='bg-[#b3caff] p-5 rounded-full'>
        <img src={props.logo} alt="" width={70} height={70}/>
        </div>
         <div>
            <h3 className='font-bold text-2xl pb-3'>{props.title}</h3>
            <p className='w-fit'>{props.description}</p>
        </div>
        </div> 
      </div>
    </div>
  )
}

export default Card
