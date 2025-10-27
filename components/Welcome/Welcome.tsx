"use client";

import Image from "next/image";
import { useAuthStore } from "@/services/stores";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function Welcome() {
  const { token } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-background">
      {/* Left Side - Welcome Image */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen">
        <Image
          src="/welcome.png"
          alt="Welcome Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center justify-center gap-8 w-full md:w-1/2 p-8 md:p-16">
        <Image
          src="/istoda.png"
          alt="Istoda Logo"
          width={220}
          height={220}
          className="object-contain"
        />

        <p className="text-center text-lg md:text-xl text-foreground/80 max-w-md leading-relaxed">
          A platform where stories come alive. <br />
          Read and write short stories that will live forever.
        </p>

        <Button
          onClick={() => router.push(!token ? "/auth/login" : "/home")}
          variant="primary"
          size="lg"
          className="mt-4"
        >
          Start your journey
        </Button>
      </div>
    </div>
  );
}
