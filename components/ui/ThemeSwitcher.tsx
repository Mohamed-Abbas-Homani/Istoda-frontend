"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline" | "ghost" | "link";
  className?: string;
}

export function ThemeSwitcher({ variant = "ghost", className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant={variant} size="icon" className={cn("w-9 h-9", className)}>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("w-9 h-9 relative", className)}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <Sun
        className={cn(
          "h-5 w-5 rotate-0 scale-100 transition-all",
          theme === "dark" && "rotate-90 scale-0"
        )}
      />
      <Moon
        className={cn(
          "absolute h-5 w-5 rotate-90 scale-0 transition-all",
          theme === "dark" && "rotate-0 scale-100"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
