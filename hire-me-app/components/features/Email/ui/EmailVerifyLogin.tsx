"use client"
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const EmailVerifyLogin = () => {
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const handleResend = async () => {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }
        
        setIsLoading(true);
        try {
            const res = await fetch(`/api/email/resend-email?email=${email}`);
            if (res.ok) {
                toast.success("Verification email sent again!");
            } else {
                toast.error("Could not resend email");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-black flex flex-col justify-center items-center p-8'>
            <Card className='w-full max-w-md bg-black border-gray-800'>
                <CardHeader className='text-center space-y-4'>
                    <CardTitle className='text-white text-3xl font-semibold'>
                        Varify Email
                    </CardTitle>
                    <CardDescription className='text-gray-400 text-sm leading-relaxed'>
                        Include the email address associated with your account and we&apos;ll send you an email with instructions to Varify your Email.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className='space-y-6'>
                    <div className='space-y-2'>
                        <Label htmlFor="email" className='text-white text-sm font-medium'>
                            Email
                        </Label>
                        <Input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder='alan.turing@example.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                    </div>

                    <Button 
                        onClick={handleResend}
                        disabled={isLoading}
                        className='w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white'
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Reset Instructions'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default EmailVerifyLogin