"use client";

import { JobFormData } from "@/zod/job";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Share, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ShareJobDialog from "../share/ShareJobDialog";

type JobViewPageProps = {
  job: JobFormData;
  role: "CANDIDATE" | "RECRUITER";
};

const fixMarkdownFormatting = (text: string) => {
  return text.replace(/\r\n|\r|\n/g, "\n\n");
};

const JobViewPage = ({ job, role }: JobViewPageProps) => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6  text-white">
      {/* Top actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="px-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          {role === "RECRUITER" && (
            <>
              <Button variant="outline"className="cursor-pointer" 
              onClick={()=>router.push(`/recruiter/dashboard/jobs/${job.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
                <ShareJobDialog jobId={job.id}>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </ShareJobDialog>
            </>
          )}
          {role === "CANDIDATE" && (
            <>
              <Button size="sm" className="cursor-pointer">
                <Send className="h-4 w-4 mr-1" />
                Apply
              </Button>
             <ShareJobDialog jobId={job.id}>
                <Button variant="secondary" className="cursor-pointer">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </ShareJobDialog>
            </>
          )}
        </div>
      </div>

      {/* Job details */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
        <p className="text-muted-foreground">
          {job.companyName} • {job.location}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {job.salary && (
            <div>
              <strong>Salary:</strong> {job.salary}
            </div>
          )}
          <div>
            <strong>Type:</strong> {job.jobType}
          </div>
          {job.industry && (
            <div>
              <strong>Industry:</strong> {job.industry}
            </div>
          )}
          {job.jobLevel && (
            <div>
              <strong>Level:</strong> {job.jobLevel}
            </div>
          )}
          {job.experienceNeeded !== null && (
            <div>
              <strong>Experience:</strong> {job.experienceNeeded} years
            </div>
          )}
          {job.contact && (
            <div>
              <strong>Contact:</strong> {job.contact}
            </div>
          )}
          {job.expireAt && (
            <div>
              <strong>Expires on:</strong>{" "}
              {new Date(job.expireAt).toLocaleDateString()}
            </div>
          )}
          <div>
            <strong>Interview Duration:</strong> {job.interviewDuration} mins
          </div>
        </div>



        {/* Skills */}
           <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired.map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-white text-white"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

        {/* Description */}
        <div className="prose prose-invert max-w-none mt-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {fixMarkdownFormatting(
              job.description || "No description available"
            )}
          </ReactMarkdown>
        </div>

        {/* Instructions */}
        {job.interviewInstruction && (
          <div className="mt-6">
            {role==="RECRUITER" && (<h2 className="font-semibold">Interview Instructions</h2>)}
            <p className="mt-1">{job.interviewInstruction}</p>
          </div>
        )}

                {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2 text-sm flex-col">
          <span className="text-lg font-semibold">Tags :</span>
          <div className="flex flex-wrap gap-2 ">
            {job.tags.map((tag, idx) => (
            <span
              key={idx}
              className=" py-1  dark:border-gray-600 "
            >
              #{tag}
            </span>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobViewPage;
