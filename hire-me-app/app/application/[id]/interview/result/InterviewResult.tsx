"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { 
  ChevronLeft, 
  Trophy, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  User,
  Target,
  Shield
} from 'lucide-react'
import { ApplicationTypeFull } from '@/types/applicationType'
import { useRouter } from 'next/navigation'





const InterviewResult = ({application}: {application: ApplicationTypeFull}) => {
  const [showAllTranscript, setShowAllTranscript] = useState(false)
  const router = useRouter()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number | null) => {
    if (!score) return 'from-gray-500 to-gray-600'
    if (score >= 80) return 'from-green-400 to-green-500'
    if (score >= 60) return 'from-yellow-400 to-yellow-500'
    return 'from-red-400 to-red-500'
  }

  // Check if essential data is available
  const hasEssentialData = application.interviewScore || application.score || 
    application.strongPoints?.length > 0 || application.weakPoints?.length > 0 ||
    application.resumeOverview

  if (!hasEssentialData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Results Available</h2>
              <p className="text-gray-400 mb-6">Interview results are not yet available or failed to load.</p>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
                onClick={() => router.push('/candidate/dashboard') }
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm flex items-center gap-2"
             onClick={() => router.push('/candidate/dashboard') }
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Interview Results
          </h1>
        </motion.div>

        {/* Score Overview */}
        {(application.interviewScore || application.score) && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {application.interviewScore && (
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                    <CardTitle className="text-white">Interview Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className={`text-4xl font-bold ${getScoreColor(application.interviewScore)}`}>
                        {application.interviewScore}%
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreBg(application.interviewScore)} transition-all duration-1000 ease-out`}
                            style={{ width: `${application.interviewScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {application.score && (
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <Target className="w-5 h-5 text-blue-400 mr-2" />
                    <CardTitle className="text-white">Overall Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className={`text-4xl font-bold ${getScoreColor(application.score)}`}>
                        {application.score}%
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                          <div 
                            className={`h-full bg-gradient-to-r ${getScoreBg(application.score)} transition-all duration-1000 ease-out`}
                            style={{ width: `${application.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {/* Resume Overview */}
        {application.resumeOverview && (
          <motion.div variants={itemVariants}>
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"></div>
              <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                  <User className="w-5 h-5 text-blue-400 mr-2" />
                  <CardTitle className="text-white">Resume Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{application.resumeOverview}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Skills Analysis */}
        {(application.matchedSkills?.length > 0 || application.unmatchedSkills?.length > 0) && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {application.matchedSkills?.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <CardTitle className="text-white">Matched Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {application.matchedSkills.map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge className="bg-green-500/20 text-green-100 border border-green-500/30 backdrop-blur-sm hover:bg-green-500/30 transition-colors">
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {application.unmatchedSkills?.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <XCircle className="w-5 h-5 text-red-400 mr-2" />
                    <CardTitle className="text-white">Unmatched Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {application.unmatchedSkills.map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge className="bg-red-500/20 text-red-100 border border-red-500/30 backdrop-blur-sm hover:bg-red-500/30 transition-colors">
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {/* Strengths and Weaknesses */}
        {(application.strongPoints?.length > 0 || application.weakPoints?.length > 0) && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {application.strongPoints?.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <Trophy className="w-5 h-5 text-green-400 mr-2" />
                    <CardTitle className="text-white">Strong Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {application.strongPoints.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {application.weakPoints?.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"></div>
                <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                    <CardTitle className="text-white">Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {application.weakPoints.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-2"
                        >
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {/* Suspicious Activities */}
        {application.suspiciousActivities?.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-xl"></div>
              <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-red-500/30 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                  <Shield className="w-5 h-5 text-red-400 mr-2" />
                  <CardTitle className="text-white">Suspicious Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {application.suspiciousActivities.map((activity, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-2"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-red-300">{activity}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Transcript */}
        {application.transcript && application.transcript.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"></div>
              <Card className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] border border-white/10 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-blue-400 mr-2" />
                    <CardTitle className="text-white">Interview Transcript</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTranscript(!showAllTranscript)}
                    className="text-blue-400 hover:bg-white/10 border border-white/20 backdrop-blur-sm"
                  >
                    {showAllTranscript ? 'Show Less' : 'Show All'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(showAllTranscript ? application.transcript : application.transcript.slice(0, 3)).map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group/message"
                      >
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm"></div>
                        <div className="relative p-3 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold ${
                              msg.role === 'recruiter' ? 'text-blue-400' : 'text-green-400'
                            }`}>
                              {msg.role}
                            </span>
                          </div>
                          <p className="text-gray-300">{msg.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default InterviewResult