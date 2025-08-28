"use client";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, Star } from "lucide-react";

const candidatePlans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Basic profile creation",
      "Apply to 5 jobs per month",
      "Basic skill assessments",
      "Standard resume templates",
      "Email support",
    ],
    popular: false,
    buttonText: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Accelerate your job search",
    features: [
      "AI-powered resume optimization",
      "Unlimited job applications",
      "Advanced skill assessments",
      "Premium resume templates",
      "AI interview preparation",
      "Priority support",
      "Job match notifications",
    ],
    popular: true,
    buttonText: "Start Pro Trial",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$39",
    period: "per month",
    description: "Maximum career acceleration",
    features: [
      "Everything in Pro",
      "1-on-1 career coaching",
      "Custom career roadmap",
      "Salary negotiation support",
      "LinkedIn profile optimization",
      "Direct recruiter connections",
      "24/7 priority support",
    ],
    popular: false,
    buttonText: "Go Premium",
  },
];

const recruiterPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$99",
    period: "per month",
    description: "For small teams and startups",
    features: [
      "Post up to 5 jobs",
      "Access to candidate database",
      "Basic screening tools",
      "Email support",
      "Standard analytics",
    ],
    popular: false,
    buttonText: "Start Hiring",
  },
  {
    id: "professional",
    name: "Professional",
    price: "$299",
    period: "per month",
    description: "For growing companies",
    features: [
      "Post unlimited jobs",
      "AI-powered candidate matching",
      "Advanced screening & assessments",
      "Interview scheduling tools",
      "Team collaboration features",
      "Advanced analytics & reporting",
      "Priority support",
    ],
    popular: true,
    buttonText: "Start Pro Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced security features",
      "Custom reporting",
      "API access",
      "24/7 phone support",
    ],
    popular: false,
    buttonText: "Contact Sales",
  },
];

const Pricing = () => {
  const [role, setRole] = useState("Candidate");
  const currentPlans = role === "Candidate" ? candidatePlans : recruiterPlans;

  return (
    <div id="pricing">
      <div className="relative bg-black w-full flex items-center flex-col justify-center py-16 overflow-hidden">
        {/* Animated Background Orbs with golden touch */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Content with relative positioning */}
        <div className="relative z-10 w-full flex items-center flex-col justify-center">
          {/* Enhanced Badge */}
          <Badge className="px-5 py-3 rounded-3xl font-bold mb-6">
            <span className="w-3 h-3 rounded-full bg-[#94725d] mr-2 animate-pulse"></span>
            Pricing
          </Badge>
          {/* Role Selector */}
          <div className="flex items-center bg-black/20 rounded-full p-2 mb-6 border border-white/10 backdrop-blur-sm">
            <div
              onClick={() => setRole("Candidate")}
              className={`px-6 py-3 rounded-full cursor-pointer transition-all duration-300 ${
                role === "Candidate"
                  ? "bg-gradient-to-r from-[#080808] to-[#b8956d] text-white font-semibold shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Candidate
            </div>
            <div
              onClick={() => setRole("Recruiter")}
              className={`px-6 py-3 rounded-full cursor-pointer transition-all duration-300 ${
                role === "Recruiter"
                  ? "bg-gradient-to-r from-[#080808] to-[#b8956d] text-white font-semibold shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Recruiter
            </div>
          </div>
          {/* Pricing Cards */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                {role === "Candidate"
                  ? "Choose Your Plan"
                  : "Find the Right Solution"}
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {role === "Candidate"
                  ? "Select a plan that fits your career goals and budget"
                  : "Scalable pricing for teams of all sizes"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-black/20 rounded-2xl p-8  border transition-all duration-300 hover:scale-105 flex flex-col h-full ${
                    plan.popular
                      ? "border-[#8a6956] shadow-lg shadow-[#8a6956]"
                      : "border-gray-700 hover:border-[#8a6956]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-[#8a6956] to-[#080808] text-white px-4 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-300"
                      >
                        <Check className="w-5 h-5 text-[#8a6956] mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 cursor-pointer rounded-xl font-semibold transition-all duration-300 h-12 mt-auto ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#080808] to-[#8a6956] text-white hover:from-[#8a6956] hover:to-[#080808] shadow-lg hover:shadow-xl"
                        : "bg-white text-black hover:bg-amber-100 border border-gray-300"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;