import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
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
            Privacy <span className="text-[#896a59]">Policy</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we protect and handle your data.
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
                  Our Commitment to Privacy
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  We respect your privacy and are committed to protecting your personal information. 
                  This privacy policy is required for authentication providers like Google and GitHub, 
                  and outlines how we collect, use, and safeguard your data when you use our 
                  AI-powered recruitment platform.
                </p>
              </section>

              {/* Data Collection */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Information We Collect
                </h2>
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/20">
                  <p className="text-gray-300 leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, 
                    upload your resume, or participate in our AI interview process. This may include your 
                    name, email address, professional information, and responses to interview questions.
                  </p>
                </div>
              </section>

              {/* Data Usage */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  How We Use Your Information
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We do not sell or share your personal information with third parties for marketing purposes. 
                  Any data collected is used solely to:
                </p>
                <ul className="list-none space-y-2 mt-4 ml-4">
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Improve our AI interview and matching algorithms
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Provide personalized job recommendations
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Enhance the overall user experience
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94725d] mr-3 mt-2 flex-shrink-0"></span>
                    Communicate important updates about our service
                  </li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Data Security
                </h2>
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/20">
                  <p className="text-gray-300 leading-relaxed">
                    We implement industry-standard security measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction. Your data is 
                    encrypted both in transit and at rest.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="border-t border-gray-700/30 pt-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#94725d] mr-3"></span>
                  Questions or Concerns?
                </h2>
                <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-xl p-6 border border-[#94725d]/20">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or concerns about how we handle 
                    your personal information, please don&apos;t hesitate to reach out to us.
                  </p>
                  <p className="text-gray-300">
                    Contact us at{" "}
                    <a
                      href="mailto:privacy@hire-me.com"
                      className="text-[#94725d] hover:text-[#896a59] transition-colors duration-300 font-medium underline decoration-[#94725d]/30 hover:decoration-[#896a59]/50"
                    >
                      privacy@hire-me.com
                    </a>
                    {" "}and we&apos;ll respond within 24 hours.
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
