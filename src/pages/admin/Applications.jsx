
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '@/contexts/JobContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ApplicationCard from '@/components/applications/ApplicationCard';
import { Search, Filter, X } from 'lucide-react';

const Applications = () => {
  const { applications, jobs } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJobId, setFilterJobId] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter applications based on search term, job filter, and status tab
  const filteredApplications = applications.filter(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const matchesSearch = 
      app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job && job.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesJobFilter = filterJobId ? app.jobId === filterJobId : true;
    const matchesStatusTab = activeTab === 'all' ? true : app.status === activeTab;
    
    return matchesSearch && matchesJobFilter && matchesStatusTab;
  });
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterJobId('');
  };

  return (
    <div className="space-y-6">
      <motion.h1 
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Manage Applications
      </motion.h1>
      
      <motion.div 
        className="bg-white p-4 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterJobId} onValueChange={setFilterJobId}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredApplications.map(application => {
                  const job = jobs.find(j => j.id === application.jobId);
                  
                  return (
                    <ApplicationCard 
                      key={application.id} 
                      application={application} 
                      showJobDetails={true} 
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterJobId 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.' 
                    : 'There are no applications in this category yet.'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Applications;
