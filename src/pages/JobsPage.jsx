
import React from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '@/contexts/JobContext';
import JobList from '@/components/jobs/JobList';
import { Briefcase } from 'lucide-react';

const JobsPage = () => {
  const { jobs } = useJobs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Briefcase size={32} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse All Jobs</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the perfect opportunity from our curated list of job openings
        </p>
      </motion.div>
      
      <JobList jobs={jobs} />
    </div>
  );
};

export default JobsPage;
