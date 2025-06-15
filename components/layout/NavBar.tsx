"use client";
import { NotepadText } from "lucide-react";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import SearchInput from "./SearchInput";
import Notifications from "./Notifications";

export default function NavBar() {
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
            <Notifications />
            <div>UserMenu</div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
