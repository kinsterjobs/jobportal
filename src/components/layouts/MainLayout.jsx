
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { motion } from 'framer-motion';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default MainLayout;
