"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/app/services/stores";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { token, user, logout } = useAuthStore();

  return (
    <div className={styles.navContainer}>
      {/* Main Navigation */}
      <nav className={styles.navbar}>
        {/* Left: Logo + Tagline + Search */}
        <div className={styles.navbarLeft}>
          {/* Logo */}
          <Link href="/home">
            <div className={styles.navbarLogo}>
              <Image
                src="/istoda.png"
                alt="Istoda Logo"
                width={80}
                height={30}
              />
            </div>
          </Link>
          {/* Tagline */}
          <span className={styles.navbarTagline}>let your stories alive</span>
          {/* Search box */}
          {token && (
            <div className={styles.navbarSearch}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.navbarSearchInput}
              />
            </div>
          )}
        </div>

        {/* Right: Navigation Buttons */}
        <div className={styles.navbarRight}>
          <Link href="/about" className={styles.navbarButton}>
            About Us
          </Link>
          <Link href="/contact" className={styles.navbarButton}>
            Contact Us
          </Link>
          {token && (
            <Link href="/editor" className={styles.navbarButton}>
              Start Writing Now
            </Link>
          )}
        </div>
      </nav>

      {/* Separate Profile Section */}
      <div className={styles.profileSection}>
        {/* Profile Avatar */}
        <div className={styles.profileAvatar}>
          <Image
            src={
              user?.profilePicture
                ? `http://localhost:8000/uploads/${user?.profilePicture}`
                : "/default.png"
            }
            alt="Profile"
            width={40}
            height={40}
            className={styles.avatarImg}
          />
        </div>

        {/* Dropdown Button */}
        <button
          onClick={() => setOpen(!open)}
          className={styles.dropdownToggle}
        >
          <ChevronDown size={14} />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className={styles.navbarDropdown}>
            {!token ? (
              <>
                <Link href="/auth/login" className={styles.dropdownItem}>
                  Login
                </Link>
                <Link href="/auth/signup" className={styles.dropdownItem}>
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                }}
                className={styles.dropdownItem}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
