import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  MoreVertical, 
  Edit, 
  Trash2,
  Eye,
  Send,
  Clock,
  Calendar,
  AlertCircle,
  Power,
  PowerOff,
  Link,
  Heart
} from 'lucide-react';
import { JobFormDataUI } from '@/zod/job';

// Mock data for demonstration

type JobCardUiProp = {
  job : JobFormDataUI,
  role : 'RECRUITER' | 'CANDIDATE',
  styleType : boolean
}

const JobCardUi = ({ job, role, styleType }:JobCardUiProp) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [jobStatus, setJobStatus] = useState(job.status);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleToggleStatus = () => {
    if (jobStatus) {
      setShowConfirmDialog(true);
    } else {
      setJobStatus(true);
    }
  };

  const confirmDeactivate = () => {
    setJobStatus(false);
    setShowConfirmDialog(false);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const daysRemaining = getDaysRemaining(job.expireAt);
  const isExpired = daysRemaining < 0;

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Remote':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Onsite':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Hybrid':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getJobLevelColor = (level?: string) => {
    switch (level) {
      case 'INTERN':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ENTRY':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'MID':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'SENIOR':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'LEAD':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Table/List View - Dark Professional Theme
  if (styleType) {
    return (
      <div className="w-full">
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200 rounded-lg">
          <div className="px-6 py-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Job Title - 2 columns */}
              <div className="col-span-2 min-w-0">
                <h3 className="text-white font-medium truncate text-sm">
                  {job.jobTitle}
                </h3>
              </div>
              
              {/* Company - 2 columns */}
              <div className="col-span-2 min-w-0">
                <span className="text-gray-300 text-sm truncate block">{job.companyName}</span>
              </div>
              
              {/* Skills - 2 columns */}
              <div className="col-span-2 min-w-0">
                <div className="flex flex-wrap gap-1">
                  {job.skillsRequired?.slice(0, 2).map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {job.skillsRequired?.length > 2 && (
                    <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs px-2 py-0.5">
                      +{job.skillsRequired.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Location - 1.5 columns */}
              <div className="col-span-1 min-w-0">
                <span className="text-gray-300 text-sm truncate block">{job.location}</span>
              </div>
              
              {/* Expiry Date - 1.5 columns */}
              <div className="col-span-1 min-w-0">
                <span className={`text-sm ${isExpired ? "text-red-400" : daysRemaining <= 7 ? "text-yellow-400" : "text-gray-300"}`}>
                  {formatDate(job.expireAt)}
                </span>
              </div>
              
              {/* Status - 1 column */}
              <div className="col-span-1">
                {role === "RECRUITER" && (
                  <Badge 
                    variant="outline" 
                    className={`${jobStatus ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'} text-xs`}
                  >
                    {jobStatus ? 'Active' : 'Inactive'}
                  </Badge>
                )}
                {role === "CANDIDATE" && (
                  <Badge 
                    variant="outline" 
                    className={`${isExpired ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'} text-xs`}
                  >
                    {isExpired ? 'Expired' : 'Active'}
                  </Badge>
                )}
              </div>
              
              {/* Actions - 1 column */}
              <div className="col-span-1 flex items-center justify-end space-x-2">
                {role === "RECRUITER" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-800/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                {role === "CANDIDATE" && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-3 py-1 text-xs"
                      disabled={isExpired}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card/Grid View - Modern Professional Design
  return (
    <div className="w-full">
      <Card className="bg-gray-900/60 backdrop-blur-md border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 h-[320px] group hover:bg-gray-900/70">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                {job.jobTitle}
              </h3>
              <div className="flex items-center gap-2 text-gray-300 mb-3">
                <Building2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-lg truncate">{job.companyName}</span>
              </div>
            </div>
            
            {role === "RECRUITER" && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleStatus}
                  className={`h-8 w-8 p-0 ${jobStatus ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-gray-800/50'}`}
                >
                  {jobStatus ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem className="cursor-pointer text-gray-300 hover:text-white hover:bg-gray-700">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {role === "CANDIDATE" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlist}
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-800/50 transition-all"
              >
                <Heart 
                  className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} 
                />
              </Button>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-300 mb-4">
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <span className="text-lg truncate">{job.location}</span>
          </div>

          {/* Salary */}
          {job.salary && (
            <div className="flex items-center gap-2 text-gray-300 mb-4">
              <DollarSign className="w-5 h-5 flex-shrink-0" />
              <span className="text-lg font-semibold">{job.salary}</span>
            </div>
          )}

          {/* Candidate specific info */}
          {role === "CANDIDATE" && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Created: {formatDate(job.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className={`text-sm ${isExpired ? "text-red-400" : daysRemaining <= 7 ? "text-yellow-400" : "text-gray-400"}`}>
                  Expires: {formatDate(job.expireAt)} 
                  {isExpired ? " (Expired)" : ` (${daysRemaining} days left)`}
                </span>
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className={`${getJobTypeColor(job.jobType)} border text-sm px-3 py-1`}>
              {job.jobType}
            </Badge>
            {job.jobLevel && (
              <Badge variant="outline" className={`${getJobLevelColor(job.jobLevel)} border text-sm px-3 py-1`}>
                {job.jobLevel}
              </Badge>
            )}
            {job.interviewDuration && (
              <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-sm px-3 py-1">
                <Clock className="w-3 h-3 mr-1" />
                {job.interviewDuration}min
              </Badge>
            )}
          </div>

          {/* Action Buttons for Candidate */}
          {role === "CANDIDATE" && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-800/50">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-600/50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                disabled={isExpired}
              >
                <Send className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Confirm Deactivation</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to deactivate this job posting? This will make it invisible to candidates.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeactivate}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCardUi;