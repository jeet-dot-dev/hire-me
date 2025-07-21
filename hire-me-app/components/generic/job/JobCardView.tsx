import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  DollarSign,
  EllipsisVertical,
  Eye,
  Layers,
  Link,
  MapPin,
  Power,
  PowerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { JobFormDataUI } from "@/zod/job";
import { toast } from "sonner";

type Props = {
  job: JobFormDataUI;
  role: "RECRUITER" | "CANDIDATE";
  jobStatus: boolean | undefined;
  isExpired: boolean;
  daysRemaining: number;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (value: boolean) => void;
  confirmDeactivate: () => void;
  handleWishlist: () => void;
  isWishlisted: boolean;
};

const JobCardView = ({
  job,
  role,
  showConfirmDialog,
  setShowConfirmDialog,
  confirmDeactivate,
}: Props) => {
  return (
    <div className="w-full">
      <Card className="bg-[#0f0f0f] backdrop-blur-3xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group hover:bg-black/10">
        <CardHeader className="flex justify-between items-start max-h-[100px]">
          <CardTitle className="flex justify-start items-start flex-col gap-2">
            <p className="text-lg font-semibold">{job.jobTitle}</p>
            <p className="text-muted-foreground text-sm truncate">
              {job.companyName} Pvt.Lim
            </p>
          </CardTitle>

          {role === "RECRUITER" ? (
            <div className="flex items-start justify-end gap-2">
              {job.status ? (
                <Power
                  className="text-green-600 w-4 h-4 cursor-pointer"
                  onClick={() => toast.info("Please change your status in List view")}
                />
              ) : (
                <PowerOff
                  className="text-red-600 w-4 h-4 cursor-pointer"
                  onClick={() => toast.info("Please change your status in List view")}
                />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="w-4 h-4 cursor-pointer hover:text-white/60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#212121] text-white">
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Edit</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-2">
              <Bookmark />
              <BookmarkCheck />
              <Link />
            </div>
          )}
        </CardHeader>

        <CardContent className="flex flex-col justify-center items-start gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm truncate">{job.location}, {job.jobType}</span>
          </div>

          <div className="flex gap-10">
            {job.jobLevel && (
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {job.jobLevel.charAt(0).toUpperCase() + job.jobLevel.slice(1).toLowerCase()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{job.salary || "N/A"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 pt-2">
            {job.skillsRequired.slice(0, 4).map((skill, index) => (
              <Badge variant="secondary" key={index}>
                {skill.charAt(0).toUpperCase() + skill.slice(1)}
              </Badge>
            ))}
          </div>
        </CardContent>

        <Separator className="mt-2" />

        <CardFooter className="flex justify-between items-center">
  {job.expireAt ? (
    <div className="expire flex gap-2 justify-start items-center">
      <CalendarDays className="w-4 h-4 text-muted-foreground" />
      {new Date(job.expireAt) > new Date() ? (
        <span className="text-[12px] text-muted-foreground">
          Expires: {new Date(job.expireAt).toLocaleDateString()}
        </span>
      ) : (
        <Badge className="px-3 py-4" variant="destructive">
          Expired
        </Badge>
      )}
    </div>
  ) : (
    <div className="expire flex gap-2 justify-start items-center">
      <CalendarDays className="w-4 h-4 text-muted-foreground" />
      <span className="text-[12px] text-muted-foreground">Expires: N/A</span>
    </div>
  )}

  <div className="btns flex justify-end items-center gap-2">
    <Button className="cursor-pointer">
      <Eye />
      <span>View</span>
    </Button>
    <Button variant="outline" className="cursor-pointer">
      {role === "CANDIDATE" ? (
        "Apply"
      ) : (
        <span className="flex justify-center items-center gap-2">
          <Link className="w-3 h-3 text-muted-foreground" />
          Share
        </span>
      )}
    </Button>
  </div>
</CardFooter>

      </Card>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Confirm Deactivation</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to deactivate this job posting? This will make it invisible to candidates.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeactivate}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCardView;
