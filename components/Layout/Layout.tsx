"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Notification from "./Notification";
import { useAuthStore } from "@/services/stores";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

type LayoutMode = "protected" | "notProtected" | "public";

type LayoutProps = {
  children: React.ReactNode;
  mode?: LayoutMode;
  withNav?: boolean;
};

// Loading component for auth checks
function AuthLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Inner layout component that uses sidebar context
function LayoutContent({ children, withNav, mode }: { children: React.ReactNode; withNav: boolean; mode: LayoutMode }) {
  const { isOpen } = useSidebar();
  const showSidebar = withNav && mode !== "notProtected";

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      {withNav && <Navbar showMenuButton={showSidebar} />}
      {showSidebar && <Sidebar isOpen={isOpen} />}
      <main className={`flex-1 transition-all duration-300 ${showSidebar ? (isOpen ? 'ml-60' : 'ml-20') : ''}`}>
        {children}
      </main>
      <Notification />
    </div>
  );
}

export default function Layout({
  children,
  mode = "public",
  withNav = true,
}: LayoutProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication logic after client-side hydration
  useEffect(() => {
    if (!isClient) return;

    // For public pages, no auth check needed
    if (mode === "public") {
      setAuthChecked(true);
      return;
    }

    if (mode === "protected" && !token) {
      router.replace("/auth/login");
      return;
    }

    if (mode === "notProtected" && token) {
      router.push("/home");
      return;
    }

    setAuthChecked(true);
  }, [token, router, isClient, mode]);

  // Show consistent layout during SSR
  if (!isClient) {
    return (
      <SidebarProvider>
        <LayoutContent withNav={withNav} mode={mode}>{children}</LayoutContent>
      </SidebarProvider>
    );
  }

  // Show loading during auth check for protected/notProtected routes
  if (!authChecked && mode !== "public") {
    return <AuthLoading />;
  }

  return (
    <SidebarProvider>
      <LayoutContent withNav={withNav} mode={mode}>{children}</LayoutContent>
    </SidebarProvider>
  );
}
