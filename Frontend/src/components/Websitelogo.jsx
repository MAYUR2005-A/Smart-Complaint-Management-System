import React from 'react'
import Img from '../assets/homelogo.png'
const Websitelogo = () => {
  return (
    <div>
    <div>
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
    </div>
    </div>
  )
}

export default Websitelogo
