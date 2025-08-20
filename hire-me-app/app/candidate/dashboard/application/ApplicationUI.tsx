"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApplicationWithJob } from "@/types/applicationType";
import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText } from "lucide-react";

const ApplicationUI = ({
  applications,
  role,
}: {
  applications: ApplicationWithJob[];
  role: "candidate" | "recruiter";
}) => {
  const router = useRouter();
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Accepted" | "Rejected"
  >("All");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter applications based on selected filter
  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter((app) => app.status === filter);
  }, [applications, filter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  // Format date function
  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-900 text-green-100 hover:bg-green-800";
      case "rejected":
        return "bg-red-900 text-red-100 hover:bg-red-800";
      case "pending":
        return "bg-yellow-900 text-yellow-100 hover:bg-yellow-800";
      default:
        return "bg-gray-700 text-gray-100 hover:bg-gray-600";
    }
  };

  // Get chances badge variant
  const getChancesVariant = (score: number | null) => {
    if (!score) return "bg-gray-700 text-gray-100";
    if (score >= 80) return "bg-green-900 text-green-100";
    if (score >= 60) return "bg-yellow-900 text-yellow-100";
    return "bg-red-900 text-red-100";
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 5;

    if (showEllipsis) {
      // Show first page
      items.push(1);

      if (currentPage > 3) {
        items.push("ellipsis1");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!items.includes(i)) {
          items.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        items.push("ellipsis2");
      }

      // Show last page
      if (totalPages > 1 && !items.includes(totalPages)) {
        items.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    }

    return items;
  };

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header Section */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {role === "candidate" ? " My Career Journey" : "Build Your Team"}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            {role === "candidate"
              ? "Track your job applications and career progress."
              : "Manage applications and find the right talent faster"}
          </p>
        </div>
      </section>

      <Separator className="bg-gray-800" />

      {/* Filter and Content Section */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Filter Section */}
          <div className="relative mb-10">
            <div className="relative bg-black border border-white/10 rounded-2xl p-6 shadow-xl">
              {/* header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Filter Applications
                  </h3>
                  <p className="text-sm text-gray-400">
                    {filteredApplications.length} of {applications.length}{" "}
                    applications
                  </p>
                </div>
                <div className="text-xs text-gray-500 mt-2 sm:mt-0 bg-white/5 px-3 py-1 rounded-full">
                  Page {currentPage} of {totalPages || 1}
                </div>
              </div>

              {/* filter buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["All", "Pending", "Accepted", "Rejected"] as const).map(
                  (filterOption) => {
                    const count =
                      filterOption === "All"
                        ? applications.length
                        : applications.filter(
                            (app) => app.status === filterOption
                          ).length;

                    const isActive = filter === filterOption;

                    return (
                      <button
                        key={filterOption}
                        onClick={() => {
                          setFilter(filterOption);
                          setCurrentPage(1);
                        }}
                        className={`
              relative rounded-xl px-5 py-4 transition-all duration-300
              border text-left
              ${
                isActive
                  ? "bg-white text-black border-white shadow-lg"
                  : "bg-zinc-950 border-white/10 text-gray-300 hover:bg-zinc-900 hover:border-white/20"
              }
            `}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`text-xl font-semibold ${
                              isActive ? "text-black" : "text-white"
                            }`}
                          >
                            {count}
                          </span>
                          <span
                            className={`text-xs uppercase tracking-wide ${
                              isActive ? "text-gray-700" : "text-gray-400"
                            }`}
                          >
                            {filterOption}
                          </span>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Unified Table View for All Devices */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-transparent to-gray-800/10 rounded-xl blur-lg"></div>
            <div className="relative bg-[#0f0f0f] border border-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-sm z-10 border-b border-gray-800/50">
                    <TableRow className="border-gray-800/50 hover:bg-transparent">
                      <TableHead className="text-gray-200 font-semibold text-center w-12 md:w-16 text-xs md:text-sm px-2 md:px-4">
                        #
                      </TableHead>
                      <TableHead className="text-gray-200 font-semibold min-w-[160px] md:min-w-[200px] text-xs md:text-sm px-2 md:px-4">
                        Job Title
                      </TableHead>
                      <TableHead className="text-gray-200 font-semibold min-w-[120px] md:min-w-[150px] text-xs md:text-sm px-2 md:px-4">
                        Company
                      </TableHead>
                      <TableHead className="text-gray-200 font-semibold min-w-[100px] md:min-w-[120px] text-xs md:text-sm px-2 md:px-4">
                        Status
                      </TableHead>
                      <TableHead className="text-gray-200 font-semibold min-w-[80px] md:min-w-[100px] text-xs md:text-sm px-2 md:px-4">
                        Chances
                      </TableHead>
                      <TableHead className="text-gray-200 font-semibold min-w-[100px] md:min-w-[120px] text-xs md:text-sm px-2 md:px-4">
                        Applied Date
                      </TableHead>
                      <TableHead className="text-gray-200 font-semibold text-center min-w-[160px] md:min-w-[200px] text-xs md:text-sm px-2 md:px-4">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentApplications.length > 0 ? (
                      currentApplications.map((application, index) => (
                        <TableRow
                          key={application.id}
                          className="border-gray-800/50 hover:bg-gray-900/30 transition-colors duration-200"
                        >
                          <TableCell className="text-gray-300 text-center text-xs md:text-sm px-2 md:px-4">
                            {startIndex + index + 1}
                          </TableCell>
                          <TableCell className="font-semibold text-white text-xs md:text-sm px-2 md:px-4">
                            <div className="max-w-[140px] md:max-w-[200px] truncate">
                              {application.job.jobTitle}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 text-xs md:text-sm px-2 md:px-4">
                            <div className="max-w-[100px] md:max-w-[150px] truncate">
                              {application.job.companyName || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="px-2 md:px-4">
                            <Badge
                              className={`${getStatusVariant(application.status || "")} text-xs`}
                            >
                              {application.status || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-2 md:px-4">
                            <Badge
                              className={`${getChancesVariant(
                                application.interviewScore
                              )} text-xs`}
                            >
                              {application.interviewScore
                                ? `${application.interviewScore}%`
                                : "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300 text-xs md:text-sm px-2 md:px-4">
                            <div className="whitespace-nowrap">
                              {formatDate(application.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="px-2 md:px-4">
                            <div className="flex gap-1 md:gap-2 justify-center">
                              {/* View Job Button */}
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={loadingId === `job-${application.id}`} // disable when loading
                                className="bg-gray-800 cursor-pointer border-gray-700 text-gray-200 hover:bg-gray-700 text-xs px-2 md:px-3"
                                onClick={() => {
                                  setLoadingId(`job-${application.id}`);
                                  router.push(`jobs/${application.jobId}`);
                                }}
                              >
                                {loadingId === `job-${application.id}` ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3 md:mr-1" />
                                    <span className="hidden md:inline">
                                      View Job
                                    </span>
                                  </>
                                )}
                              </Button>

                              {/* Analysis Button */}
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={
                                  loadingId === `analysis-${application.id}`
                                }
                                className="bg-gray-800 cursor-pointer border-gray-700 text-gray-200 hover:bg-gray-700 text-xs px-2 md:px-3"
                                onClick={() => {
                                  setLoadingId(`analysis-${application.id}`);

                                  if (role === "candidate") {
                                    router.push(
                                      `/application/${application.id}/interview/result`
                                    );
                                  } else {
                                    router.push(
                                      `application/${application.id}`
                                    );
                                  }
                                }}
                              >
                                {loadingId === `analysis-${application.id}` ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <>
                                    <FileText className="w-3 h-3 md:mr-1" />
                                    <span className="hidden md:inline">
                                      Analysis
                                    </span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-12 text-gray-400"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-8 h-8 text-gray-600" />
                            <p className="text-base">
                              No applications found for the selected filter.
                            </p>
                            <p className="text-sm text-gray-500">
                              Try changing your filter or apply to some jobs!
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 via-transparent to-gray-800/20 rounded-xl blur-lg"></div>
                <Pagination>
                  <PaginationContent className="relative bg-[#0f0f0f] border border-gray-800/50 rounded-xl p-2 backdrop-blur-sm">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        className={`
                          transition-all duration-200 rounded-lg
                          ${
                            currentPage === 1
                              ? "pointer-events-none opacity-40 cursor-not-allowed"
                              : "hover:bg-gray-800/70 text-gray-200 hover:text-white transform hover:scale-105"
                          }
                        `}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                      />
                    </PaginationItem>

                    {getPaginationItems().map((item, index) => (
                      <PaginationItem key={index}>
                        {item === "ellipsis1" || item === "ellipsis2" ? (
                          <PaginationEllipsis className="text-gray-500" />
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={currentPage === item}
                            className={`
                              transition-all duration-200 rounded-lg transform hover:scale-105
                              ${
                                currentPage === item
                                  ? "bg-white text-white hover:bg-gray-100 shadow-lg shadow-white/20 font-semibold"
                                  : "hover:bg-gray-800/70 text-gray-200 hover:text-white"
                              }
                            `}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(item as number);
                            }}
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        className={`
                          transition-all duration-200 rounded-lg
                          ${
                            currentPage === totalPages
                              ? "pointer-events-none opacity-40 cursor-not-allowed"
                              : "hover:bg-gray-800/70 text-gray-200 hover:text-white transform hover:scale-105"
                          }
                        `}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}

          {/* Enhanced Results Summary */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] border border-gray-800/50 rounded-xl backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">
                Showing{" "}
                <span className="text-white font-semibold">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="text-white font-semibold">
                  {Math.min(endIndex, filteredApplications.length)}
                </span>{" "}
                of{" "}
                <span className="text-white font-semibold">
                  {filteredApplications.length}
                </span>{" "}
                applications
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationUI;
