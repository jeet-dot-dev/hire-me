import React from "react";
import { Separator } from "@/components/ui/separator";
import RecomendedJobCardRenderComp from "./RecomendedJobCardRenderComp";
import { JobFormDataUI } from "@/zod/job";

 type CandidateJobListingsProp = {
  jobs: JobFormDataUI[];
  role: "RECRUITER" | "CANDIDATE";
  recentJobs: JobFormDataUI[];
  recommendedJobs: JobFormDataUI[];
  wishListedJobs: string[];
  isWishlistPage: boolean;
  isFilterON : boolean
  };

const Section = ({
  title,
  jobs,
  role,
  wishListedJobs,
  isWishlistPage,
  enableInfiniteScroll,
  isFilterON
}: {
  title: string;
  jobs: CandidateJobListingsProp["jobs"];
  role: CandidateJobListingsProp["role"];
  wishListedJobs: string[];
  isWishlistPage: boolean;
  enableInfiniteScroll: boolean;
  isFilterON : boolean
}) => {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {!isWishlistPage && (
        <div>
          <p className="text-lg text-white">{title}</p>
          <Separator />
        </div>
      )}
      <RecomendedJobCardRenderComp
        jobs={jobs}
        role={role}
        wishListedJobs={wishListedJobs}
        isWishlistPage={isWishlistPage}
        enableInfiniteScroll={enableInfiniteScroll}
        isFilterON={isFilterON}
      />
    </div>
  );
};

const CandidateJobListings = ({
  jobs,
  role,
  recentJobs,
  recommendedJobs,
  wishListedJobs,
  isWishlistPage,
  isFilterON
}: CandidateJobListingsProp) => {
  const noJobs =
    jobs.length === 0 &&
    recentJobs.length === 0 &&
    recommendedJobs.length === 0;

    //console.log ("CandidateJobListings",isFilterON)

  return (
    <div className="w-full px-4">
      <section className="flex flex-col gap-6">
       {!isFilterON && (
         <Section
          title="Recommended Jobs For You"
          jobs={recommendedJobs}
          role={role}
          wishListedJobs={wishListedJobs}
          isWishlistPage={isWishlistPage}
          enableInfiniteScroll={false}
          isFilterON={isFilterON}
        />
       )}
      {!isFilterON && (
          <Section
          title="Recently Posted Jobs"
          jobs={recentJobs}
          role={role}
          wishListedJobs={wishListedJobs}
          isWishlistPage={isWishlistPage}
          enableInfiniteScroll={false}
          isFilterON={isFilterON}
        />
      )}
        <Section
          title="Explore Jobs"
          jobs={jobs}
          role={role}
          wishListedJobs={wishListedJobs}
          isWishlistPage={isWishlistPage}
          enableInfiniteScroll={true}
          isFilterON={isFilterON}
        />

        {noJobs && (
          <div className="text-muted-foreground text-sm text-center pt-10">
            No jobs available right now.
          </div>
        )}
      </section>
    </div>
  );
};

export default CandidateJobListings;
