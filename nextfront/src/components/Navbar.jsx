"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname(); // 👈 lets you check the current route

  const links = [
    { href: "/", label: "Home" },
    { href: "/matches", label: "Matches" },
    { href: "/teams", label: "Teams" },
    { href: "/players", label: "Players" },
    { href: "/tournaments", label: "Tournaments" },
    { href: "/admin/auth", label: "Admin" },
  ];

  return (
    <div className="bg-zinc-950 w-full max-w-7xl mx-auto shadow-2xl p-2 flex justify-between items-center rounded-b-2xl rounded-t-none border border-white/5 border-t-0 relative z-50">
      {/* Logo / Brand */}
      <Link href="/" className="text-2xl font-bold uppercase italic tracking-tight">
        <span className="text-white">
          Cricmate
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${isActive
                ? "text-white bg-white/10 shadow-inner"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-600/10 border border-white/5 pointer-events-none" />
              )}
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
