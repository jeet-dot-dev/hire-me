import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import JobStatusChange from "@/components/features/recruiter/JobStatusChange";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link2, Eye, Edit, Trash2, Heart, Send } from "lucide-react";
import { JobFormDataUI } from "@/zod/job";
import DeleteJobDialog from "@/components/features/recruiter/DeleteJobDialog";
import ShareJobDialog from "./share/ShareJobDialog";

type Props = {
  job: JobFormDataUI;
  role: "RECRUITER" | "CANDIDATE";
  jobStatus: boolean | undefined;
  daysRemaining: number;
  isExpired: boolean;
  formatDate: (date: string) => string;
  handleWishlist: () => void;
  isWishlisted: boolean;
  index: number;
};

const JobTableRow = ({
  job,
  role,
  jobStatus,
  daysRemaining,
  isExpired,
  formatDate,
  handleWishlist,
  isWishlisted,
  index,
}: Props) => {
  const router = useRouter();
  return (
    <TableRow className="transition-colors border-gray-700/50">
      <TableCell className="text-gray-300 text-center w-12">
        {(index || 0) + 1}
      </TableCell>
      <TableCell className="font-semibold text-white max-w-[200px] truncate">
        {job.jobTitle}
      </TableCell>

      <TableCell className="text-gray-300 max-w-[150px] truncate">
        {job.companyName || "N/A"}
      </TableCell>

      <TableCell className="text-gray-300 max-w-[150px] truncate">
        {job.location || "N/A"}
      </TableCell>

      <TableCell className="min-w-[100px]">
        <Badge variant="secondary" className="bg-transparent text-xs">
          {job.jobLevel
            ? job.jobLevel.charAt(0).toUpperCase() +
              job.jobLevel.slice(1).toLowerCase()
            : "N/A"}
        </Badge>
      </TableCell>

      <TableCell className="min-w-[100px]">
        <Badge variant="secondary" className="bg-transparent text-xs">
          {job.jobType || "N/A"}
        </Badge>
      </TableCell>

      <TableCell className="text-center min-w-[120px]">
        {job.expireAt ? (
          <div className="flex flex-col items-center">
            <span
              className={`text-sm ${
                isExpired
                  ? "text-red-400"
                  : daysRemaining <= 7
                    ? "text-yellow-400"
                    : "text-gray-300"
              }`}
            >
              {formatDate(job.expireAt ? new Date(job.expireAt).toISOString() : "")}
            </span>
            <span
              className={`text-xs ${
                isExpired
                  ? "text-red-400"
                  : daysRemaining <= 7
                    ? "text-yellow-400"
                    : "text-gray-400"
              }`}
            >
              {isExpired ? "Expired" : `${daysRemaining} days`}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400">N/A</span>
            <span className="text-xs text-gray-500">No expiry date</span>
          </div>
        )}
      </TableCell>

      <TableCell className="min-w-[100px]">
        <JobStatusChange status={jobStatus} id={job.id} />
      </TableCell>

      <TooltipProvider>
        <TableCell className="min-w-[200px]">
          <div className="flex items-center justify-center gap-2">
            {role === "RECRUITER" ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ShareJobDialog jobId={job.id}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="icon-btn text-white hover:text-white hover:bg-gray-700/50 cursor-pointer"
                      >
                        <Link2 className="w-4 h-4" />
                      </Button>
                    </ShareJobDialog>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="icon-btn text-white hover:text-white hover:bg-gray-700/50 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/${role.toLocaleLowerCase()}/dashboard/jobs/${job.id}`
                        )
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="icon-btn text-white hover:text-white hover:bg-gray-700/50 cursor-pointer"
                      onClick={() =>
                        router.push(`/recruiter/dashboard/jobs/${job.id}/edit`)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <DeleteJobDialog jobTitle={job.jobTitle} jobId={job.id}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="icon-btn text-white hover:text-white hover:bg-gray-700/50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DeleteJobDialog>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:bg-blue-500/10"
                      onClick={() =>
                        router.push(
                          `/${role.toLocaleLowerCase()}/dashboard/jobs/${job.id}`
                        )
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleWishlist}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Heart
                        className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                      disabled={isExpired}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Apply
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Apply for Job</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </TableCell>
      </TooltipProvider>
    </TableRow>
  );
};

export default JobTableRow;
