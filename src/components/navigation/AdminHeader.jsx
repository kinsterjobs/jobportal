
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeader = () => {
  const { currentUser } = useAuth();

  return (
    <motion.header 
      className="bg-white shadow-sm z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center md:hidden">
              <Menu className="h-6 w-6 text-gray-500" />
            </div>
            {/* Removed md:ml-6 to allow "Admin Dashboard" to be closer to the left edge when sidebar is present */}
            <div className="hidden md:flex md:items-center"> 
              <div className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>

            <div className="ml-3 relative flex items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {currentUser?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;
