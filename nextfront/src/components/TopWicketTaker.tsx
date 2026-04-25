"use client";

import React from "react";

interface WicketTaker {
  playerId: number;
  playerName: string;
  wickets: number;
  image?: string; // optional future field
}

interface Props {
  wicketTakers: WicketTaker[];
  team: string;
}

export default function TopWicketTakers({ wicketTakers, team }: Props) {
  const [activeTab, setActiveTab] = React.useState("Overall");

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
      <h3 className="text-lg font-bold text-white mb-3">Top Wicket Takers</h3>
      <p className="text-xs text-zinc-400 mb-4">All formats</p>

      <div className="flex gap-2 mb-4 border-b border-zinc-800">
        {["Overall"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-medium transition ${activeTab === tab
                ? "border-b-2 border-white text-white"
                : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {wicketTakers.length === 0 && (
          <p className="text-zinc-500 text-sm">No bowlers available.</p>
        )}

        {wicketTakers.map((bowler) => (
          <div key={bowler.playerId} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
              {bowler.playerName.charAt(0)}
            </div>

            <div className="flex flex-col flex-1">
              <div className="flex flex-row items-center justify-between w-full">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    {bowler.playerName}
                  </p>
                  <p className="text-xs text-zinc-500 font-light ">
                    {team}
                  </p>
                </div>
                <p className="text-lg font-bold text-white">{bowler.wickets}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
