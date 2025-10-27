"use client";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Button } from "@/components/ui";

export default function Login() {
  const { email, setEmail, password, setPassword, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card variant="neomorph" padding="lg" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" className="w-full" size="lg">
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
