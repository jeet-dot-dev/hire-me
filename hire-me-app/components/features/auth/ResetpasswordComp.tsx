"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from "react";
import { toast } from 'sonner';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from "motion/react"

const ResetPasswordComp = () => {
    const [email, setEmail] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
          if(email === ""){
            toast.error("Please enter a valid email");
            return ;
          }
            
            // In real app, this would be the actual API call:
            const response = await axios.post('/api/auth/forget-password', { email })
            if (response.status === 200) {
                toast.success("Reset link sent! Please check your email inbox and spam folder.")
                setEmail("")
            }
            
            //alert("Password reset email sent successfully. Please check your inbox.");
            setEmail("")
        } catch (error) {
            toast.error("Failed to send reset email. Please try again or contact support.");
            console.error("Reset password error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 bg-cover"
          style={{
        backgroundImage:
          "url('https://pub-e8254eef37b34b8c92dffe1a5f1c9a49.r2.dev/Hire-me-assets/authBgImage.webp')",
      }}
        >
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold text-white">
                        Reset Password
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Enter your email address and we&apos;ll send you a link to reset your password
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
                            required
                        />
                    </div>
                </div>

                <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                
               <button 
  type="button" 
  onClick={() => router.push("/auth/login")}
  className="group w-full text-zinc-400 hover:text-zinc-300 transition-colors text-sm cursor-pointer"
>
  <div className="flex justify-center items-center gap-2">
    <motion.div
      variants={{
        initial: { x: 0 },
        hover: { x: -2 },
      }}
      initial="initial"
      animate="initial"
      whileHover="hover"
      className="group-hover:translate-x-[-2px]  transition-transform duration-300"
    >
      <ArrowLeft className="w-4 h-4 group-hover:text-white text-muted-foreground" />
    </motion.div>
    <span>Back to login</span>
  </div>
</button>

            </div>
        </div>
    )
}

export default ResetPasswordComp