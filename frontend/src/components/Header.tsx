"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND } from "~/constants/env";
import Logo from "./Logo";

interface HeaderProps {
  user: {
    username: string;
    email: string;
  };
  currentPage?: "game" | "leaderboard" | "stats" | "profile";
}

export default function Header({ user, currentPage }: HeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND}/api/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const navigationButtons = [
    {
      label: "Play Game",
      path: "/game",
      color:
        "bg-[#E75234] border-[#FF8167] hover:bg-[#d63e1f] hover:scale-105 hover:shadow-lg",
      activeColor:
        "bg-white border-[#E75234] text-[#E75234] hover:bg-[#E75234] hover:text-white",
      isActive: currentPage === "game",
    },
    {
      label: "Leaderboard",
      path: "/leaderboard",
      color:
        "bg-purple-600 border-purple-400 hover:bg-purple-700 hover:scale-105 hover:shadow-lg",
      activeColor:
        "bg-white border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
      isActive: currentPage === "leaderboard",
    },
    {
      label: "Statistics",
      path: "/stats",
      color:
        "bg-green-600 border-green-400 hover:bg-green-700 hover:scale-105 hover:shadow-lg",
      activeColor:
        "bg-white border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
      isActive: currentPage === "stats",
    },
  ];

  return (
    <header className="relative">
      <div className="absolute top-0 right-0 z-50" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-lg font-bold text-gray-800 bg-white rounded-2xl py-2 px-2 sm:px-4 border-4 border-gray-300 cursor-pointer hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
          <div className="w-8 h-8 bg-[#E75234] rounded-full flex items-center justify-center text-white font-bold transition-transform hover:scale-110">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block transition-colors">
            {user.username}
          </span>
          <svg
            className={`w-4 h-4 transition-all duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border-4 border-gray-300 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <button
                onClick={() => {
                  router.push("/profile");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105">
                <svg
                  className="w-4 h-4 transition-transform hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                View Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105">
                <svg
                  className="w-4 h-4 transition-transform hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-40">
        <Logo />
      </div>

      <div className="flex flex-col items-center mb-8 pt-20 md:pt-40">
        <div className="flex flex-wrap justify-center gap-4">
          {navigationButtons.map(button => (
            <button
              key={button.path}
              onClick={() => !button.isActive && router.push(button.path)}
              disabled={button.isActive}
              className={`text-lg font-semibold rounded-2xl py-2 px-6 border-4 cursor-pointer transition-all duration-300 transform ${
                button.isActive
                  ? `${button.activeColor} cursor-default`
                  : `text-white ${button.color}`
              }`}>
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
