import React from 'react'
import Nav3 from '../../components/navbar3'
import Sidebar2 from '../../components/Sidebar2'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import Raisecomplaint from './RaiseComplaint.jsx'
import Mycomplaint from './MyComplaint.jsx'
import Notifications from './Notifications.jsx'

const Resident = () => {
  return (
    <div>
      <Nav3 />

      <div className='flex'>
        <Sidebar2 />
        <div className='flex-1'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/raisecomplaint" element={<Raisecomplaint />} />
          <Route path="/mycomplaint" element={<Mycomplaint />} />
          <Route path="/notification" element={<Notifications />} />
        </Routes>
        </div>
      </div>
    </div>
  )
}

export default Resident