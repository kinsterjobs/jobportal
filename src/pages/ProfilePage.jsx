
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Phone, Briefcase, MapPin, GraduationCap } from 'lucide-react';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Get user profile from localStorage or initialize with defaults
  const getUserProfile = () => {
    const storedProfile = localStorage.getItem(`jobhub_profile_${currentUser.id}`);
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    return {
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: '',
      location: '',
      title: '',
      bio: '',
      skills: '',
      experience: '',
      education: '',
    };
  };
  
  const [profile, setProfile] = useState(getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const saveProfile = () => {
    localStorage.setItem(`jobhub_profile_${currentUser.id}`, JSON.stringify(profile));
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gradient-to-r from-primary to-blue-600 h-32 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="h-32 w-32 rounded-full bg-white p-1 shadow-md">
              <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
              <p className="text-gray-600">{profile.title || 'Job Seeker'}</p>
            </div>
            
            <Button 
              onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Button>
          </div>
          
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={profile.title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    placeholder="e.g. JavaScript, React, CSS"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  placeholder="List your work experience..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  placeholder="List your education..."
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="text-gray-900">{profile.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="text-gray-900">{profile.location || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Professional Title</h3>
                      <p className="text-gray-900">{profile.title || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">About Me</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {profile.bio || 'No bio provided yet.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                <p className="text-gray-700">
                  {profile.skills || 'No skills listed yet.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {profile.experience || 'No work experience listed yet.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {profile.education || 'No education listed yet.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
