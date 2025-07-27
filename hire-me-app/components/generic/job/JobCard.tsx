"use client";
import { RecruiterJobCompProp } from "@/components/custom/recruiter/RecruiterJobComp";
import { Input } from "@/components/ui/input";
import JobCardUi from "./jobCardUi";
import {
  Funnel,
  Check,
  MapPin,
  Layers,
  Briefcase,
  SortAsc,
  SortDesc,
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

const JobCard = ({ jobs, role }: RecruiterJobCompProp) => {
  const [isList, setIsList] = useState(true);
  const [allJobs, setAllJobs] = useState<JobFormDataUI[]>(jobs);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchMoreJobs = useCallback(async () => {
    const lastJob = allJobs[allJobs.length - 1];
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
      setAllJobs((prev) => [...prev, ...newJobs]);
    } catch (err) {
      console.error("Error fetching more jobs:", err);
    }
  }, [allJobs]);

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

  const iconMap = {
    SortAsc,
    SortDesc,
    MapPin,
    Layers,
    Briefcase,
  } as const;

  const filterOptions = [
    {
      label: "Job Title",
      value: "titleAsc",
      icon: "SortAsc",
      placeholder: "e.g. Backend Developer, Python Wizard, Frontend Ninja",
    },
    {
      label: "Company Name",
      value: "titleDesc",
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
      label: "Level",
      value: "level",
      icon: "Layers",
      placeholder: "e.g. Intern, Mid-Level, Senior, Tech Lead",
    },
    {
      label: "Type",
      value: "type",
      icon: "Briefcase",
      placeholder: "e.g. Remote, Hybrid, On-site",
    },
    {
      label: "Skills",
      value: "skills",
      icon: "Briefcase",
      placeholder: "e.g. React, Node.js, Python, SQL",
    },
  ] as const;

  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const userRole = role || "RECRUITER";
  //const router = useRouter();

  const handleSelect = (option: any) => {
    setSelectedFilter(option);
    // optionally trigger actual filtering/sorting logic here
  };

  return (
    <>
      <div className="dark">
        <div className="space-y-4 bg-black/10 rounded-2xl min-h-screen p-6">
          <div className="header flex w-full max-w-full items-center gap-4 ">
            <Input
              type="text"
              placeholder={selectedFilter.placeholder}
              className="max-w-[90%] text-white"
            />

            <DropdownMenu>
              <DropdownMenuTrigger className="bg-[#262626] cursor-pointer px-3 py-1.5 rounded-md text-white flex items-center gap-2">
                <Funnel className="w-4 h-4" />
                <span className="text-sm font-semibold whitespace-nowrap overflow-hidden py-0.5 px-1 text-ellipsis">
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
                  {/* Scrollable table container with max height */}
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
                          {allJobs.map((job, index) => (
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

                {/* Scroll hint for small screens */}
                <p className="text-xs text-gray-400 mt-2 text-center lg:hidden">
                  ← Scroll horizontally to view all columns →
                </p>
              </div>
            )}

            {!isList &&
              allJobs.map((job, index) => (
                <JobCardUi
                  key={job.id || index}
                  job={job}
                  role={userRole}
                  styleType={isList}
                  index={index}
                />
              ))}
          </div>
        </div>
      </div>
      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 mt-4 flex items-center justify-center"
        >
          <span className="text-muted-foreground text-xs animate-pulse">
            Loading more jobs...
          </span>
        </div>
      )}
    </>
  );
};

export default JobCard;
