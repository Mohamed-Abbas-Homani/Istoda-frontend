"use client";
import React from "react";
import Link from "next/link";
import { Home, User, Info, Mail, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const menuItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: User, label: "You", href: "/profile" },
    { icon: Info, label: "About Us", href: "/about" },
    { icon: Mail, label: "Contact Us", href: "/contact" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-[64px] h-[calc(100vh-64px)] bg-background shadow-neomorph transition-all duration-300 z-40",
        isOpen ? "w-60" : "w-20"
      )}
    >
      <nav className="flex flex-col gap-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex rounded-lg hover:bg-accent/10 transition-colors group",
                isOpen
                  ? "flex-row items-center gap-4 px-3 py-3"
                  : "flex-col items-center gap-1 px-2 py-2"
              )}
            >
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
              </div>
              {isOpen ? (
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                  {item.label}
                </span>
              ) : (
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors text-center whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
