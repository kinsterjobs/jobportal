import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import db from '@/lib/db';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load jobs and applications from SQLite
    const loadedJobs = db.prepare('SELECT * FROM jobs').all();
    const loadedApplications = db.prepare('SELECT * FROM applications').all();
    
    setJobs(loadedJobs);
    setApplications(loadedApplications);
    setLoading(false);
  }, []);

  const addJob = (jobData) => {
    const stmt = db.prepare(`
      INSERT INTO jobs (id, title, company, location, type, salary, description, requirements, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const jobId = Date.now().toString();
    const newJob = {
      id: jobId,
      ...jobData,
      requirements: JSON.stringify(jobData.requirements),
      posted_at: new Date().toISOString()
    };

    stmt.run(
      jobId,
      jobData.title,
      jobData.company,
      jobData.location,
      jobData.type,
      jobData.salary,
      jobData.description,
      JSON.stringify(jobData.requirements),
      jobData.createdBy
    );

    setJobs(prev => [...prev, newJob]);
    
    toast({
      title: "Job added",
      description: "The job has been added successfully",
    });
    
    return newJob;
  };

  const updateJob = (id, jobData) => {
    const stmt = db.prepare(`
      UPDATE jobs 
      SET title = ?, company = ?, location = ?, type = ?, salary = ?, 
          description = ?, requirements = ?
      WHERE id = ?
    `);

    stmt.run(
      jobData.title,
      jobData.company,
      jobData.location,
      jobData.type,
      jobData.salary,
      jobData.description,
      JSON.stringify(jobData.requirements),
      id
    );

    setJobs(prev => 
      prev.map(job => 
        job.id === id ? { ...job, ...jobData, updatedAt: new Date().toISOString() } : job
      )
    );
    
    toast({
      title: "Job updated",
      description: "The job has been updated successfully",
    });
  };

  const deleteJob = (id) => {
    // Delete job and related applications
    db.prepare('DELETE FROM applications WHERE job_id = ?').run(id);
    db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
    
    setJobs(prev => prev.filter(job => job.id !== id));
    setApplications(prev => prev.filter(app => app.jobId !== id));
    
    toast({
      title: "Job deleted",
      description: "The job and related applications have been deleted",
    });
  };

  const getJob = (id) => {
    return jobs.find(job => job.id === id);
  };

  const applyForJob = (jobId, userData) => {
    const stmt = db.prepare(`
      INSERT INTO applications (
        id, job_id, user_id, user_name, user_email, phone, 
        cover_letter, resume, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const applicationId = Date.now().toString();
    const application = {
      id: applicationId,
      jobId,
      ...userData,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };

    stmt.run(
      applicationId,
      jobId,
      userData.userId,
      userData.userName,
      userData.userEmail,
      userData.phone,
      userData.coverLetter,
      userData.resume,
      'pending'
    );
    
    setApplications(prev => [...prev, application]);
    
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully",
    });
    
    return application;
  };

  const updateApplicationStatus = (id, status) => {
    const stmt = db.prepare('UPDATE applications SET status = ? WHERE id = ?');
    stmt.run(status, id);
    
    setApplications(prev => 
      prev.map(app => 
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