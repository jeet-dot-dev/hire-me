import React from 'react'
import { CandidateJobCompProp } from './CandidateJobComp'
import { Separator } from '@/components/ui/separator'
import RecomendedJobsServerComp from './RecomendedJobsServerComp'



const CandidateJobListings = ({jobs,role,recentJobs,recommendedJobs}:CandidateJobCompProp) => {
  return (
    <div className='w-full px-4'>
        <section className="recomended">
            <p className='text-lg text-white'>Recomended Jobs For You </p>
            <Separator/>
            <RecomendedJobsServerComp jobs={recommendedJobs} />
        </section>
      
    </div>
  )
}

export default CandidateJobListings
