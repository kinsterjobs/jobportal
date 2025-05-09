
import React from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import ApplicationCard from '@/components/applications/ApplicationCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';

const ApplicationsPage = () => {
  const { applications, jobs } = useJobs();
  const { currentUser } = useAuth();
  
  // Filter applications for the current user
  const userApplications = applications.filter(app => app.userId === currentUser.id);
  
  // Group applications by status
  const groupedApplications = {
    pending: userApplications.filter(app => app.status === 'pending'),
    reviewing: userApplications.filter(app => app.status === 'reviewing'),
    accepted: userApplications.filter(app => app.status === 'accepted'),
    rejected: userApplications.filter(app => app.status === 'rejected'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Applications</h1>
            <p className="text-gray-600">
              Track the status of your job applications
            </p>
          </div>
          
          <Button asChild>
            <Link to="/jobs" className="flex items-center gap-2">
              <Search size={16} />
              Browse Jobs
            </Link>
          </Button>
        </div>
      </motion.div>
      
      {userApplications.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-white rounded-lg shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <FileText size={32} />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            You haven't applied to any jobs yet. Browse our job listings and submit your first application.
          </p>
          <Button asChild>
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedApplications).map(([status, apps]) => {
            if (apps.length === 0) return null;
            
            return (
              <motion.div 
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                  {status} Applications ({apps.length})
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {apps.map(application => (
                    <ApplicationCard 
                      key={application.id} 
                      application={application} 
                      showJobDetails={true} 
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
