"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MessageCircle, Bell, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import LocationDisplay from "./LocationDisplay";
import { buttonVariants } from "./ui/button";
import { useUserProfile } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "./SearchBar";
import UserAccountNav from "./UserAccountNav";
import { User } from "@/payload-types";

const navigationTabs = [
  { name: "Home", href: "/" },
  { name: "Bookings", href: "/bookings" },
  { name: "Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
];

const NavbarClient = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { profile: userProfile, loading } = useUserProfile();

  const user: User | null = userProfile
    ? {
        ...userProfile,
        role: "user",
        updatedAt: "",
        createdAt: "",
        password: null,
      }
    : null;

  useEffect(() => {
    if (pathname === "/") setActiveTab("Home");
    else if (pathname.includes("/bookings")) setActiveTab("Bookings");
    else if (pathname.includes("/profile")) setActiveTab("Profile");
    else if (pathname.includes("/settings")) setActiveTab("Settings");
    else setActiveTab("");
  }, [pathname]);

  const hideNavbar = pathname.startsWith('/sign-up') || pathname.startsWith('/chat') || pathname.startsWith('/sign-in') || pathname.startsWith('/seller');

  if (hideNavbar) {
    return null;
  }

  return (
    <div className="relative z-50 w-full zonomo-gradient text-white top-0 rounded-b-2xl shadow-md">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col justify-between h-45">
        
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-white">Zonomo</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <MessageCircle className="w-6 h-6" />
            </Link>
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Menu className="w-6 h-6 cursor-pointer" />
              </SheetTrigger>
              <SheetContent side="right" className="w-64 zonomo-gradient text-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-white">Zonomo</span>
                </div>
                <div className="space-y-4">
                  <Link href="/chat" className="block py-2 text-sm text-white/80">
                    Chat
                  </Link>
                  {user ? (
                    <div className="block py-2 text-sm text-white">
                      Hi, {user.email.split("@")[0]}
                    </div>
                  ) : (
                    <>
                      <Link href="/sign-in" className="block py-2 text-sm text-white/80">
                        Sign in
                      </Link>
                      <Link href="/sign-up" className="block py-2 text-sm text-white/80">
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* User greeting section */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xs font-medium leading-none">
            Hi, {user?.email?.split("@")[0]?.toUpperCase() || "USERNAME"}
          </h2>
          <div className="text-[10px] text-white/80">
            <LocationDisplay />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 px-4 pb-2">
          {/* Search bar */}
          <div className="relative w-full max-w-xl z-[60]">
            <SearchBar />
          </div>

          {/* Navigation tabs */}
          <div className="w-full max-w-xl">
            <div className="flex justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-0.5">
              {navigationTabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex-1 text-center py-1.5 rounded-md text-[12px] font-medium transition-all ${
                    activeTab === tab.name
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col px-6 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">Zonomo</span>
          </Link>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center text-center">
            <div className="text-sm font-medium leading-tight">
              Hi, {user?.email?.split("@")[0] || "User"} 👋
            </div>
            <div className="text-xs text-white/80 leading-tight">
              <LocationDisplay />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/chat">
              <MessageCircle className="w-5 h-5 cursor-pointer hover:text-white/80 transition-colors" />
            </Link>

            <Bell className="w-5 h-5 cursor-pointer hover:text-white/80 transition-colors" />
           
            {loading ? (
              <span className="text-gray-200 text-sm">Loading...</span>
            ) : user ? (
              <UserAccountNav user={user} />
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "px-3 py-1.5 text-white hover:bg-white/10 text-sm"
                  })}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "px-3 py-1.5 text-white hover:bg-white/10 text-sm"
                  })}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-xl z-[60]">
            <SearchBar />
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex justify-center relative z-[40]">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-0.5">
            {navigationTabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.name
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarClient;
