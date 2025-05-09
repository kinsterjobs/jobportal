
import React, { useState } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

const JobForm = ({ job, onSubmit }) => {
  const { addJob, updateJob } = useJobs();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    type: job?.type || '',
    salary: job?.salary || '',
    description: job?.description || '',
    requirements: job?.requirements || [''],
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

  const handleSelectChange = (name, value) => {
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

  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    
    setFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.type) newErrors.type = 'Job type is required';
    if (!formData.salary.trim()) newErrors.salary = 'Salary is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Check if at least one non-empty requirement exists
    const hasValidRequirement = formData.requirements.some(req => req.trim() !== '');
    if (!hasValidRequirement) newErrors.requirements = 'At least one requirement is needed';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Filter out empty requirements
    const cleanedData = {
      ...formData,
      requirements: formData.requirements.filter(req => req.trim() !== ''),
      createdBy: currentUser.id
    };
    
    if (job) {
      // Update existing job
      updateJob(job.id, cleanedData);
    } else {
      // Add new job
      addJob(cleanedData);
    }
    
    if (onSubmit) {
      onSubmit();
    } else {
      navigate('/admin/jobs');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Acme Inc."
            className={errors.company ? 'border-red-500' : ''}
          />
          {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. New York, NY or Remote"
            className={errors.location ? 'border-red-500' : ''}
          />
          {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Job Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. $50,000 - $70,000"
            className={errors.salary ? 'border-red-500' : ''}
          />
          {errors.salary && <p className="text-sm text-red-500">{errors.salary}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the job role, responsibilities, and other details..."
          rows={5}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Requirements</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addRequirement}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        
        {formData.requirements.map((requirement, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={requirement}
              onChange={(e) => handleRequirementChange(index, e.target.value)}
              placeholder={`Requirement ${index + 1}`}
              className={errors.requirements ? 'border-red-500' : ''}
            />
            {formData.requirements.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeRequirement(index)}
                className="h-10 w-10 text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {errors.requirements && <p className="text-sm text-red-500">{errors.requirements}</p>}
      </div>
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate('/admin/jobs')}>
          Cancel
        </Button>
        <Button type="submit">
          {job ? 'Update Job' : 'Create Job'}
        </Button>
      </div>
    </motion.form>
  );
};

export default JobForm;
