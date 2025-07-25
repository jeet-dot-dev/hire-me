import React from 'react';
import { CandidateJobCompProp } from './CandidateJobComp';
import { Separator } from '@/components/ui/separator';
import RecomendedJobCardRenderComp from './RecomendedJobCardRenderComp';

const Section = ({
  title,
  jobs,
  role,
  wishListedJobs,
  isWishlistPage
}: {
  title: string;
  jobs: CandidateJobCompProp["jobs"];
  role: CandidateJobCompProp["role"];
  wishListedJobs:string[];
  isWishlistPage:boolean

}) => {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {!isWishlistPage && <div>
        <p className="text-lg text-white">{title}</p>
        <Separator />
      </div> }
      <RecomendedJobCardRenderComp jobs={jobs} role={role} wishListedJobs={wishListedJobs} />
    </div>
  );
};

const CandidateJobListings = ({
  jobs,
  role,
  recentJobs,
  recommendedJobs,
  wishListedJobs,
  isWishlistPage
}: CandidateJobCompProp) => {
  const noJobs =
    jobs.length === 0 &&
    recentJobs.length === 0 &&
    recommendedJobs.length === 0;

  return (
    <div className="w-full px-4">
      <section className="flex flex-col gap-6">
        <Section title="Recommended Jobs For You" jobs={recommendedJobs} role={role} wishListedJobs={wishListedJobs} isWishlistPage={isWishlistPage} />
        <Section title="Recently Posted Jobs" jobs={recentJobs} role={role} wishListedJobs={wishListedJobs} isWishlistPage={isWishlistPage} />
        <Section title="Explore Jobs" jobs={jobs} role={role} wishListedJobs={wishListedJobs} isWishlistPage={isWishlistPage} />

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
