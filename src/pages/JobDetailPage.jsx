
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ApplicationForm from '@/components/applications/ApplicationForm';
import { formatDate } from '@/lib/date';
import { Briefcase, MapPin, Clock, DollarSign, Calendar, ArrowLeft, CheckCircle } from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJob, applications } = useJobs();
  const { currentUser } = useAuth();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  
  const job = getJob(id);
  
  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }
  
  // Check if user has already applied
  const hasApplied = currentUser && applications.some(
    app => app.jobId === id && app.userId === currentUser.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/jobs')} 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-xl text-primary font-medium mb-4">{job.company}</p>
                
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Posted on {formatDate(job.postedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Briefcase size={32} />
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line mb-6">{job.description}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Apply for this position</h2>
            
            {hasApplied ? (
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Application Submitted</h3>
                <p className="text-gray-600 mb-6">
                  You have already applied for this position. You can view your application status in your dashboard.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/applications')}
                  className="w-full"
                >
                  View Your Applications
                </Button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Submit your application now and take the first step towards your new career opportunity.
                </p>
                <Button 
                  onClick={() => setIsApplyDialogOpen(true)}
                  className="w-full"
                >
                  Apply Now
                </Button>
              </>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Title:</span>
                  <span className="font-medium">{job.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type:</span>
                  <span className="font-medium">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary:</span>
                  <span className="font-medium">{job.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted Date:</span>
                  <span className="font-medium">{formatDate(job.postedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
          </DialogHeader>
          <ApplicationForm 
            jobId={job.id} 
            onSuccess={() => {
              setIsApplyDialogOpen(false);
              navigate('/applications');
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetailPage;
