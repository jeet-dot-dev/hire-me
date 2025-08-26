"use client";

import { Separator } from "@/components/ui/separator";
import {
  ApplicationTypeFull,
  ApplicationWithJob,
  JobType,
} from "@/types/applicationType";
import {
  Briefcase,
  TrendingUp,
  Clock,
  Building,
  Users,
  Eye,
} from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  calculateStats,
  getStatusData,
  // getTopApplications,
  getTopJobPostings,
  getTrendData,
} from "../../../utils/dashboardCalculations";
import { useRouter } from "next/navigation";
import { InterviewCreditsCard } from "@/components/features/InterviewCreditsCard";
import { UpgradeModal } from "@/components/features/UpgradeModal";

type DashboardUIType = {
  recentJobApplications: ApplicationWithJob[];
  recentJobPostings: JobType[];
  role: "candidate" | "recruiter";
};

const DashboardUI = ({
  recentJobApplications,
  recentJobPostings,
  role,
}: DashboardUIType) => {
  const router = useRouter();
  const [interviewCredits, setInterviewCredits] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Fetch interview credits for candidates
  useEffect(() => {
    if (role === "candidate") {
      fetch("/api/candidate/credits")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setInterviewCredits(data.creditsRemaining);
          }
        })
        .catch((err) =>
          console.error("Failed to fetch interview credits:", err)
        );
    }
  }, [role]);

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  // ✅ Stats
  const { accepted, pending, rejected, total, successRate } = useMemo(
    () => calculateStats(recentJobApplications),
    [recentJobApplications]
  );

  const statusData = useMemo(
    () => getStatusData(accepted, pending, rejected),
    [accepted, pending, rejected]
  );

  // const topApplications = useMemo(
  //   () => getTopApplications(recentJobApplications),
  //   [recentJobApplications]
  // );

  const topJobPostings = useMemo(
    () => getTopJobPostings(recentJobPostings),
    [recentJobPostings]
  );

  const trendData = useMemo(
    () => getTrendData(recentJobApplications),
    [recentJobApplications]
  );

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (status: ApplicationTypeFull["status"]) => {
    switch (status) {
      case "Accepted":
        return "text-green-400";
      case "Pending":
        return "text-yellow-400";
      case "Rejected":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getJobTypeIcon = (type: JobType["jobType"]) => {
    switch (type) {
      case "Remote":
        return "🏠";
      case "Onsite":
        return "🏢";
      case "Hybrid":
        return "🔄";
      default:
        return "💼";
    }
  };

  // ✅ Role-specific labels/messages
  const labels = {
    headerTitle:
      role === "candidate"
        ? "Your Career Command Center"
        : "Recruitment Dashboard",
    headerSubtitle:
      role === "candidate"
        ? "Track your journey to the perfect opportunity"
        : "Manage candidates and track hiring progress",
    card1Title: role === "candidate" ? "My Applications" : "Job Postings",
    card1Subtitle:
      role === "candidate"
        ? "Total applications submitted"
        : "Total jobs you have posted",
    card2Title: role === "candidate" ? "Success Rate" : "Hire Rate",
    card2Subtitle:
      role === "candidate"
        ? "Applications accepted"
        : "Candidates successfully hired",
    card3Title: role === "candidate" ? "Under Review" : "Pending Applications",
    card3Subtitle:
      role === "candidate" ? "Awaiting response" : "Candidates awaiting review",
    card4Title: role === "candidate" ? "New Opportunities" : "New Applicants",
    card4Subtitle:
      role === "candidate" ? "Fresh job postings" : "Recent candidates applied",
    section1Title:
      role === "candidate"
        ? "Recent Applications"
        : "Latest Candidate Applications",
    section2Title:
      role === "candidate"
        ? "Latest Opportunities"
        : "Your Active Job Postings",
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {labels.headerTitle}
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          {labels.headerSubtitle}
        </p>
        <Separator className="bg-gray-700 mt-4" />
      </div>

      {/* Interview Credits Section - Only for Candidates */}
      {role === "candidate" && interviewCredits !== null && (
        <section className="mb-8">
          <div className="max-w-full ">
            <InterviewCreditsCard
              credits={interviewCredits}
              onUpgrade={handleUpgrade}
            />
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Card 1 */}
        <div
          className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg  transition-all flex flex-col justify-between h-32 sm:h-40 cursor-pointer hover:border-[0.5px] hover:border-white group"
          onClick={() =>
            router.push(
              role === "candidate" ? "dashboard/application" : "dashboard/jobs"
            )
          }
        >
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">
              {labels.card1Title}
            </p>
            <Briefcase className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-bold">
              {role === "recruiter" ? recentJobPostings.length : total}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              {labels.card1Subtitle}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between h-32 sm:h-40 group">
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">
              {labels.card2Title}
            </p>
            <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-bold text-green-400">
              {successRate}%
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              {labels.card2Subtitle}
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between h-32 sm:h-40 group">
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">
              {labels.card3Title}
            </p>
            <Clock className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-bold text-yellow-400">
              {pending}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              {labels.card3Subtitle}
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div
          className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between h-32 sm:h-40 cursor-pointer hover:border-[0.5px]  hover:border-white group"
          onClick={() =>
            router.push(
              role === "candidate" ? "dashboard/jobs" : "dashboard/application"
            )
          }
        >
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">
              {labels.card4Title}
            </p>
            <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-bold text-blue-400">
              {role === "candidate"
                ? topJobPostings.length
                : recentJobApplications.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              {labels.card4Subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Graphs Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Application Status Distribution
          </h3>
          {total === 0 ? (
            <div className="h-[250px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm mb-2">No data to display</p>
              <p className="text-gray-500 text-xs max-w-48">
                {role === "candidate"
                  ? "Apply to jobs to see your application status distribution"
                  : "Applications will be visualized here once candidates start applying"}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line Chart */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Applications Trend (7 days)
          </h3>
          {total === 0 ? (
            <div className="h-[250px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm mb-2">
                No trend data available
              </p>
              <p className="text-gray-500 text-xs max-w-48">
                {role === "candidate"
                  ? "Your application activity will be tracked here over time"
                  : "Track application trends once candidates start applying to your jobs"}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Recent Applications / Job Postings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Applications */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            {labels.section1Title}
          </h3>

          {recentJobApplications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-gray-500" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {role === "candidate"
                  ? "No Applications Yet"
                  : "No Applications Received"}
              </h4>
              <p className="text-gray-400 text-sm mb-4 max-w-xs mx-auto">
                {role === "candidate"
                  ? "Start your career journey by applying to exciting job opportunities"
                  : "Candidates will appear here once they start applying to your job postings"}
              </p>
              <button
                onClick={() =>
                  router.push(
                    role === "candidate" ? "dashboard/jobs" : "dashboard/jobs"
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                {role === "candidate" ? "Browse Jobs" : "Create Job Posting"}
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentJobApplications.slice(0, 5).map((app) => (
                <li
                  key={app.id}
                  className="flex justify-between items-center lg:pb-10 bg-[#202022] p-4 rounded-xl hover:bg-[#2a2a2d] transition cursor-pointer"
                  onClick={
                    role === "candidate"
                      ? () =>
                          router.push(`/application/${app.id}/interview/result`)
                      : () =>
                          router.push(
                            `/recruiter/dashboard/application/${app.id}`
                          )
                  }
                >
                  {/* Left side */}
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-white">
                      {app.job.jobTitle || "Untitled Job"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {app.job?.companyName || "Unknown Company"} •{" "}
                      {app.job?.location || "Remote"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied on {formatDate(app.createdAt)}
                    </p>
                  </div>

                  {/* Right side */}
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Job Postings */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            {labels.section2Title}
          </h3>
          {topJobPostings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-gray-500" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {role === "candidate"
                  ? "No Job Opportunities"
                  : "No Job Postings Yet"}
              </h4>
              <p className="text-gray-400 text-sm mb-4 max-w-xs mx-auto">
                {role === "candidate"
                  ? "New job opportunities will appear here as they become available"
                  : "Create your first job posting to start attracting talented candidates"}
              </p>
              <button
                onClick={() =>
                  router.push(
                    role === "candidate"
                      ? "dashboard/jobs"
                      : "dashboard/jobs/create"
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                {role === "candidate" ? "Explore Jobs" : "Post Your First Job"}
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {topJobPostings.slice(0, 5).map((job) => (
                <li
                  key={job.id}
                  className="bg-[#202022] p-4 rounded-xl hover:bg-[#2a2a2d] transition cursor-pointer"
                  onClick={() =>
                    router.push(`/${role}/dashboard/jobs/${job.id}`)
                  }
                >
                  {/* Job title & type */}
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold flex items-center gap-2 text-base">
                      {getJobTypeIcon(job.jobType)} {job.jobTitle}
                    </p>
                    <span className="text-xs text-gray-400">
                      {formatDate(job.createdAt)}
                    </span>
                  </div>

                  {/* Company + Location */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">
                      {job.companyName}
                    </span>
                    <span className="text-blue-400 text-sm font-medium">
                      {job.location}
                    </span>
                  </div>

                  {/* Extra details */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="bg-[#2d2d31] px-2 py-1 rounded-lg">
                      💰 {job.salary || "Not Disclosed"}
                    </span>
                    <span className="bg-[#2d2d31] px-2 py-1 rounded-lg">
                      🕒 {job.jobType}
                    </span>
                    <span className="bg-[#2d2d31] px-2 py-1 rounded-lg">
                      👥 {0} Applicants
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Upgrade Modal */}
      {role === "candidate" && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentCredits={interviewCredits || 0}
        />
      )}
    </div>
  );
};

export default DashboardUI;
