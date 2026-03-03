"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-[400px] shadow-xl rounded-2xl border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-gray-800">Register</CardTitle>
          <CardDescription>
            Create an account to join FitJob
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl bg-gray-50 focus-visible:ring-blue-600/30"
              />
            </div>

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
                placeholder="••••••••"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl bg-gray-50 focus-visible:ring-blue-600/30"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-xl text-lg transition-all mt-2"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
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
            Already have an account? 
            <Link href="/login" className="text-blue-600 font-semibold ml-1 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default RegisterPage;