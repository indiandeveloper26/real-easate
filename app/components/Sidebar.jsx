// // "use client";

// // import React, { useEffect, useState } from "react";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import {
// //   Home,
// //   Building2,
// //   Briefcase,
// //   Info,
// //   PhoneCall,
// //   Heart,
// //   LogIn,
// //   UserPlus,
// //   Menu,
// //   X,
// // } from "lucide-react";

// // export default function Sidebar() {
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //   const pathname = usePathname();

// //   // Sidebar open hone par background scroll lock
// //   useEffect(() => {
// //     if (isSidebarOpen) {
// //       document.body.style.overflow = "hidden";
// //     } else {
// //       document.body.style.overflow = "";
// //     }

// //     return () => {
// //       document.body.style.overflow = "";
// //     };
// //   }, [isSidebarOpen]);

// //   // ESC key press hone par close
// //   useEffect(() => {
// //     const handleKeyDown = (e) => {
// //       if (e.key === "Escape") {
// //         setIsSidebarOpen(false);
// //       }
// //     };

// //     window.addEventListener("keydown", handleKeyDown);
// //     return () => {
// //       window.removeEventListener("keydown", handleKeyDown);
// //     };
// //   }, []);

// //   const navLinks = [
// //     { name: "Home", href: "/", icon: Home },
// //     { name: "Properties", href: "/admin/properties", icon: Building2 },
// //     { name: "Projects", href: "/projects", icon: Briefcase },
// //     { name: "About Us", href: "/about", icon: Info },
// //     { name: "admin/dadhboard", href: "/admin/ai-analytics", icon: PhoneCall },
// //   ];

// //   return (
// //     <>
// //       {/* ================= NAVBAR ================= */}
// //       <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

// //           {/* LOGO */}
// //           <Link href="/" className="flex items-center gap-2 group">
// //             <div className="p-2 bg-blue-600 rounded-xl text-white group-hover:bg-blue-700 transition">
// //               <Home className="w-6 h-6" />
// //             </div>
// //             <div>
// //               <span className="text-2xl font-black tracking-tight text-blue-900">
// //                 Dream<span className="text-blue-600">Home</span>
// //               </span>
// //               <p className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
// //                 Your Dream, Our Priority
// //               </p>
// //             </div>
// //           </Link>

// //           {/* DESKTOP NAVIGATION */}
// //           <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
// //             {navLinks.map((item) => {
// //               const isActive = pathname === item.href;
// //               return (
// //                 <Link
// //                   key={item.name}
// //                   href={item.href}
// //                   className={`transition ${isActive
// //                     ? "text-blue-600 font-semibold"
// //                     : "text-slate-600 hover:text-blue-600"
// //                     }`}
// //                 >
// //                   {item.name}
// //                 </Link>
// //               );
// //             })}
// //           </nav>

// //           {/* RIGHT SIDE */}
// //           <div className="flex items-center gap-2 sm:gap-3">
// //             {/* PHONE - Desktop */}
// //             <div className="hidden xl:flex items-center gap-2 pr-4 border-r border-slate-200">
// //               <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
// //                 <PhoneCall className="w-4 h-4" />
// //               </div>
// //               <div>
// //                 <p className="text-xs font-bold text-slate-800">+91 98765 43210</p>
// //                 <p className="text-[10px] text-slate-400">Call Us Anytime</p>
// //               </div>
// //             </div>

// //             {/* FAVORITE */}
// //             <Link
// //               href="/wishlist"
// //               className="hidden sm:flex p-2 text-slate-500 hover:text-rose-500 rounded-full hover:bg-slate-100 transition"
// //               aria-label="Wishlist"
// //             >
// //               <Heart className="w-5 h-5" />
// //             </Link>

// //             {/* LOGIN */}
// //             <Link
// //               href="/auth/login"
// //               className="hidden md:inline-flex text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 transition"
// //             >
// //               Login
// //             </Link>

// //             {/* REGISTER */}
// //             <Link
// //               href="/auth/signup"
// //               className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/30 transition"
// //             >
// //               Register
// //             </Link>

// //             {/* MENU BUTTON */}
// //             <button
// //               type="button"
// //               onClick={() => setIsSidebarOpen(true)}
// //               className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
// //               aria-label="Open menu"
// //             >
// //               <Menu className="w-6 h-6" />
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* ================= SIDEBAR OVERLAY ================= */}
// //       <div
// //         onClick={() => setIsSidebarOpen(false)}
// //         className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
// //           }`}
// //       />

// //       {/* ================= SIDEBAR ================= */}
// //       <aside
// //         className={`fixed top-0 right-0 z-[60] h-[100dvh] w-[88%] sm:w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
// //           }`}
// //       >
// //         {/* SIDEBAR HEADER */}
// //         <div className="shrink-0 flex items-center justify-between p-5 border-b border-slate-100">
// //           <Link
// //             href="/"
// //             onClick={() => setIsSidebarOpen(false)}
// //             className="flex items-center gap-2"
// //           >
// //             <div className="p-2 bg-blue-600 rounded-xl text-white">
// //               <Home className="w-5 h-5" />
// //             </div>
// //             <div>
// //               <span className="text-xl font-black tracking-tight text-blue-900">
// //                 Dream<span className="text-blue-600">Home</span>
// //               </span>
// //               <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">
// //                 Your Dream, Our Priority
// //               </p>
// //             </div>
// //           </Link>

// //           {/* CLOSE */}
// //           <button
// //             type="button"
// //             onClick={() => setIsSidebarOpen(false)}
// //             className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
// //             aria-label="Close menu"
// //           >
// //             <X className="w-6 h-6" />
// //           </button>
// //         </div>

// //         {/* SIDEBAR CONTENT */}
// //         <div className="flex-1 overflow-y-auto px-4 py-6">
// //           {/* NAV LINKS */}
// //           <nav className="space-y-2">
// //             {navLinks.map((item) => {
// //               const Icon = item.icon;
// //               const isActive = pathname === item.href;

// //               return (
// //                 <Link
// //                   key={item.name}
// //                   href={item.href}
// //                   onClick={() => setIsSidebarOpen(false)}
// //                   className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive
// //                     ? "bg-blue-50 text-blue-600 font-semibold"
// //                     : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
// //                     }`}
// //                 >
// //                   <Icon className="w-5 h-5" />
// //                   {item.name}
// //                 </Link>
// //               );
// //             })}
// //           </nav>

// //           {/* WISHLIST */}
// //           <div className="mt-5 pt-5 border-t border-slate-100">
// //             <Link
// //               href="/wishlist"
// //               onClick={() => setIsSidebarOpen(false)}
// //               className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
// //             >
// //               <span className="flex items-center gap-3">
// //                 <Heart className="w-5 h-5 text-rose-500" />
// //                 Favorites / Wishlist
// //               </span>
// //               <span className="bg-rose-50 text-rose-600 text-xs px-2 py-0.5 rounded-full font-semibold">
// //                 3
// //               </span>
// //             </Link>
// //           </div>
// //         </div>

// //         {/* ================= SIDEBAR FOOTER ================= */}
// //         <div className="shrink-0 p-5 border-t border-slate-100 bg-slate-50/70">
// //           {/* PHONE (Direct Tel Link) */}
// //           <a
// //             href="tel:+919876543210"
// //             className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition"
// //           >
// //             <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
// //               <PhoneCall className="w-4 h-4" />
// //             </div>
// //             <div>
// //               <p className="text-xs font-bold text-slate-800">+91 98765 43210</p>
// //               <p className="text-[11px] text-slate-400">Call Us Anytime</p>
// //             </div>
// //           </a>

// //           {/* ACTION BUTTONS */}
// //           <div className="grid grid-cols-2 gap-2 mt-3">
// //             <Link
// //               href="/auth/login"
// //               onClick={() => setIsSidebarOpen(false)}
// //               className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
// //             >
// //               <LogIn className="w-4 h-4" />
// //               Lgoin
// //             </Link>

// //             <Link
// //               href="/auth/signup"
// //               onClick={() => setIsSidebarOpen(false)}
// //               className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition"
// //             >
// //               <UserPlus className="w-4 h-4" />
// //               Register
// //             </Link>
// //           </div>
// //         </div>
// //       </aside>
// //     </>
// //   );
// // }










// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";

// import { useAdminAuthStore } from "../../RTK/store/Zustand/useAdminAuthStore"
// import {
//   Home,
//   Building2,
//   Briefcase,
//   Info,
//   PhoneCall,
//   Heart,
//   LogIn,
//   UserPlus,
//   Menu,
//   X,
//   User,
//   LogOut,
// } from "lucide-react";
// import Swal from "sweetalert2";



// export default function Sidebar() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const pathname = usePathname();
//   const router = useRouter();


//   const {
//     admin,
//     isAuthenticated,
//     clearAdmin,
//   } = useAdminAuthStore();

//   console.log("userdatata", admin);



//   // Sidebar open hone par background scroll lock
//   useEffect(() => {
//     if (isSidebarOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isSidebarOpen]);

//   // ESC key press hone par close
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   const navLinks = [
//     {
//       name: "Home",
//       href: "/",
//       icon: Home,
//     },
//     {
//       name: "Properties",
//       href: "/admin/properties",
//       icon: Building2,
//     },
//     {
//       name: "Properties_Lits",
//       href: "/admin/Properties_Lits",
//       icon: Briefcase,
//     },
//     {
//       name: "About Us",
//       href: "/about",
//       icon: Info,
//     },
//   ];

//   // // Logout
//   // const handleLogout = async () => {
//   //   try {
//   //     // Agar tumhare backend me user logout API hai
//   //     await fetch("/backend/api/admin/logout", {
//   //       method: "POST",
//   //       credentials: "include",
//   //     });
//   //   } catch (error) {
//   //     console.error("Logout error:", error);
//   //   } finally {
//   //     clearUser();
//   //     setIsSidebarOpen(false);
//   //     router.push("/");
//   //     router.refresh();
//   //   }
//   // };



//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: "Logout?",
//       text: "Are you sure you want to logout?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Logout",
//       cancelButtonText: "Cancel",
//       reverseButtons: true,
//     });

//     // Cancel kiya
//     if (!result.isConfirmed) return;

//     try {
//       await fetch("/backend/api/admin/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       clearAdmin();
//       setIsSidebarOpen(false);

//       console.log(' go home page okk')
//       router.push("/");
//       router.refresh();
//     }
//   };

//   // User display name
//   const userName =
//     admin?.name ||
//     admin?.displayName ||
//     admin?.email?.split("@")[0] ||
//     "User";

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

//           {/* LOGO */}
//           <Link
//             href="/"
//             className="flex items-center gap-2 group"
//           >
//             <div className="p-2 bg-blue-600 rounded-xl text-white group-hover:bg-blue-700 transition">
//               <Home className="w-6 h-6" />
//             </div>

//             <div>
//               <span className="text-2xl font-black tracking-tight text-blue-900">
//                 Dream
//                 <span className="text-blue-600">
//                   Home
//                 </span>
//               </span>

//               <p className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
//                 Your Dream, Our Priority
//               </p>
//             </div>
//           </Link>

//           {/* DESKTOP NAVIGATION */}
//           <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
//             {navLinks.map((item) => {
//               const isActive =
//                 pathname === item.href;

//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`transition ${isActive
//                     ? "text-blue-600 font-semibold"
//                     : "text-slate-600 hover:text-blue-600"
//                     }`}
//                 >
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* RIGHT SIDE */}
//           <div className="flex items-center gap-2 sm:gap-3">

//             {/* PHONE - Desktop */}
//             <div className="hidden xl:flex items-center gap-2 pr-4 border-r border-slate-200">
//               <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
//                 <PhoneCall className="w-4 h-4" />
//               </div>

//               <div>
//                 <p className="text-xs font-bold text-slate-800">
//                   +91 98765 43210
//                 </p>

//                 <p className="text-[10px] text-slate-400">
//                   Call Us Anytime
//                 </p>
//               </div>
//             </div>

//             {/* FAVORITE */}
//             <Link
//               href="/wishlist"
//               className="hidden sm:flex p-2 text-slate-500 hover:text-rose-500 rounded-full hover:bg-slate-100 transition"
//               aria-label="Wishlist"
//             >
//               <Heart className="w-5 h-5" />
//             </Link>

//             {/* ================= AUTH AREA ================= */}

//             {isAuthenticated && admin ? (
//               /* LOGGED IN USER */
//               <Link
//                 href="/admin/profile"
//                 className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
//               >
//                 <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
//                   <User className="w-5 h-5" />
//                 </div>

//                 <div className="text-left">
//                   <p className="text-sm font-semibold text-slate-800 max-w-[130px] truncate">
//                     {userName}
//                   </p>

//                   <p className="text-[10px] text-slate-400">
//                     My Account
//                   </p>
//                 </div>
//               </Link>
//             ) : (
//               <>
//                 {/* LOGIN */}
//                 <Link
//                   href="/auth/login"
//                   className="hidden md:inline-flex text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 transition"
//                 >
//                   Login
//                 </Link>

//                 {/* REGISTER */}
//                 <Link
//                   href="/auth/signup"
//                   className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/30 transition"
//                 >
//                   Register
//                 </Link>
//               </>
//             )}

//             {/* MENU BUTTON */}
//             <button
//               type="button"
//               onClick={() =>
//                 setIsSidebarOpen(true)
//               }
//               className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
//               aria-label="Open menu"
//             >
//               <Menu className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ================= SIDEBAR OVERLAY ================= */}
//       <div
//         onClick={() => setIsSidebarOpen(false)}
//         className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen
//           ? "opacity-100 pointer-events-auto"
//           : "opacity-0 pointer-events-none"
//           }`}
//       />

//       {/* ================= SIDEBAR ================= */}
//       <aside
//         className={`fixed top-0 right-0 z-[60] h-[100dvh] w-[88%] sm:w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isSidebarOpen
//           ? "translate-x-0"
//           : "translate-x-full"
//           }`}
//       >

//         {/* SIDEBAR HEADER */}
//         <div className="shrink-0 flex items-center justify-between p-5 border-b border-slate-100">

//           <Link
//             href="/"
//             onClick={() =>
//               setIsSidebarOpen(false)
//             }
//             className="flex items-center gap-2"
//           >
//             <div className="p-2 bg-blue-600 rounded-xl text-white">
//               <Home className="w-5 h-5" />
//             </div>

//             <div>
//               <span className="text-xl font-black tracking-tight text-blue-900">
//                 Dream
//                 <span className="text-blue-600">
//                   Home
//                 </span>
//               </span>

//               <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">
//                 Your Dream, Our Priority
//               </p>
//             </div>
//           </Link>

//           {/* CLOSE */}
//           <button
//             type="button"
//             onClick={() =>
//               setIsSidebarOpen(false)
//             }
//             className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
//             aria-label="Close menu"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* SIDEBAR CONTENT */}
//         <div className="flex-1 overflow-y-auto px-4 py-6">

//           {/* ================= USER CARD ================= */}

//           {isAuthenticated && admin ? (
//             <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">
//               <div className="flex items-center gap-3">

//                 <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
//                   <User className="w-5 h-5" />
//                 </div>

//                 <div className="min-w-0">
//                   <p className="text-[11px] font-medium text-blue-500 uppercase tracking-wide">
//                     Welcome back
//                   </p>

//                   <p className="text-sm font-bold text-slate-800 truncate">
//                     {userName}
//                   </p>

//                   {admin?.email && (
//                     <p className="text-xs text-slate-500 truncate">
//                       {admin.email}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <Link
//                 href="/profile"
//                 onClick={() =>
//                   setIsSidebarOpen(false)
//                 }
//                 className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white border border-blue-100 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition"
//               >
//                 <User className="w-4 h-4" />
//                 My Profile
//               </Link>
//             </div>
//           ) : null}

//           {/* NAV LINKS */}
//           <nav className="space-y-2">
//             {navLinks.map((item) => {
//               const Icon = item.icon;

//               const isActive =
//                 pathname === item.href;

//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   onClick={() =>
//                     setIsSidebarOpen(false)
//                   }
//                   className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive
//                     ? "bg-blue-50 text-blue-600 font-semibold"
//                     : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
//                     }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* WISHLIST */}
//           <div className="mt-5 pt-5 border-t border-slate-100">
//             <Link
//               href="/wishlist"
//               onClick={() =>
//                 setIsSidebarOpen(false)
//               }
//               className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
//             >
//               <span className="flex items-center gap-3">
//                 <Heart className="w-5 h-5 text-rose-500" />
//                 Favorites / Wishlist
//               </span>

//               <span className="bg-rose-50 text-rose-600 text-xs px-2 py-0.5 rounded-full font-semibold">
//                 3
//               </span>
//             </Link>
//           </div>
//         </div>

//         {/* ================= SIDEBAR FOOTER ================= */}
//         <div className="shrink-0 p-5 border-t border-slate-100 bg-slate-50/70">

//           {/* PHONE */}
//           <a
//             href="tel:+919876543210"
//             className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition"
//           >
//             <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
//               <PhoneCall className="w-4 h-4" />
//             </div>

//             <div>
//               <p className="text-xs font-bold text-slate-800">
//                 +91 98765 43210
//               </p>

//               <p className="text-[11px] text-slate-400">
//                 Call Us Anytime
//               </p>
//             </div>
//           </a>

//           {/* ================= AUTH BUTTONS ================= */}

//           {isAuthenticated && admin ? (
//             /* LOGGED IN */
//             <div className="mt-3">

//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition"
//               >
//                 <LogOut className="w-4 h-4" />
//                 Logout
//               </button>

//             </div>
//           ) : (
//             /* LOGGED OUT */
//             <div className="grid grid-cols-2 gap-2 mt-3">

//               <Link
//                 href="/auth/login"
//                 onClick={() =>
//                   setIsSidebarOpen(false)
//                 }
//                 className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
//               >
//                 <LogIn className="w-4 h-4" />
//                 Login
//               </Link>

//               <Link
//                 href="/auth/signup"
//                 onClick={() =>
//                   setIsSidebarOpen(false)
//                 }
//                 className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition"
//               >
//                 <UserPlus className="w-4 h-4" />
//                 Register
//               </Link>

//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }













"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Briefcase,
  Info,
  PhoneCall,
  Heart,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import Swal from "sweetalert2";

import { useAdminAuthStore } from "../../RTK/store/Zustand/useAdminAuthStore";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();

  const { admin, isAuthenticated, clearAdmin } =
    useAdminAuthStore();

  // Admin pages par public navbar/sidebar render nahi hoga.
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) {
      setIsSidebarOpen(false);
    }
  }, [isAdminRoute]);

  // Sidebar open hone par background scroll lock.
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Escape key se sidebar close.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Public website ke links.
  const navLinks = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Properties",
      href: "/properties",
      icon: Building2,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: Briefcase,
    },
    {
      name: "About Us",
      href: "/about",
      icon: Info,
    },
  ];

  const userName =
    admin?.name ||
    admin?.displayName ||
    admin?.email?.split("@")[0] ||
    "User";

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#2563eb",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch("/backend/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout request failed");
      }

      clearAdmin();
      closeSidebar();

      await Swal.fire({
        title: "Logged out",
        text: "You have been logged out successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);

      Swal.fire({
        title: "Logout failed",
        text: "Please try again.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // IMPORTANT: Admin routes par public navbar return nahi hoga.
  // Admin ka apna layout /admin/layout.jsx mein hoga.
  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      {/* ================= PUBLIC NAVBAR ================= */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="rounded-xl bg-blue-600 p-2 text-white transition group-hover:bg-blue-700">
              <Home className="h-6 w-6" />
            </div>

            <div>
              <span className="text-2xl font-black tracking-tight text-blue-900">
                Dream<span className="text-blue-600">Home</span>
              </span>

              <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
                Your Dream, Our Priority
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition ${
                    isActive
                      ? "font-semibold text-blue-600"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Phone */}
            <a
              href="tel:+919876543210"
              className="hidden items-center gap-2 border-r border-slate-200 pr-4 xl:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <PhoneCall className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  +91 98765 43210
                </p>
                <p className="text-[10px] text-slate-400">
                  Call Us Anytime
                </p>
              </div>
            </a>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-rose-500 sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Authentication */}
            {isAuthenticated && admin ? (
              <Link
                href="/admin/profile"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-50 md:flex"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-5 w-5" />
                </div>

                <div className="max-w-[130px] text-left">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {userName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Admin Account
                  </p>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-blue-600 md:inline-flex"
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  className="hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 transition hover:bg-blue-700 md:inline-flex"
                >
                  Register
                </Link>
              </>
            )}

            {/* Menu button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
              aria-label="Open menu"
              aria-expanded={isSidebarOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= OVERLAY ================= */}
      <button
        type="button"
        aria-label="Close menu overlay"
        onClick={closeSidebar}
        className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* ================= PUBLIC SIDEBAR ================= */}
      <aside
        aria-label="Website navigation"
        aria-hidden={!isSidebarOpen}
        className={`fixed right-0 top-0 z-[60] flex h-[100dvh] w-[88%] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-[380px] ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5">
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center gap-2"
          >
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Home className="h-5 w-5" />
            </div>

            <div>
              <span className="text-xl font-black tracking-tight text-blue-900">
                Dream<span className="text-blue-600">Home</span>
              </span>

              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Your Dream, Our Priority
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Logged-in user */}
          {isAuthenticated && admin && (
            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <User className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-blue-500">
                    Welcome back
                  </p>

                  <p className="truncate text-sm font-bold text-slate-800">
                    {userName}
                  </p>

                  {admin.email && (
                    <p className="truncate text-xs text-slate-500">
                      {admin.email}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href="/admin/dashboard"
                onClick={closeSidebar}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                <Building2 className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </div>
          )}

          {/* Navigation links */}
          <nav className="space-y-2">
            {navLinks.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Wishlist */}
          <div className="mt-5 border-t border-slate-100 pt-5">
            <Link
              href="/wishlist"
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Heart className="h-5 w-5 text-rose-500" />
              Favorites / Wishlist
            </Link>
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 p-5">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <PhoneCall className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                +91 98765 43210
              </p>
              <p className="text-[11px] text-slate-400">
                Call Us Anytime
              </p>
            </div>
          </a>

          {isAuthenticated && admin ? (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 bg-white py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                onClick={closeSidebar}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>

              <Link
                href="/auth/signup"
                onClick={closeSidebar}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

