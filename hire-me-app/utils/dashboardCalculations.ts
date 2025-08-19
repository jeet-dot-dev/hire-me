// utils/dashboardCalculations.ts

import { ApplicationTypeFull, JobType } from "@/types/applicationType";

export const calculateStats = (applications: ApplicationTypeFull[]) => {
  const accepted = applications.filter((app) => app.status === "Accepted").length;
  const pending = applications.filter((app) => app.status === "Pending").length;
  const rejected = applications.filter((app) => app.status === "Rejected").length;
  const total = applications.length;
  const successRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : "0.0";

  return { accepted, pending, rejected, total, successRate };
};

export const getStatusData = (
  accepted: number,
  pending: number,
  rejected: number
) => [
  { name: "Accepted", value: accepted, color: "#10B981" },
  { name: "Pending", value: pending, color: "#F59E0B" },
  { name: "Rejected", value: rejected, color: "#EF4444" },
];

export const getTopApplications = (applications: ApplicationTypeFull[]) =>
  applications
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

export const getTopJobPostings = (jobs: JobType[]) =>
  jobs
    .filter((job) => !job.isDelete && job.status)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

export const getTrendData = (applications: ApplicationTypeFull[]) => {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayApplications = applications.filter((app) => {
      const appDate = new Date(app.createdAt);
      return appDate.toDateString() === date.toDateString();
    }).length;

    last7Days.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      applications: dayApplications,
    });
  }
  return last7Days;
};
