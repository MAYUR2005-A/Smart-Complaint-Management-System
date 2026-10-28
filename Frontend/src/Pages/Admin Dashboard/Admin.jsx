import React from 'react'
import Navbar2 from '../../components/navbar2.jsx'
import Sidebar from '../../components/Sidebar.jsx'
import Dashboard from './Dashboard.jsx'
import Notifications from './Notifications.jsx'
import Complaints from './Complaint.jsx'
import { Routes, Route } from 'react-router-dom'

const Admin = () => {
  return (
    <div>
      <Navbar2 />

      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Admin