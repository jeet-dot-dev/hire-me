"use client";

import { Separator } from "@/components/ui/separator";
import { ApplicationTypeFull, JobType } from "@/types/applicationType";
import {
  Briefcase,
  TrendingUp,
  Clock,
  MapPin,
  Building,
  DollarSign,
  Users,
  Eye,
  Target,
} from "lucide-react";
import React, { useMemo } from "react";
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

// import utils
import {
  calculateStats,
  getStatusData,
  getTopApplications,
  getTopJobPostings,
  getTrendData,
} from "../../../utils/dashboardCalculations";
import { useRouter } from "next/navigation";

type DashboardUIType = {
  recentJobApplications: ApplicationTypeFull[];
  recentJobPostings: JobType[];
};

const DashboardUI = ({
  recentJobApplications,
  recentJobPostings,
}: DashboardUIType) => {
  const router = useRouter();
  // ✅ useMemo for all calculations
  const { accepted, pending, rejected, total, successRate } = useMemo(
    () => calculateStats(recentJobApplications),
    [recentJobApplications]
  );

  const statusData = useMemo(
    () => getStatusData(accepted, pending, rejected),
    [accepted, pending, rejected]
  );

  const topApplications = useMemo(
    () => getTopApplications(recentJobApplications),
    [recentJobApplications]
  );

  const topJobPostings = useMemo(
    () => getTopJobPostings(recentJobPostings),
    [recentJobPostings]
  );

  const trendData = useMemo(
    () => getTrendData(recentJobApplications),
    [recentJobApplications]
  );

  // small helpers inside since they're cheap
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  // tightened types to avoid implicit any
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

  return (
    <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Your Career Command Center
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Track your journey to the perfect opportunity
        </p>
        <Separator className="bg-gray-700 mt-4" />
      </div>

      {/* Stats Section */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Card 1 - My Applications */}
        <div
          className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg  transition-all flex flex-col justify-between h-32 sm:h-40 cursor-pointer hover:border-[0.5px] hover:border-white group"
          onClick={() => router.push("dashboard/application")}
        >
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">
              My Applications
            </p>
            <Briefcase className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-bold">{total}</p>
            <p className="text-xs sm:text-sm text-gray-400">
              Total applications submitted
            </p>
          </div>
        </div>

        {/* Card 2 - Success Rate */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between h-32 sm:h-40 group">
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">Success Rate</p>
            <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-bold text-green-400">
              {successRate}%
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Applications accepted
            </p>
          </div>
        </div>

        {/* Card 3 - Pending Review */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between h-32 sm:h-40 group">
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">Under Review</p>
            <Clock className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-bold text-yellow-400">
              {pending}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Awaiting response
            </p>
          </div>
        </div>

        {/* Card 4 - Available Jobs */}
        <div
          className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between h-32 sm:h-40 cursor-pointer hover:border-[0.5px]  hover:border-white group"
          onClick={() => router.push("dashboard/jobs")}
        >
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">
              New Opportunities
            </p>
            <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
          </div>
          <div>
            <p className="text-2xl sm:text-4xl font-bold text-blue-400">
              {topJobPostings.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Fresh job postings
            </p>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Status Pie Chart */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Application Status Breakdown
          </h3>
          {total > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>No applications yet. Start applying to see your progress!</p>
            </div>
          )}
        </div>

        {/* Application Trend Line Chart */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Application Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Applications and Job Postings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Applications */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Recent Applications
          </h3>
          <div className="space-y-3">
            {topApplications.length > 0 ? (
              topApplications.map((app, index) => (
                <div
                  key={app.id}
                  className="p-3 bg-[#0f0f10] rounded-lg hover:bg-[#1a1a1c] transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/application/${app.id}/interview/result`)
                  }
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">
                        Application #{index + 1}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(app.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)} bg-opacity-20`}
                    >
                      {app.status}
                    </span>
                  </div>
                  {app.score && (
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: `${app.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {app.score}%
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No applications yet</p>
                <p className="text-sm">Start your job search journey!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Job Postings */}
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Latest Opportunities
          </h3>
          <div className="space-y-3">
            {topJobPostings.length > 0 ? (
              topJobPostings.map((job) => (
                <div
                  key={job.id}
                  className="p-3 bg-[#0f0f10] rounded-lg hover:bg-[#1a1a1c] transition-colors cursor-pointer group"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate group-hover:text-blue-400 transition-colors">
                        {job.jobTitle}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {job.companyName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {getJobTypeIcon(job.jobType)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="hidden md:flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span className="truncate">{job.salary}</span>
                      </div>
                    )}
                  </div>
                  {job.skillsRequired.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {job.skillsRequired
                        .slice(0, 3)
                        .map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="text-xs bg-gray-700 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      {job.skillsRequired.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{job.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No job postings available</p>
                <p className="text-sm">
                  Check back soon for new opportunities!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Browse Jobs */}
        <div
          className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 group"
          onClick={() => router.push("dashboard/jobs")}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-base sm:text-lg font-semibold">Discover Jobs</p>
            <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold mb-1">Explore Now</p>
            <p className="text-xs sm:text-sm text-blue-200">
              Find your next career move
            </p>
          </div>
        </div>

        {/* Interview Prep */}
        <div
          className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 group"
          onClick={() => router.push("dashboard/application")}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-base sm:text-lg font-semibold">Interview Prep</p>
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold mb-1">Get Ready</p>
            <p className="text-xs sm:text-sm text-purple-200">
              Practice makes perfect
            </p>
          </div>
        </div>

        {/* Profile Update */}
        <div
          className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 group sm:col-span-2 lg:col-span-1"
          onClick={() => router.push("dashboard/profile")}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-base sm:text-lg font-semibold">Update Profile</p>
            <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold mb-1">Stay Current</p>
            <p className="text-xs sm:text-sm text-green-200">
              Keep your profile fresh
            </p>
          </div>
        </div>
      </section>

      {/* Additional Insights */}
      {total > 0 && (
        <section className="mt-8">
          <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Progress Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-[#0f0f10] rounded-lg">
                <p className="text-lg sm:text-xl font-bold text-green-400">
                  {accepted}
                </p>
                <p className="text-xs text-gray-400">Accepted</p>
              </div>
              <div className="p-3 bg-[#0f0f10] rounded-lg">
                <p className="text-lg sm:text-xl font-bold text-yellow-400">
                  {pending}
                </p>
                <p className="text-xs text-gray-400">Pending</p>
              </div>
              <div className="p-3 bg-[#0f0f10] rounded-lg">
                <p className="text-lg sm:text-xl font-bold text-red-400">
                  {rejected}
                </p>
                <p className="text-xs text-gray-400">Rejected</p>
              </div>
              <div className="p-3 bg-[#0f0f10] rounded-lg">
                <p className="text-lg sm:text-xl font-bold text-blue-400">
                  {
                    recentJobApplications.filter((app) => app.isInterviewDone)
                      .length
                  }
                </p>
                <p className="text-xs text-gray-400">Interviews</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardUI;
//
