
import React from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '@/contexts/JobContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { jobs, applications } = useJobs();
  
  // Calculate statistics
  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
  
  // Get unique users who have applied
  const uniqueApplicants = [...new Set(applications.map(app => app.userId))].length;
  
  // Get recent applications
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.h1 
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Dashboard
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              Active job listings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Across all job listings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueApplicants}</div>
            <p className="text-xs text-muted-foreground">
              Distinct job seekers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalApplications > 0 
                ? `${Math.round((acceptedApplications / totalApplications) * 100)}%` 
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Of all applications
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-100 rounded-full h-4">
                    <div 
                      className="bg-yellow-400 h-4 rounded-full" 
                      style={{ width: `${totalApplications > 0 ? (pendingApplications / totalApplications) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 text-sm font-medium min-w-[60px]">
                    {pendingApplications} <Clock className="h-4 w-4 inline text-yellow-500" />
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-full bg-gray-100 rounded-full h-4">
                    <div 
                      className="bg-green-400 h-4 rounded-full" 
                      style={{ width: `${totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 text-sm font-medium min-w-[60px]">
                    {acceptedApplications} <CheckCircle className="h-4 w-4 inline text-green-500" />
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-full bg-gray-100 rounded-full h-4">
                    <div 
                      className="bg-red-400 h-4 rounded-full" 
                      style={{ width: `${totalApplications > 0 ? (rejectedApplications / totalApplications) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 text-sm font-medium min-w-[60px]">
                    {rejectedApplications} <XCircle className="h-4 w-4 inline text-red-500" />
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="font-medium">Pending</div>
                  <div className="text-muted-foreground">{pendingApplications}</div>
                </div>
                <div>
                  <div className="font-medium">Accepted</div>
                  <div className="text-muted-foreground">{acceptedApplications}</div>
                </div>
                <div>
                  <div className="font-medium">Rejected</div>
                  <div className="text-muted-foreground">{rejectedApplications}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map(application => {
                    const job = jobs.find(j => j.id === application.jobId);
                    
                    return (
                      <div key={application.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {application.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{application.userName}</div>
                            <div className="text-sm text-muted-foreground">
                              Applied for {job?.title || 'Unknown Job'}
                            </div>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No applications yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
