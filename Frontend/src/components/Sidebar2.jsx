import { useClerk } from '@clerk/react'
import { Bell, ClipboardList, FilePlus, House, LogOut } from 'lucide-react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useClerk()

  return (
    <div className="bg-blue-950 w-[300px] min-h-screen">
      <div className="flex flex-col h-full p-2">

        <div className="flex flex-col items-stretch p-10 gap-5">

          <button
            onClick={() => navigate("/resident")}
            className="relative p-5 text-white flex justify-start items-center gap-4 rounded cursor-pointer hover:bg-blue-900 transition-colors duration-200"
          >
            {location.pathname === "/resident" && (
              <motion.div
                layoutId="activebg"
                className="absolute inset-0 bg-blue-500 rounded"
                transition={{ duration: 0.3 }}
              />
            )}

            <House className="relative z-10" />
            <span className="relative z-10">Dashboard</span>
          </button>

          <button
            onClick={() => navigate("/resident/raisecomplaint")}
            className="relative p-5 text-white flex justify-start items-center gap-4 rounded cursor-pointer hover:bg-blue-900 transition-colors duration-200"
          >
            {location.pathname === "/resident/raisecomplaint" && (
              <motion.div
                layoutId="activebg"
                className="absolute inset-0 bg-blue-500 rounded"
                transition={{ duration: 0.3 }}
              />
            )}

            <FilePlus className="relative z-10" />
            <span className="relative z-10">Raise Complaint</span>
          </button>

          <button
            onClick={() => navigate("/resident/mycomplaint")}
            className="relative p-5 text-white flex justify-start items-center gap-4 rounded cursor-pointer hover:bg-blue-900 transition-colors duration-200"
          >
            {location.pathname === "/resident/mycomplaint" && (
              <motion.div
                layoutId="activebg"
                className="absolute inset-0 bg-blue-500 rounded"
                transition={{ duration: 0.3 }}
              />
            )}

            <ClipboardList className="relative z-10" />
            <span className="relative z-10">My Complaints</span>
          </button>

          <button
            onClick={() => navigate("/resident/notification")}
            className="relative p-5 text-white flex justify-start items-center gap-4 rounded cursor-pointer hover:bg-blue-900 transition-colors duration-200"
          >
            {location.pathname === "/resident/notification" && (
              <motion.div
                layoutId="activebg"
                className="absolute inset-0 bg-blue-500 rounded"
                transition={{ duration: 0.3 }}
              />
            )}

            <Bell className="relative z-10" />
            <span className="relative z-10">Notifications</span>
          </button>

        </div>

        <div className="mt-auto border-t border-gray-400">
          <button
            className="w-full text-white flex items-center p-5 gap-2 cursor-pointer hover:bg-red-600 rounded transition-colors duration-200"
            onClick={() => signOut()}
          >
            <LogOut />
            Logout
          </button>
        </div>

      </div>
    </div>
  )
}

export default Sidebar

