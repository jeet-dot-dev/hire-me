import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import Tablet from "@/components/landing/Tablet";
import Testimonials from "@/components/landing/Testimonials";

import React from "react";

const page = () => {
  return (
    <div className="w-full min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Testimonials />
      <Tablet />
      <Footer />
    </div>
  );
};

export default page;
