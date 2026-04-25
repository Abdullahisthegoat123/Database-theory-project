"use client";

import { Match } from "../../types";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  matches: Match[];
}

export default function FixturesPanel({ activeTab, setActiveTab, matches }: Props) {
  const safeMatches = Array.isArray(matches) ? matches : [];
  const filteredMatches = safeMatches.filter((m) => {
    if (activeTab === "fixtures") {
      return m.matchState === "UPCOMING" || m.matchState === "ONGOING";
    } else {
      return (
        m.matchState === "COMPLETED" ||
        m.matchState === "ABANDONED" ||
        m.matchState === "NO_RESULT"
      );
    }
  });

  return (
    <div className="bg-zinc-950 rounded-2xl p-6 border border-white/10 shadow-xl">
      <div className="flex p-1 bg-zinc-900/80 rounded-xl mb-6 border border-white/5">
        <button
          onClick={() => setActiveTab("fixtures")}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === "fixtures"
              ? "bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white shadow-lg"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
        >
          Fixtures
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === "results"
              ? "bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white shadow-lg"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
        >
          Results
        </button>
      </div>

      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-zinc-500 text-center py-12 flex flex-col items-center justify-center bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
            <span className="text-4xl mb-3 opacity-20">🏏</span>
            <p>No {activeTab} found</p>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div
              key={match.match_id}
              className="group relative bg-zinc-900/40 rounded-xl p-4 border border-white/5 hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all duration-300"
            >
              {/* Gradient accent on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 via-red-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 uppercase tracking-wider mb-1">
                      {match.matchFormat}
                    </div>
                    <div className="text-xs font-medium text-zinc-400">
                      {match.matchDate
                        ? new Date(match.matchDate).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })
                        : "TBA"}
                    </div>
                  </div>
                  <div className="text-[10px] font-medium text-zinc-500 bg-zinc-950/50 px-2 py-1 rounded border border-white/5">
                    {match.venue?.split(',')[0]}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-zinc-100 text-sm">
                      {match.teamA?.team_name}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-zinc-600 bg-zinc-950 px-2 py-1 rounded-full">VS</div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-zinc-100 text-sm">
                      {match.teamB?.team_name}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <div className="text-xs font-medium text-zinc-400">
                    {match.matchState === "UPCOMING" ? (
                      <span className="text-orange-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                        Upcoming
                      </span>
                    ) : match.matchWinnerTeam ? (
                      <span className="text-purple-400">
                        {match.matchWinnerTeam.team_name} won
                      </span>
                    ) : (
                      <span className="text-zinc-500">{match.result || match.matchState}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
