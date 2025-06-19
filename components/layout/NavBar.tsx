"use client";
import { NotepadText } from "lucide-react";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import SearchInput from "./SearchInput";
import Notifications from "./Notifications";
import UserButton from "./UserButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Main navigation bar component with responsive design
 * Handles authentication state, theme switching, and user interactions
 */
export default function NavBar() {
  // Authentication state management
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";
  const path = usePathname();

  // Auto-update session when path changes and user isn't logged in
  useEffect(() => {
    if (!isLoggedIn && path) {
      const updateSession = async () => {
        await session.update();
      };
      updateSession();
    }
  }, [path, isLoggedIn]);

  return (
    <nav className="sticky top-0 border-b z-50 bg-light-mode dark:bg-dark-mode text-dark-mode dark:text-light-mode">
      <Container>
        <div className="flex justify-between items-center gap-8">
          <div className="flex items-center gap-1 cursor-pointer">
            <NotepadText size={24} />
            <div className="font-bold text-xl">Developer.Blog</div>
          </div>
          <SearchInput />
          <div className="flex gap-5 sm:gap-8 items-center">
            <ThemeToggle />
            {/* Conditional rendering based on auth state */}
            {isLoggedIn && <Notifications />}
            {isLoggedIn && <UserButton />}

            {/* Auth links (only shown when logged out) */}
            {!isLoggedIn && (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
