"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  Layers,
  Briefcase,
  SortAsc,
  SortDesc,
} from "lucide-react";
import type { JobFormDataUI } from "@/zod/job";
import CandidateJobListings from "./CandidateJobListings";

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

const CandidateJobComp = ({
  jobs,
  role,
  recommendedJobs,
  recentJobs,
  wishListedJobs,
  isWishlistPage,
}: CandidateJobCompProp) => {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  const handleSelect = (option: (typeof filterOptions)[0]) => {
    setSelectedFilter(option);
    // Optional: Trigger filtering logic
  };

  const router = useRouter();

  return (
    <div>
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
        <div className="header flex w-full max-w-full items-center gap-4 px-4">
          <Input
            type="text"
            placeholder={selectedFilter.placeholder}
            className="max-w-[90%]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger className="bg-[#262626] cursor-pointer px-3 py-1.5 rounded-md text-muted-foreground flex items-center gap-2">
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
        <div className="main">
          <CandidateJobListings
            jobs={jobs}
            recommendedJobs={recommendedJobs}
            recentJobs={recentJobs}
            role={role}
            wishListedJobs={wishListedJobs}
            isWishlistPage={isWishlistPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateJobComp;
