"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import { useAuthStore } from "@/services/stores";
import { Button, ThemeSwitcher } from "@/components/ui";
import { useSidebar } from "@/contexts/SidebarContext";

interface NavbarProps {
  showMenuButton?: boolean;
}

export default function Navbar({ showMenuButton = true }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { token, user, logout } = useAuthStore();

  return (
    <nav className="w-full bg-background shadow-neomorph-sm sticky top-0 z-50">
      <div className="w-full px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu Icon + Logo + Tagline */}
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="w-10 h-10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <Link href="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-3xl font-bold text-primary tracking-tight">
                Istoda
              </span>
              <span className="hidden md:block text-lg font-medium text-secondary whitespace-nowrap">
                let your stories alive
              </span>
            </Link>
          </div>

          {/* Center: Search box */}
          {token && (
            <div className="flex items-center flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background shadow-neomorph-inset text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            </div>
          )}

          {/* Right: Start Writing + Notifications + Theme + Profile */}
          <div className="flex items-center gap-2">
            {token && (
              <>
                <Link href="/create-story">
                  <Button variant="primary" size="sm">
                    Start Writing
                  </Button>
                </Link>

                <Button variant="secondary" size="icon" className="w-10 h-10">
                  <Bell className="h-5 w-5" />
                </Button>
              </>
            )}

            <ThemeSwitcher variant="secondary" className="w-10 h-10" />

            {/* Profile Picture */}
            <div className="relative flex items-center">
              <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
              >
                <Image
                  src={
                    user?.profilePicture
                      ? `http://localhost:8000/uploads/${user?.profilePicture}`
                      : "/default.png"
                  }
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </button>

              {/* Dropdown Menu */}
              {open && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-neomorph overflow-hidden z-50">
                    {!token ? (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-3 text-sm hover:bg-accent/10 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="block px-4 py-3 text-sm border-t border-border hover:bg-accent/10 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium">{user?.username || "User"}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-3 text-sm hover:bg-accent/10 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setOpen(false);
                            router.push("/auth/login");
                          }}
                          className="w-full text-left px-4 py-3 text-sm border-t border-border hover:bg-error/10 hover:text-error transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
