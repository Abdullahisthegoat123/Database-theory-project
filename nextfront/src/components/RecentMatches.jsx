"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RecentMatches() {
  const [matches, setMatches] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8080/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error(err));
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-zinc-950 max-w-7xl mx-auto text-white shadow-none overflow-hidden p-3 rounded-t-2xl rounded-b-none border border-white/5 border-b-white/5">
      <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-1">
        <h2 className="text-lg font-bold text-white">
          Recent Matches
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button
              onClick={() => scroll("left")}
              className="p-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          <Link href="/matches" className="text-[10px] font-medium text-zinc-500 hover:text-orange-500 transition-colors">
            View All &rarr;
          </Link>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-zinc-500 text-center py-8 flex flex-col items-center justify-center bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
          <span className="text-2xl mb-2 opacity-20">🏏</span>
          <p className="text-sm">No matches available</p>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-2 gap-3 [&::-webkit-scrollbar]:hidden"
        >
          {matches.map((m) => (
            <Link
              href={`/match/${m.match_id}`}
              key={m.match_id}
              className="group relative bg-zinc-900/40 p-3 rounded-xl min-w-[240px] border border-white/5 hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all duration-300 flex-shrink-0"
            >
              {/* Gradient accent on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 via-red-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-zinc-500 bg-zinc-950/50 px-1.5 py-0.5 rounded border border-white/5">
                    #{m.match_id}
                  </span>
                  <span className="text-[9px] font-medium text-zinc-400">
                    {m.matchDate
                      ? new Date(m.matchDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                      : "TBA"}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 my-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{m.teamA?.team_name || "Team A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{m.teamB?.team_name || "Team B"}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                  <div className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                    {m.venue || "Venue: Not decided"}
                  </div>
                  <div className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 uppercase">
                    {m.matchFormat || "T20"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
