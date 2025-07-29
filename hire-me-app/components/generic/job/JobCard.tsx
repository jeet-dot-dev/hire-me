"use client";

import { RecruiterJobCompProp } from "@/components/custom/recruiter/RecruiterJobComp";
import { Input } from "@/components/ui/input";
import JobCardUi from "./jobCardUi";
import {
  Funnel,
  Check,
  MapPin,
  LayoutGrid,
  List,
  Briefcase,
  SortAsc,
  SortDesc,
  Tag,
  Loader,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JobFormDataUI } from "@/zod/job";
import axios from "axios";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import JobCardLoader from "@/components/scaleton-loaders/JobCardLoader";

const filterOptions = [
  {
    label: "Job Title",
    value: "title",
    icon: "SortAsc",
    placeholder: "e.g. Backend Developer, Python Wizard, Frontend Ninja",
  },
  {
    label: "Company Name",
    value: "company",
    icon: "SortDesc",
    placeholder: "e.g. Google, Infosys, StartupX",
  },
  {
    label: "Location",
    value: "location",
    icon: "MapPin",
    placeholder: "e.g. Remote, Bangalore, New York",
  },
  {
    label: "Skills",
    value: "skills",
    icon: "Briefcase",
    placeholder: "e.g. React, Node.js, Python, SQL",
  },
  {
    label: "Tags",
    value: "tags",
    icon: "Tag",
    placeholder: "e.g. #React, #Node.js, #Remote, #SQL",
  },
] as const;

const iconMap = {
  SortAsc,
  SortDesc,
  MapPin,
  Briefcase,
  Tag,
} as const;

const JobCard = ({ jobs, role }: RecruiterJobCompProp) => {
  const [isList, setIsList] = useState(false);
  const [originalJobs, setOriginalJobs] = useState<JobFormDataUI[]>(jobs);
  const [visibleJobs, setVisibleJobs] = useState<JobFormDataUI[]>(jobs);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userRole = role || "RECRUITER";

  const fetchMoreJobs = useCallback(async () => {
    const lastJob = originalJobs[originalJobs.length - 1];
    if (!lastJob) return;

    try {
      const res = await axios.get("/api/recruiter/job/load-more", {
        params: { cursor: lastJob.createdAt },
      });

      const newJobs: JobFormDataUI[] = res.data;
      if (newJobs.length === 0) {
        setHasMore(false);
        return;
      }

      const updated = [...originalJobs, ...newJobs];
      setOriginalJobs(updated);
      setVisibleJobs(updated);
    } catch (err) {
      console.error("Error fetching more jobs:", err);
    }
  }, [originalJobs]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreJobs();
        }
      },
      { threshold: 1 }
    );

    observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [fetchMoreJobs, hasMore]);

  const handleSelect = (option: (typeof filterOptions)[0]) => {
    setSelectedFilter(option);
    setSearchTerm("");
  };

  const fetchJobs = useCallback(() => {
    const trimmed = searchTerm.trim();
    if (trimmed === "") {
      setVisibleJobs(originalJobs);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `/api/recruiter/job/search?query=${trimmed}&filterBy=${selectedFilter.value}`
        );
        setVisibleJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs", error);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [searchTerm, selectedFilter, originalJobs]);

  useDebouncedEffect(fetchJobs, 1000);

  return (
    <>
      <div className="dark">
        <div className="space-y-4 bg-black/10 rounded-2xl min-h-screen p-6">
          <div className="header flex w-full max-w-full items-center gap-4 ">
            <div className="relative w-full max-w-[90%] flex items-center gap-2 bg-[#1a1a1a]  rounded-md px-3 py-2">
              {/* Search Input */}
              <Input
                type="text"
                placeholder={selectedFilter.placeholder}
                className="flex-1 bg-transparent border-none outline-none shadow-none text-white placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (value.trim() === "") {
                    setVisibleJobs(originalJobs);
                  }
                }}
              />

              {/* Clear Button */}
              {searchTerm && (
                <button
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                  onClick={() => {
                    setSearchTerm("");
                    setVisibleJobs(originalJobs);
                  }}
                >
                  ✕
                </button>
              )}

              {/* View Toggle Icon */}
              <button
                className="ml-2 text-gray-300 hover:text-white transition cursor-pointer"
                onClick={() => setIsList(!isList)}
              >
                {isList ? (
                  <List className="w-5 h-5" />
                ) : (
                  <LayoutGrid className="w-5 h-5" />
                )}
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="bg-[#262626] cursor-pointer px-3 py-1.5 rounded-md text-white flex items-center gap-2">
                <Funnel className="w-4 h-4" />
                <span className="text-sm font-semibold whitespace-nowrap overflow-hidden py-2 px-1 text-ellipsis">
                  {selectedFilter.label}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent className=" bg-[#212121] text-white">
                {filterOptions.map((option) => {
                  const Icon = iconMap[option.icon];
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className="flex items-center gap-2 focus:bg-white/20 hover:bg-white/10 cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-white" />
                      <span className="flex-grow text-sm">{option.label}</span>
                      {selectedFilter.value === option.value && (
                        <Check className="w-4 h-4 text-white ml-auto" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
           <JobCardLoader/>
          ) : visibleJobs.length === 0 ? (
            <p className="text-center text-muted-foreground">No jobs found</p>
          ) : (
            <div
              className={
                isList
                  ? "space-y-0"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              }
            >
              {isList && (
                <div className="w-full">
                  <div className="border border-gray-700/50 rounded-lg bg-black/30 backdrop-blur-sm">
                    <div className="max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar">
                      <div className="min-w-[1200px]">
                        <Table>
                          <TableHeader className="sticky top-0 bg-black/30 backdrop-blur-sm z-10">
                            <TableRow className="border-gray-700/50 hover:bg-transparent">
                              <TableHead className="text-gray-200 font-semibold text-center w-12">
                                #
                              </TableHead>
                              <TableHead className="text-gray-200 text-left font-semibold min-w-[200px] ml-2">
                                Job Title
                              </TableHead>
                              <TableHead className="text-gray-200 font-semibold min-w-[150px]">
                                Company
                              </TableHead>
                              <TableHead className="text-gray-200 font-semibold min-w-[150px]">
                                Location
                              </TableHead>
                              <TableHead className="text-gray-200 font-semibold min-w-[100px]">
                                Level
                              </TableHead>
                              <TableHead className="text-gray-200 font-semibold min-w-[100px]">
                                Type
                              </TableHead>
                              <TableHead className="text-gray-200 font-semibold text-center min-w-[120px]">
                                Expire Date
                              </TableHead>
                              <TableHead className="text-gray-200 font-semibold min-w-[100px]">
                                Status
                              </TableHead>
                              <TableHead className="text-gray-200 font-semibold text-center min-w-[200px]">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {visibleJobs.map((job, index) => (
                              <JobCardUi
                                key={job.id || index}
                                job={job}
                                role={userRole}
                                styleType={isList}
                                index={index}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center lg:hidden">
                    ← Scroll horizontally to view all columns →
                  </p>
                </div>
              )}

              {!isList &&
                visibleJobs.map((job, index) => (
                  <JobCardUi
                    key={job.id || index}
                    job={job}
                    role={userRole}
                    styleType={isList}
                    index={index}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 mt-4 flex items-center justify-center"
        >
        <div className="flex items-center gap-2 text-sm text-white animate-pulse">
           <Loader className="w-4 h-4 animate-spin text-white" />
           <span>Loading more jobs...</span>
         </div>
        </div>
      )}
    </>
  );
};

export default JobCard;
