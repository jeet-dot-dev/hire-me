import ErrorAnimation from "@/components/loaders/ErrorAnimation";
import { prisma } from "@/lib/prisma";
import { ApplicationTypeFull } from "@/types/applicationType";
import InterviewResult from "./InterviewResult";

type TranscriptMessage = {
  role: "recruiter" | "candidate";
  text: string;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const page = async({params}:Props) => {
   const {id} = await params ;
   if (!id) {
    return (
      <ErrorAnimation msg="We couldn't find this application. Please check the link or go back to your dashboard." />
    );
  }

   const application = await prisma.jobApplication.findUnique({ where: { id } });

  if (!application) {
    return (
      <ErrorAnimation msg="We couldn't find this application. Please check the link or go back to your dashboard." />
    );
  }

  // Type cast the application to match TypeScript types
  const typedApplication: ApplicationTypeFull = {
    ...application,
    transcript: application.transcript as TranscriptMessage[] | null,
  };

  return (
    <>
     <InterviewResult application={typedApplication}/>
    </>
  )
}

export default page;
