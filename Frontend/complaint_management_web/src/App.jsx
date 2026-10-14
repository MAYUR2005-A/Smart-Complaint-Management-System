import React from 'react'
import Home from './Home/home.jsx'
import Reg from './assets/reg.png';
import Noti from './assets/noti.png';
import Track from './assets/track.png';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Resident from './Pages/Resident Dashboard/Resident.jsx';
import Admin from './Pages/Admin Dashboard/Admin.jsx';
import Complaint from './Pages/Resident Dashboard/RegisterComplaint.jsx'
const App = () => {
  const Content=[
   {
    logo:Reg,
    title:"Easy Registration",
    description:"Submit your complaint in just a few clicks with simple details."
   },
   {
    logo:Track,
    title:"Track Progress",
    description:"Stay updated with real-time status of your complaint."
   }
   ,
   {
    logo:Noti,
    title:"Get Notifications",
    description:"Receive updates and alerts directly in your account."
   }
  ]
  return (
    <div>
      <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home content={Content} />} />
        <Route path="/resident/*" element={<Resident/>} />
        <Route path="/complaint" element={<Complaint/>}/>
        <Route path="/admin/*" element={<Admin/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
