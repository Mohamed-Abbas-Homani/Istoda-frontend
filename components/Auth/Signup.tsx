"use client";
import Link from "next/link";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useSignup } from "@/hooks/useSingup";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Button } from "@/components/ui";

export default function Signup() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    profilePic,
    setProfilePic,
    handleSubmit,
  } = useSignup();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card variant="neomorph" padding="lg" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Sign Up</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="profilePic"
                  className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border shadow-neomorph-inset cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {profilePic ? (
                    <Image
                      src={URL.createObjectURL(profilePic)}
                      alt="Profile Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-xs">Upload</span>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfilePic(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Click to upload a profile picture (optional)
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" size="lg">
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
