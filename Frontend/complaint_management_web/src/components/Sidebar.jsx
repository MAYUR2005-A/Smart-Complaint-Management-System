import { useClerk } from '@clerk/react'
import { Bell, House, LogOut, NotepadText } from 'lucide-react'
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
            onClick={() => navigate("/admin")}
            className="relative p-5 text-white flex justify-center items-center gap-4 rounded cursor-pointer hover:bg-blue-900 transition-colors duration-200"
          >
            {location.pathname === "/admin" && (
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
            onClick={() => navigate("/admin/complaints")}
            className="relative p-5 text-white flex justify-center items-center gap-4 rounded cursor-pointer hover:bg-blue-900 transition-colors duration-200"
          >
            {location.pathname === "/admin/complaints" && (
              <motion.div
                layoutId="activebg"
                className="absolute inset-0 bg-blue-500 rounded"
                transition={{ duration: 0.3 }}
              />
            )}

            <NotepadText className="relative z-10" />
            <span className="relative z-10">Complaints</span>
          </button>

          <button
            onClick={() => navigate("/admin/notifications")}
            className="relative p-5 text-white flex justify-center items-center gap-4 rounded cursor-pointer hover:bg-blue-900 transition-colors duration-200"
          >
            {location.pathname === "/admin/notifications" && (
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

