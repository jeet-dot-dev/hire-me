import ErrorAnimation from "@/components/scaleton-loaders/ErrorAnimation";
import { prisma } from "@/lib/prisma";
import InterviewResult from "./InterviewResult";


type Props = {
  params: {
    id: string;
  };
};

const page = async({params}:Props) => {
   const {id} = await params ;
   if (!id) {
    return (
      <ErrorAnimation msg="We couldn’t find this application. Please check the link or go back to your dashboard." />
    );
  }

   const application = await prisma.jobApplication.findUnique({ where: { id } });

  if (!application) {
    return (
      <ErrorAnimation msg="We couldn’t find this application. Please check the link or go back to your dashboard." />
    );
  }


  return (
    <>
     <InterviewResult application={application}/>
    </>
  )
}

export default page
