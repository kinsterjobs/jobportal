
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from '@/lib/date';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ExternalLink, User, Mail, Phone, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const ApplicationCard = ({ application, showJobDetails = false }) => {
  const { getJob, updateApplicationStatus } = useJobs();
  const { isAdmin } = useAuth();
  const job = getJob(application.jobId);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (newStatus) => {
    updateApplicationStatus(application.id, newStatus);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="h-full flex flex-col">
        <CardContent className="pt-6 flex-grow">
          {showJobDetails && job && (
            <div className="mb-4">
              <Link to={`/jobs/${job.id}`} className="text-lg font-bold text-primary hover:underline">
                {job.title}
              </Link>
              <p className="text-gray-600">{job.company}</p>
            </div>
          )}
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User size={16} className="text-gray-500" />
                <span className="font-medium">{application.userName}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Mail size={16} className="text-gray-500" />
                <span>{application.userEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span>{application.phone}</span>
              </div>
            </div>
            
            <div>
              <Badge className={getStatusColor(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
            <p className="text-gray-600 text-sm line-clamp-3">{application.coverLetter}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>Applied {formatDistanceToNow(new Date(application.appliedAt))} ago</span>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
          <a 
            href={application.resume} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <FileText size={16} />
            View Resume
            <ExternalLink size={14} />
          </a>
          
          {isAdmin() && (
            <div className="flex-1 flex justify-end gap-2">
              {application.status !== 'accepted' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => handleStatusChange('accepted')}
                >
                  <CheckCircle size={16} className="mr-1" />
                  Accept
                </Button>
              )}
              
              {application.status !== 'rejected' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => handleStatusChange('rejected')}
                >
                  <XCircle size={16} className="mr-1" />
                  Reject
                </Button>
              )}
              
              {application.status === 'pending' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange('reviewing')}
                >
                  Reviewing
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ApplicationCard;
