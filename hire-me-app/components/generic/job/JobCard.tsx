import { RecruiterJobCompProp } from "@/components/custom/recruiter/RecruiterJobComp";
import JobCardUi from "./jobCardUi";
import { AlignJustify ,SquareMenu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from "react";



const JobCard = ({ jobs, role } : RecruiterJobCompProp) => {
  const [isList, setIsList] = useState(true);

  return (
   <div className="dark">
     <div className="space-y-4 bg-black/10 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Job Listings</h2>
        <Button 
          variant="ghost" 
          onClick={() => setIsList(!isList)}
         
        >
          {isList ? <SquareMenu className="w-4 h-4 mr-2" /> : <AlignJustify className="w-4 h-4 mr-2" />}
          {isList ? 'Grid View' : 'List View'}
        </Button>
      </div>
      
      <div className={isList ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"}>
        {jobs.map((job, index) => (
          <JobCardUi key={job.id || index} job={job} role={role} styleType={isList} />
        ))}
      </div>
    </div>
   </div>
  );
};

export default JobCard;

