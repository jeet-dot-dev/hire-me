"use client";
import { RecruiterJobCompProp } from "@/components/custom/recruiter/RecruiterJobComp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobCardUi from "./jobCardUi";
import {
  AlignJustify,
  SquareMenu,
  Search,
  Funnel,
  Check,
  MapPin,
  Layers,
  Briefcase,
  Calendar,
  SortAsc,
  SortDesc,
  Loader,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const JobCard = ({ jobs, role }: RecruiterJobCompProp) => {
  const [isList, setIsList] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const filterOptions = [
    {
      label: "None",
      value: "None",
      icon: <Funnel className="w-4 h-4 text-white" />,
    },
    {
      label: "Status",
      value: "Status",
      icon: <Loader className="w-4 h-4 text-white" />,
    },
    {
      label: "A-Z (Job Title)",
      value: "titleAsc",
      icon: <SortAsc className="w-4 h-4 text-white" />,
    },
    {
      label: "Z-A (Job Title)",
      value: "titleDesc",
      icon: <SortDesc className="w-4 h-4  text-white " />,
    },
    {
      label: "Location",
      value: "location",
      icon: <MapPin className="w-4 h-4 text-white " />,
    },
    {
      label: "Level",
      value: "level",
      icon: <Layers className="w-4 h-4 text-white " />,
    },
    {
      label: "Type",
      value: "type",
      icon: <Briefcase className="w-4 h-4 text-white " />,
    },
    {
      label: "Expire Date",
      value: "expire",
      icon: <Calendar className="w-4 h-4 text-white" />,
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  const jobData = jobs;
  const userRole = role || "RECRUITER";
  const router = useRouter()

  const handleSelect = (option: (typeof filterOptions)[0]) => {
    setSelectedFilter(option);
    // optionally trigger actual filtering/sorting logic here
  };

const handleRefresh = async () => {
  setIsRefreshing(true);

  try {
    router.refresh(); // Re-fetch server data
  } catch (error) {
    console.error(error);
    toast.error("Failed to refresh jobs.");
  } finally {
    // 👇 Artificial delay of 1.5 seconds for visible feedback
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }
};


  return (
    <div className="dark">
      <div className="space-y-4 bg-black/10 rounded-2xl min-h-screen p-6">
        <div className="flex justify-between items-center">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input type="text" placeholder="Search by Job Title" />

            <Button
              type="submit"
              variant="secondary"
              className="cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-5">
            
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={handleRefresh}
               disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="bg-[#262626] cursor-pointer px-3 py-1.5 rounded-md text-white flex items-center gap-2">
                <Funnel className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {" "}
                  {selectedFilter.label === "None"
                    ? "Filter"
                    : selectedFilter.label}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-[#212121] text-white ">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className="flex items-center gap-2 focus:bg-white/20 hover:bg-white/10 text-white hover:text-white focus:text-white cursor-pointer"
                  >
                    {option.icon}
                    <span className="flex-grow text-sm">{option.label}</span>
                    {selectedFilter.value === option.value && (
                      <Check className="w-4 h-4 text-white ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="secondary"
              onClick={() => setIsList(!isList)}
              className="cursor-pointer"
            >
              {isList ? (
                <AlignJustify className="w-4 h-4 mr-2" />
              ) : (
                <SquareMenu className="w-4 h-4 mr-2" />
              )}
              {isList ? "List View" : "Grid View"}
            </Button>
          </div>
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
              {jobData.map((job, index) => (
                <JobCardUi
                  key={job.id || index}
                  job={job}
                  role={userRole}
                  styleType={isList}
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
            jobData.map((job, index) => (
              <JobCardUi
                key={job.id || index}
                job={job}
                role={userRole}
                styleType={isList}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
