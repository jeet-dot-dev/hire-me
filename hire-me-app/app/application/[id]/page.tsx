import { extractResumeText } from "@/components/interview/functions/extractResumeText";
import { getResumeAnalysis } from "@/components/interview/functions/getResFromAi";
import { prisma } from "@/lib/prisma";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: Props) => {
  const { id } = await params;

  if (!id) {
    return <div className="text-red-500">❌ Application ID is required</div>;
  }

  // 1️⃣ Fetch the application
  const application = await prisma.jobApplication.findUnique({
    where: { id },
  });

  if (!application) {
    return <div className="text-red-500">❌ Application not found</div>;
  }

  // 2️⃣ Fetch the job
  const job = await prisma.job.findUnique({
    where: { id: application.jobId },
    select: {
      id: true,
      jobTitle: true,
      companyName: true,
      location: true,
      salary: true,
      jobType: true,
      description: true,
      skillsRequired: true,
      interviewDuration: true,
      interviewInstruction: true,
      tags: true,
      industry: true,
      jobLevel: true,
      experienceNeeded: true,
      contact: true,
      expireAt: true,
      createdAt: true,
      updatedAt: true,
      status: true,
    },
  });

  if (!job) {
    return <div className="text-red-500">❌ Job not found</div>;
  }

  // 3️⃣ If already fully processed, show results
  if (application.score !== null && application.resumeText && application.resumeOverview) {
    return (
      <div className="text-white max-w-4xl mx-auto mt-10 space-y-6 bg-black p-6">
        <h2 className="text-3xl font-bold">🎯 Resume Analysis Results</h2>
        
        {/* Score Section */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Match Score</h3>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-blue-400">{application.score}%</div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full" 
                style={{ width: `${application.score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Resume Overview */}
        <div className="bg-gray-900/50 border border-gray-600 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">📋 Resume Overview</h3>
          <p className="text-gray-300 leading-relaxed">{application.resumeOverview}</p>
        </div>

        {/* Skills Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Matched Skills */}
          <div className="bg-green-900/20 border border-green-500 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-400">✅ Matched Skills</h3>
            {application.matchedSkills && application.matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {application.matchedSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-green-800/30 text-green-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No matched skills found</p>
            )}
          </div>

          {/* Unmatched Skills */}
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-red-400">❌ Missing Skills</h3>
            {application.unmatchedSkills && application.unmatchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {application.unmatchedSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-red-800/30 text-red-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">All required skills are matched!</p>
            )}
          </div>
        </div>

        {/* Resume Text Preview */}
        <div className="bg-gray-900/50 border border-gray-600 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">📄 Resume Text Preview</h3>
          <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto max-h-64 text-gray-300">
            {application.resumeText.slice(0, 500)}...
          </pre>
        </div>
      </div>
    );
  }

  // 4️⃣ Extract resume text if not already done
  if (!application.resumeText) {
    console.log("Extracting resume text...");
    const resumeText = await extractResumeText(application.resumeUrl);
    
    if (!resumeText) {
      return (
        <div className="text-red-500">❌ Failed to extract resume text</div>
      );
    }

    // Save resume text to database
    await prisma.jobApplication.update({
      where: { id },
      data: {
        resumeText: resumeText,
      },
    });

    // Update the application object for next step
    application.resumeText = resumeText;
  }

  // 5️⃣ Get AI analysis if not already done
  if (!application.score && application.resumeText) {
    console.log("Getting AI analysis...");
    
    const analysisResult = await getResumeAnalysis(application.resumeText, {
      description: job.description || "",
      skillsRequired: job.skillsRequired || []
    });

    if (!analysisResult) {
      return (
        <div className="text-red-500 max-w-xl mx-auto mt-10 space-y-4">
          <h2 className="text-2xl font-bold">❌ Analysis Failed</h2>
          <div className="bg-red-900/20 border border-red-500 p-4 rounded">
            <p>Failed to analyze resume with AI. Please try again later.</p>
          </div>
        </div>
      );
    }

    // Save analysis results to database
    await prisma.jobApplication.update({
      where: { id },
      data: {
        score: analysisResult.score,
        resumeOverview: analysisResult.resumeOverview,
        matchedSkills: analysisResult.matchedSkills,
        unmatchedSkills: analysisResult.unmatchedSkills,
      },
    });

    // Show processing complete message
    return (
      <div className="text-white max-w-xl mx-auto mt-10 space-y-6 bg-black p-6">
        <h2 className="text-2xl font-bold">🎯 Analysis Complete!</h2>
        <div className="bg-green-900/20 border border-green-500 p-4 rounded">
          <p className="text-green-400">✅ Resume analysis completed successfully!</p>
          <p className="text-sm text-gray-300 mt-2">Refresh the page to see detailed results.</p>
        </div>
        <div className="bg-blue-900/20 border border-blue-500 p-4 rounded">
          <p className="text-blue-400">Score: {analysisResult.score}%</p>
          <p className="text-sm text-gray-300 mt-1">
            Matched Skills: {analysisResult.matchedSkills.length} | 
            Missing Skills: {analysisResult.unmatchedSkills.length}
          </p>
        </div>
      </div>
    );
  }

  // 6️⃣ Fallback (should rarely reach here)
  return (
    <div className="text-white max-w-xl mx-auto mt-10 space-y-6 bg-black">
      <h2 className="text-2xl font-bold">🎯 Processing Resume...</h2>
      <div className="bg-yellow-900/20 border border-yellow-500 p-4 rounded">
        <p className="text-yellow-400">⏳ Resume analysis in progress...</p>
      </div>
    </div>
  );
};

export default Page;