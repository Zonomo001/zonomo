"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Bell, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Icons } from "./Icons";
import LocationDisplay from "./LocationDisplay";
import { buttonVariants } from "./ui/button";
import { useUserProfile } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "./SearchBar";
import UserAccountNav from "./UserAccountNav";
import Cart from "./Cart";
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

  // 👉 Pathname based Active Tab using your if-else structure
  useEffect(() => {
    if (pathname === "/") setActiveTab("Home");
    else if (pathname.includes("/bookings")) setActiveTab("Bookings");
    else if (pathname.includes("/profile")) setActiveTab("Profile");
    else if (pathname.includes("/settings")) setActiveTab("Settings");
    else setActiveTab(""); // No match
  }, [pathname]);

  return (
    <div className="relative z-50 w-full zonomo-gradient text-white sticky top-0">
      {/* Top Navbar */}
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Icons.logo className="h-10 w-auto" />
        </Link>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center space-x-4">
          <Link href="/cart">
            <ShoppingCart className="w-6 h-6" />
          </Link>
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Menu className="w-6 h-6 cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 zonomo-gradient text-white">
              <div className="flex justify-between items-center mb-4">
                <Icons.logo className="h-8" />
                <X onClick={() => setDrawerOpen(false)} className="cursor-pointer" />
              </div>
              <div className="space-y-4">
                {navigationTabs.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`block py-2 text-sm ${
                      activeTab === tab.name ? "font-semibold text-white" : "text-white/80"
                    }`}
                  >
                    {tab.name}
                  </Link>
                ))}
                <Link href="/cart" className="block py-2 text-sm text-white/80">
                  Cart
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Cart />
          <Bell className="w-6 h-6 cursor-pointer" />
          {loading ? (
            <span className="text-gray-200">Loading...</span>
          ) : user ? (
            <UserAccountNav user={user} />
          ) : (
            <>
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "ghost", className: "px-4 py-2 text-white" })}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={buttonVariants({ variant: "ghost", className: "px-4 py-2 text-white" })}
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Centered Username + Location */}
        <div className="flex flex-col items-center mt-2 text-white">
          <h2 className="text-xs font-medium">
            Hi, {user?.email?.split("@")[0]?.toUpperCase() || "USERNAME"} 👋
          </h2>
          {/* Location Display */}
      <div className="flex justify-center py-2 text-xs text-white/80">
        <LocationDisplay />
      </div>
        </div>

      {/* Search Bar */}
      <div className="py-2 px-4 md:px-6">
        <div className="relative max-w-xl mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* Tabs */}
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center space-x-1 bg-white/10 rounded-xl p-0.5">
            {navigationTabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex-1 text-center py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
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
          <div className="max-w-3xl mx-auto">
          
        </div>

     
    </div>
  );
};

export default NavbarClient;


// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Search, ShoppingCart, Bell } from "lucide-react";
// import { usePathname } from "next/navigation";
// import { Icons } from "./Icons";
// import LocationDisplay from "./LocationDisplay";
// import { buttonVariants } from "./ui/button";
// import { useUserProfile } from "@/hooks/use-auth";

// // Define User type inline here
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'seller' | 'admin';
//   image?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   password?: null;
// };

// const NavbarClient = () => {
//   const { profile: userProfile, loading } = useUserProfile();

//   const user: User | null = userProfile
//     ? {
//         ...userProfile,
//         role: 'user',
//         updatedAt: '',
//         createdAt: '',
//         password: null,
//       }
//     : null;

//   const [activeTab, setActiveTab] = useState("Home");
//   const pathname = usePathname();

//   useEffect(() => {
//     if (pathname === "/") setActiveTab("Home");
//     else if (pathname.includes("/bookings")) setActiveTab("Bookings");
//     else if (pathname.includes("/profile")) setActiveTab("Profile");
//     else if (pathname.includes("/settings")) setActiveTab("Settings");
//   }, [pathname]);

//   if (pathname === "/cart") return null;

//   const navigationTabs = [
//     { name: "Home", href: "/" },
//     { name: "Bookings", href: "/bookings" },
//     { name: "Profile", href: "/profile" },
//     { name: "Settings", href: "/settings" },
//   ];

//   return (
//     <>
//       <div className='bg-white sticky z-50 top-0 inset-x-0 h-16 border-b border-gray-200'>
//         <header className='relative bg-white h-16'>
//           <div className='max-w-7xl mx-auto'>
//             <div className='flex h-16 items-center justify-between'>
//               {/* Left: Logo */}
//               <Link href='/'>
//                 <Icons.logo className='h-10 w-30' />
//               </Link>

//               {/* Right: Cart and Auth/Avatar */}
//               <div className='flex items-center space-x-4'>
//                 <ShoppingCart className="w-6 h-6 cursor-pointer" />
//                 {loading ? (
//                   <span className='text-gray-400'>Loading...</span>
//                 ) : user ? (
//                   <span>{user.name}</span> // You can replace with UserAccountNav
//                 ) : (
//                   <>
//                     <Link
//                       href='/sign-in'
//                       className={buttonVariants({ variant: 'ghost', className: 'px-4 py-2' })}>
//                       Sign in
//                     </Link>
//                     <span className='h-6 w-px bg-gray-300 mx-1 hidden sm:inline-block' aria-hidden='true' />
//                     <Link
//                       href='/sign-up'
//                       className={buttonVariants({ variant: 'ghost', className: 'px-4 py-2' })}>
//                       Create account
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>
//       </div>

//       <div className="relative zonomo-gradient w-full text-white">
//         <div className="flex flex-col items-center text-center px-4 py-2 space-y-2">
//           <h2 className="text-sm font-medium">
//             Hi, {user?.email?.split("@")[0]?.toUpperCase() || "USERNAME"} 👋
//           </h2>
//           <div className="flex items-center text-xs opacity-80">
//             <LocationDisplay />
//           </div>

//           <div className="w-full max-w-2xl">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white z-10" />
//               <input
//                 type="text"
//                 placeholder="Search services..."
//                 className="w-full rounded-lg py-2 pl-9 pr-3 bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
//               />
//             </div>
//           </div>

//           <div className="w-full max-w-2xl">
//             <div className="flex justify-center space-x-2 bg-white/10 rounded-xl p-1">
//               {navigationTabs.map((tab) => (
//                 <Link
//                   key={tab.name}
//                   href={tab.href}
//                   className={`flex-1 text-center py-2 rounded-md text-xs font-medium transition-all ${
//                     activeTab === tab.name
//                       ? "bg-white/20 text-white"
//                       : "text-white/70 hover:text-white"
//                   }`}
//                   onClick={() => setActiveTab(tab.name)}
//                 >
//                   {tab.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // export default NavbarClient;
