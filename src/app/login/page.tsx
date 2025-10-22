"use client";

import { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between bg-background px-4 border-b border-border">
        <Link href="/">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d0056af2-0815-473d-a9cf-5eb88c96bde4-bjbaji8-xyz/assets/images/logo-2.png?"
            alt="baji logo"
            width={71}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pt-[60px] pb-8">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-background border border-border rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link href="#" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-md font-medium transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-background border border-border hover:bg-secondary py-3 rounded-md transition-colors">
                <span className="text-xl">📱</span>
                <span className="text-sm font-medium">Phone</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-background border border-border hover:bg-secondary py-3 rounded-md transition-colors">
                <span className="text-xl">🔐</span>
                <span className="text-sm font-medium">OTP</span>
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/register" className="text-primary font-medium hover:underline">
                Sign up now
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>By signing in, you agree to our</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Link href="#" className="hover:text-foreground hover:underline">Terms of Service</Link>
              <span>•</span>
              <Link href="#" className="hover:text-foreground hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
