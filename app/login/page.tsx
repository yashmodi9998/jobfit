"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  // Router for navigation after login
  const router = useRouter();
  // State for form fields, loading state, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
// Handle form submission for email/password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use NextAuth's signIn function with "credentials" provider
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevents automatic reload so we can handle errors
      });
// Check for errors in the response and navigate to dashboard on success
      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      // Catch any unexpected errors and display a generic message
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-[400px] shadow-xl rounded-2xl border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-gray-800">Login</CardTitle>
          <CardDescription>
            Enter your email to sign in to your JobFit account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl bg-gray-50 focus-visible:ring-blue-600/30"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl bg-gray-50 focus-visible:ring-blue-600/30"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-xl text-lg transition-all"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full py-6 rounded-xl flex gap-3 hover:bg-gray-50"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <Image  src="/google-icon.svg" width={20} height={20} alt="Google" />
            Sign in with Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center border-t p-6 mt-2">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account? 
            <Link href="/signup" className="text-blue-600 font-semibold ml-1 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginPage;