
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize with sample data if none exists
  useEffect(() => {
    const storedJobs = localStorage.getItem('jobhub_jobs');
    const storedApplications = localStorage.getItem('jobhub_applications');
    
    if (!storedJobs) {
      // Sample job data
      const sampleJobs = [
        {
          id: '1',
          title: 'Frontend Developer',
          company: 'TechCorp',
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$80,000 - $100,000',
          description: 'We are looking for a skilled Frontend Developer to join our team. The ideal candidate should have experience with React, JavaScript, and modern CSS frameworks.',
          requirements: [
            'Proficient in React, JavaScript, and HTML/CSS',
            'Experience with responsive design',
            '3+ years of frontend development experience',
            'Bachelor\'s degree in Computer Science or related field'
          ],
          postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin'
        },
        {
          id: '2',
          title: 'Backend Developer',
          company: 'DataSystems',
          location: 'Remote',
          type: 'Full-time',
          salary: '$90,000 - $120,000',
          description: 'We\'re seeking a Backend Developer with strong Node.js skills to help build scalable APIs and services.',
          requirements: [
            'Strong experience with Node.js and Express',
            'Knowledge of database systems (SQL and NoSQL)',
            'Understanding of RESTful API design',
            'Experience with cloud services (AWS/Azure/GCP)'
          ],
          postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin'
        },
        {
          id: '3',
          title: 'UX/UI Designer',
          company: 'CreativeMinds',
          location: 'San Francisco, CA',
          type: 'Contract',
          salary: '$70 - $90 per hour',
          description: 'Join our design team to create beautiful, intuitive interfaces for our clients. You\'ll work closely with developers and product managers.',
          requirements: [
            'Portfolio demonstrating UI/UX skills',
            'Proficiency in Figma, Sketch, or Adobe XD',
            'Understanding of user-centered design principles',
            'Experience working in agile environments'
          ],
          postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin'
        }
      ];
      
      setJobs(sampleJobs);
      localStorage.setItem('jobhub_jobs', JSON.stringify(sampleJobs));
    } else {
      setJobs(JSON.parse(storedJobs));
    }
    
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }
    
    setLoading(false);
  }, []);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('jobhub_jobs', JSON.stringify(jobs));
    }
  }, [jobs, loading]);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('jobhub_applications', JSON.stringify(applications));
    }
  }, [applications, loading]);

  const addJob = (jobData) => {
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      postedAt: new Date().toISOString()
    };
    
    setJobs(prevJobs => [...prevJobs, newJob]);
    
    toast({
      title: "Job added",
      description: "The job has been added successfully",
    });
    
    return newJob;
  };

  const updateJob = (id, jobData) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === id ? { ...job, ...jobData, updatedAt: new Date().toISOString() } : job
      )
    );
    
    toast({
      title: "Job updated",
      description: "The job has been updated successfully",
    });
  };

  const deleteJob = (id) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    
    // Also delete related applications
    setApplications(prevApps => prevApps.filter(app => app.jobId !== id));
    
    toast({
      title: "Job deleted",
      description: "The job and related applications have been deleted",
    });
  };

  const getJob = (id) => {
    return jobs.find(job => job.id === id);
  };

  const applyForJob = (jobId, userData) => {
    const application = {
      id: Date.now().toString(),
      jobId,
      ...userData,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    
    setApplications(prevApps => [...prevApps, application]);
    
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully",
    });
    
    return application;
  };

  const updateApplicationStatus = (id, status) => {
    setApplications(prevApps => 
      prevApps.map(app => 
        app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app
      )
    );
    
    toast({
      title: "Application updated",
      description: `The application status has been updated to ${status}`,
    });
  };

  const getUserApplications = (userId) => {
    return applications.filter(app => app.userId === userId);
  };

  const getJobApplications = (jobId) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const value = {
    jobs,
    applications,
    loading,
    addJob,
    updateJob,
    deleteJob,
    getJob,
    applyForJob,
    updateApplicationStatus,
    getUserApplications,
    getJobApplications
  };

  return (
    <JobContext.Provider value={value}>
      {!loading && children}
    </JobContext.Provider>
  );
};
