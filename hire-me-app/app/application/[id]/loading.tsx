"use client";
import ResumeLoader from '@/components/loaders/ResumeLoader';
import React from 'react'
const msg=["⏳ Analyzing your resume..."," This may take a few minutes. Sit tight 🚀"]
const loading = () => {
  return (

     <ResumeLoader msg={msg}/>

  )
}

export default loading
