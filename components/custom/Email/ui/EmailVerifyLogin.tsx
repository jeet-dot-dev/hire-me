"use client"
import React, { useState } from 'react'
import { toast } from 'sonner';


const EmailVerifyLogin = () => {
    const [email , setEmail] = useState<string>("");
    const handleResend = async () => {
    try {
      const res = await fetch(`/api/email/resend-email?email=${email}`);
      if (res.ok) {
        toast.success("Verification email sent again!");
      } else {
        toast.error("Could not resend email");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className='w-full min-h-screen justify-center items-center p-1'>
      <label>Enter your email to verify</label>
      <input type="email" name="email" id="email" placeholder='John@gmail.com' onChange={(e)=>setEmail(e.target.value)} />
      <button onClick={()=>handleResend()}>Verify Email</button>
    </div>
  )
}

export default EmailVerifyLogin
