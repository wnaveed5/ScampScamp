"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Lock } from "lucide-react"
import { toast } from "sonner"
import { klaviyoAPI } from "@/lib/klaviyo"

interface LockScreenProps {
  onUnlock: () => void;
  isLocked: boolean;
}

const LockScreen = ({ onUnlock, isLocked }: LockScreenProps) => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  const [mode, setMode] = useState<"signup" | "password">("signup")
  const [email, setEmail] = useState("")
  const [isSignupLoading, setIsSignupLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate password check - replace with your actual logic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (password === "scamp2024") {
      toast.success("Welcome to SCAMP!")
      localStorage.setItem("isUnlocked", "true")
      onUnlock()
    } else {
      setError("Invalid access code. Please try again.")
    }

    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSignupLoading(true)
    setError("")

    try {
      // Use the centralized Klaviyo API
      await klaviyoAPI.addSubscriber(email)
      
      setSignupSuccess(true)
      toast.success("You're on the list!")
      localStorage.setItem("earlyAccessEmail", email)
      
      // Optionally unlock after successful signup
      setTimeout(() => {
        localStorage.setItem("isUnlocked", "true")
        onUnlock()
      }, 2000)
      
    } catch (error) {
      console.error('Klaviyo signup error:', error)
      setError("Something went wrong. Please try again.")
      toast.error("Failed to sign up. Please try again.")
    } finally {
      setIsSignupLoading(false)
    }
  }

  if (!isLocked) return null

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/scamp-hero.mov" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/85 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src="/logo/scamp-logo.png" alt="SCAMP" className="h-16 w-auto" />
              </div>
              <div className="w-12 h-0.5 bg-black mx-auto mb-4" />
              <p className="text-gray-600 text-sm uppercase tracking-wider">Early Access</p>
            </div>

            {/* Access Form */}
            {mode === "signup" ? (
              // Email Signup Form
              <>
                {!signupSuccess ? (
                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email for early access"
                        className="border-gray-300 focus:border-black focus:ring-black"
                        required
                      />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3"
                      disabled={isSignupLoading}
                    >
                      {isSignupLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Signing up...
                        </div>
                      ) : (
                        "Get Early Access"
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">You're on the list!</h3>
                    <p className="text-sm text-gray-600">We'll notify you when SCAMP launches.</p>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setMode("password")}
                    className="text-xs text-gray-500 hover:text-black transition-colors underline"
                  >
                    Already have access? Enter password
                  </button>
                </div>
              </>
            ) : (
              // Password Form
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                      Access Code
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your access code"
                        className="pr-10 border-gray-300 focus:border-black focus:ring-black"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Enter
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setMode("signup")}
                    className="text-xs text-gray-500 hover:text-black transition-colors underline"
                  >
                    Don't have access? Sign up for early access
                  </button>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                {mode === "signup"
                  ? "Be the first to know when we launch."
                  : "Contact us if you need help accessing your account."}
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors">
                  Email
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LockScreen 