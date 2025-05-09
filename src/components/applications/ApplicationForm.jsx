
import React, { useState } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ApplicationForm = ({ jobId, onSuccess }) => {
  const { applyForJob } = useJobs();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    coverLetter: '',
    resume: '',
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';
    if (!formData.resume.trim()) newErrors.resume = 'Resume link is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to apply for this job",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const applicationData = {
      ...formData,
      userId: currentUser.id,
      userName: formData.name,
      userEmail: formData.email,
    };
    
    applyForJob(jobId, applicationData);
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/applications');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email address"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="resume">Resume Link</Label>
        <Input
          id="resume"
          name="resume"
          value={formData.resume}
          onChange={handleChange}
          placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
          className={errors.resume ? 'border-red-500' : ''}
        />
        {errors.resume && <p className="text-sm text-red-500">{errors.resume}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
          rows={5}
          className={errors.coverLetter ? 'border-red-500' : ''}
        />
        {errors.coverLetter && <p className="text-sm text-red-500">{errors.coverLetter}</p>}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-full sm:w-auto">
          Submit Application
        </Button>
      </div>
    </motion.form>
  );
};

export default ApplicationForm;
