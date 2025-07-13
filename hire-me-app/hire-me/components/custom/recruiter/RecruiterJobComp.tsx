"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const RecruiterJobComp = () => {
    const router = useRouter()
  return (
    <div>
      <Button variant={'outline'} size={'lg'} className='cursor-pointer text-white ' onClick={()=>router.push("/recruiter/dashboard/jobs/create")}>Create Job</Button>
    </div>
  )
}

export default RecruiterJobComp
