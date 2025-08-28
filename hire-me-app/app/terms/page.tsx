import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#94725d]/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#b8956d]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#765d52]/5 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto py-16 px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge className="px-5 py-3 rounded-3xl font-bold mb-6">
            <span className="w-3 h-3 rounded-full bg-[#94725d] mr-2 animate-pulse"></span>
            Legal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Terms of <span className="text-[#896a59]">Service</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our AI-powered recruitment platform.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700/30 shadow-2xl">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Agreement to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  By accessing and using our AI-powered recruitment platform, you agree to be bound by 
                  these Terms of Service and all applicable laws and regulations. These terms exist to 
                  satisfy authentication provider requirements and establish a clear understanding between 
                  you and our service.
                </p>
              </section>

              {/* Service Description */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Service Description
                </h2>
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/20">
                  <p className="text-gray-300 leading-relaxed">
                    Hire-me provides an AI-driven recruitment platform that connects candidates with 
                    recruiters through intelligent matching algorithms, automated interviews, and 
                    comprehensive candidate assessment tools. Our service is designed to streamline 
                    the hiring process for both job seekers and employers.
                  </p>
                </div>
              </section>

              {/* User Responsibilities */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  User Responsibilities
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  By using our platform, you agree to:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Provide accurate and truthful information in your profile and applications
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Use the platform in accordance with applicable laws and regulations
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Respect the intellectual property rights of others
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Maintain the confidentiality of your account credentials
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Not engage in any fraudulent or malicious activities
                  </li>
                </ul>
              </section>

              {/* Platform Usage */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Platform Usage Guidelines
                </h2>
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/20">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Our AI interview system and matching algorithms are designed to provide fair and 
                    unbiased assessment. Users are expected to engage authentically with the platform 
                    and provide genuine responses during AI interviews.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Any attempt to manipulate or game the system may result in account suspension 
                    or termination.
                  </p>
                </div>
              </section>

              {/* Modifications */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Modifications to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to update or modify these terms at any time. When changes are made, 
                  we will notify users through the platform or via email. Continued use of the service 
                  after modifications constitutes acceptance of the updated terms.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Service Availability
                </h2>
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/20">
                  <p className="text-gray-300 leading-relaxed">
                    While we strive to maintain continuous service availability, we cannot guarantee 
                    uninterrupted access to the platform. Scheduled maintenance, technical issues, 
                    or other factors may temporarily affect service availability.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Account Termination
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  If you do not agree with these terms or any future modifications, please discontinue 
                  use of the service immediately. You may delete your account at any time through your 
                  account settings, and we will process your request in accordance with our Privacy Policy.
                </p>
              </section>

              {/* Contact Information */}
              <section className="border-t border-gray-700/30 pt-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Questions About These Terms?
                </h2>
                <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-xl p-6 border border-[#94725d]/20">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    If you have any questions about these Terms of Service or need clarification 
                    on any aspect of our platform usage, please reach out to our legal team.
                  </p>
                  <p className="text-gray-300">
                    Contact us at{" "}
                    <a
                      href="mailto:legal@hire-me.com"
                      className="text-[#94725d] hover:text-[#896a59] transition-colors duration-300 font-medium underline decoration-[#94725d]/30 hover:decoration-[#896a59]/50"
                    >
                      legal@hire-me.com
                    </a>
                    {" "}for any legal or terms-related inquiries.
                  </p>
                </div>
              </section>

              {/* Last Updated */}
              <div className="text-center pt-8 border-t border-gray-700/20">
                <p className="text-gray-400 text-sm">
                  Last updated: August 28, 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
