"use client";

import React, { useCallback,  useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Funnel,
  Check,
  MapPin,
  Briefcase,
  SortAsc,
  SortDesc,
  Tag,
} from "lucide-react";
import type { JobFormDataUI } from "@/zod/job";
import CandidateJobListings from "./CandidateJobListings";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import axios from "axios";
import JobCardLoader from "@/components/loaders/JobCardLoader";

export type CandidateJobCompProp = {
  jobs: JobFormDataUI[];
  role: "RECRUITER" | "CANDIDATE";
  recentJobs: JobFormDataUI[];
  recommendedJobs: JobFormDataUI[];
  wishListedJobs: string[];
  isWishlistPage: boolean;
};

// Map icons to their respective Lucide components
const iconMap = {
  SortAsc,
  SortDesc,
  MapPin,
  Briefcase,
  Tag,
} as const;

export const filterOptions = [
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

const CandidateJobComp = ({
  jobs,
  role,
  recommendedJobs,
  recentJobs,
  wishListedJobs,
  isWishlistPage,
}: CandidateJobCompProp) => {
  const [selectedFilter, setSelectedFilter] = useState<typeof filterOptions[number]>(filterOptions[0]);
  const [isFilterOn, SetIsFilterOn] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<JobFormDataUI[]>(jobs);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (option: typeof filterOptions[number]) => {
    setSelectedFilter(option);
    setSearchTerm("");
    SetIsFilterOn(false);
  };

  const fetchJobs = useCallback(() => {
    const trimmed = searchTerm.trim();

    if (trimmed === "") {
      //console.log(jobs);
      setFilteredJobs(jobs); // ✅ use original list
      SetIsFilterOn(false);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      SetIsFilterOn(true);
      try {
        const res = await axios.get(
          `/api/jobs/search?query=${trimmed}&filterBy=${selectedFilter.value}`
        );
        setFilteredJobs(res.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs", error);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [searchTerm, selectedFilter, jobs]);

  useDebouncedEffect(fetchJobs, 1000);


  // useEffect(() => {
  //   console.log("searchTerm:", searchTerm);
  //   console.log("isFilterOn:", isFilterOn);
  //   console.log("filteredJobs:", filteredJobs.length);
  //   console.log("jobs:", jobs.length);
  // }, [searchTerm, isFilterOn, filteredJobs, jobs]);

  return (
    <div className="dark">
      <div className="flex justify-between items-center w-full p-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-100">
            {isWishlistPage
              ? "  ✨ Wishlisted Roles"
              : "Fast-track your job hunt"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {isWishlistPage
              ? " Explore the roles you've handpicked as favorites"
              : "Effortlessly browse and apply to roles that suit you best"}
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex w-full max-w-full flex-col  gap-4 ">
        {!isWishlistPage && (
          <div className="header flex w-full max-w-full items-center gap-4 px-4">
            <div className="relative w-full max-w-[90%] text-white">
              <Input
                type="text"
                placeholder={selectedFilter.placeholder}
                className="pr-8 placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (value.trim() === "") {
                    setFilteredJobs(jobs); // reset
                    SetIsFilterOn(false);
                  }
                }}
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredJobs(jobs);
                    SetIsFilterOn(false);
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="bg-[#262626] cursor-pointer px-3 py-2 rounded-md text-muted-foreground flex items-center gap-2">
                <Funnel className="w-4 h-4" />
                <span className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
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
        )}
        <div className="main">
          {isLoading ? (
            <JobCardLoader />
          ) : isFilterOn && filteredJobs.length === 0 ? (
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-white font-semibold animate-pulse text-lg">
                Oops! No jobs found
              </p>
            </div>
          ) : (
            <CandidateJobListings
              jobs={filteredJobs}
              recommendedJobs={recommendedJobs}
              recentJobs={recentJobs}
              role={role}
              wishListedJobs={wishListedJobs}
              isWishlistPage={isWishlistPage}
              isFilterON={isFilterOn}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateJobComp;
