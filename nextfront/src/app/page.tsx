"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Match {
  match_id: number;
  teamA?: { team_name: string };
  teamB?: { team_name: string };
  matchDate?: string;
  venue?: string;
  matchState?: string;
  matchFormat?: string;
}

export default function Home() {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/matches")
      .then((res) => res.json())
      .then((data: Match[]) => {
        // Filter for upcoming matches
        const upcoming = data.filter(
          (m) => m.matchState === "UPCOMING" || m.matchState === "ONGOING"
        ).slice(0, 3);
        setUpcomingMatches(upcoming);
      })
      .catch((err) => console.error(err));
  }, []);
  // const router = useRouter();
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   if (router.query.error === "not_logged_in") setMessage("You must log in first.");
  //   if (router.query.error === "not_admin") setMessage("You do not have admin access.");
  // }, [router.query]);

  return (
    <div className="min-h-screen bg-zinc-950 pt-70">

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-12">
        <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-2xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            {/* {message && <div className="text-red-500 font-medium">{message}</div>} */}

            <h1 className="text-5xl font-black text-white mb-4">
              Welcome to CricMate
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Your ultimate cricket companion. Track matches, follow players, and stay updated with live scores.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 space-y-8">
        {/* Upcoming Matches Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              Upcoming Matches
            </h2>
            <Link
              href="/matches"
              className="text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingMatches.length === 0 ? (
              <div className="col-span-3 bg-zinc-900/50 rounded-xl p-8 border border-white/5 text-center">
                <p className="text-zinc-500">No upcoming matches</p>
              </div>
            ) : (
              upcomingMatches.map((match) => (
                <Link
                  key={match.match_id}
                  href={`/match/${match.match_id}`}
                  className="group bg-zinc-900/50 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 hover:bg-zinc-900/70 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-950/50 px-2 py-1 rounded border border-white/5">
                      {match.matchFormat || "T20"}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${match.matchState === "ONGOING"
                      ? "bg-red-500/10 text-red-500 animate-pulse"
                      : "bg-zinc-800 text-zinc-400"
                      }`}>
                      {match.matchState}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                      {match.teamA?.team_name || "TBA"}
                    </div>
                    <div className="text-xs text-zinc-500">vs</div>
                    <div className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                      {match.teamB?.team_name || "TBA"}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {match.matchDate
                      ? new Date(match.matchDate).toLocaleDateString()
                      : "Date TBA"}
                  </div>
                  <div className="text-xs text-zinc-600 mt-1">
                    {match.venue || "Venue TBA"}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { href: "/matches", label: "All Matches", icon: "🏏", desc: "View all matches" },
              { href: "/teams", label: "Teams", icon: "👥", desc: "Browse teams" },
              { href: "/players", label: "Players", icon: "⭐", desc: "Player stats" },
              { href: "/tournaments", label: "Tournaments", icon: "🏆", desc: "All tournaments" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-zinc-900/50 rounded-xl p-6 border border-white/5 hover:border-orange-500/30 hover:bg-zinc-900/70 transition-all"
              >
                <div className="text-4xl mb-3">{link.icon}</div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-1">
                  {link.label}
                </h3>
                <p className="text-xs text-zinc-500">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="pb-12">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 mb-4">
            Latest Updates
          </h2>
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-white/5 text-center">
            <p className="text-zinc-400 mb-4">
              Stay tuned for the latest cricket statistics and player performances
            </p>
            <Link
              href="/players"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Explore Players
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
