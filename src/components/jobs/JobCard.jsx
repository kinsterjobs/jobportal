
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/date';

const JobCard = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="job-card"
    >
      <Card className="h-full flex flex-col">
        <CardContent className="pt-6 flex-grow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-primary font-medium">{job.company}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center text-primary">
              <Briefcase size={20} />
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-500">
              <MapPin size={16} className="mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <DollarSign size={16} className="mr-2" />
              <span>{job.salary}</span>
            </div>
          </div>
          
          <p className="text-gray-600 line-clamp-3 mb-4">
            {job.description}
          </p>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Posted {formatDistanceToNow(new Date(job.postedAt))} ago
          </span>
          <Link to={`/jobs/${job.id}`}>
            <Button>View Details</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobCard;
