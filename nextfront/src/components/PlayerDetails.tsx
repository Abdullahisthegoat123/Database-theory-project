"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PlayerWithTeams, Player } from "../../types";
import { PlayerStats } from "./PlayerStats";

export default function PlayerProfile() {
  const params = useParams();
  const playerId = Number(params.id);

  const [player, setPlayer] = useState<PlayerWithTeams | null>(null);
  const [playerExtra, setPlayerExtra] = useState<Player | null>(null);
  const [relatedPlayers, setRelatedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const [resFull, resExtra] = await Promise.all([
          fetch(`http://localhost:8080/players/full/${playerId}`),
          fetch(`http://localhost:8080/players/${playerId}`),
        ]);

        if (!resFull.ok) throw new Error("Failed to fetch full player");
        if (!resExtra.ok) throw new Error("Failed to fetch extra player");

        setPlayer(await resFull.json());
        setPlayerExtra(await resExtra.json());
        
        
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (playerId) fetchPlayerData();
  }, [playerId]);

  useEffect(()=>{
    const allPlayers: Player[] = [];

        // player?.teams.forEach((t)=>(
        //     setRelatedPlayers(
        //         (prev)=>(
        //             ...prev,
        //             t.players.
        //         )
        //     )
        // ))
        player?.teams.forEach(team => {
            team.players.forEach(p => {
                allPlayers.push(p);
            });
        });
        console.log(player?.teams)
         // remove duplicates
        const uniquePlayers = Array.from(
            new Map(allPlayers.map(p => [p.player_id, p])).values()
        );

        setRelatedPlayers(uniquePlayers);
                console.log(uniquePlayers);

        console.log(relatedPlayers)
  },[player])

  if (loading) return <p className="text-white p-6">Loading player...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!player) return <p className="text-gray-400 p-6">Player not found</p>;

  return (
    <div className="mt-70 dark min-h-screen bg-background text-foreground">
      <div className="flex gap-8 p-8 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <div className="w-80 shrink-0">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl p-6 mb-6 border border-border">
            <h1 className="text-3xl font-bold mb-2">{player.player_name}</h1>
            <p className="text-muted-foreground mb-4">
              Player ID: {player.player_id}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-card transition">
                <span>👤</span>
                <span className="text-sm font-medium">Compare</span>
              </button>
              <button className="p-2 rounded-full border border-border hover:bg-card transition">
                <span>📡</span>
              </button>
              <button className="p-2 rounded-full border border-border hover:bg-card transition">
                <span>↗️</span>
              </button>
            </div>

            {/* Player Image */}
            <div className="relative h-64 mb-6 rounded-xl overflow-hidden bg-linear-to-b from-muted to-background">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-card/80" />
            </div>

            {/* Career Info */}
            <div className="text-center py-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                INTL CAREER: 2025 - 2025
              </p>
            </div>
          </div>
          {/* Most Viewed Players */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-bold text-lg">Other Team Mates</h3>
            </div>
            <div className="space-y-3">
              {relatedPlayers.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-muted to-muted/50" />
                  <span className="text-sm">{t.player_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-border pb-4">
            {[
              { id: "overview", label: "Overview" },
              { id: "matches", label: "Matches" },
              { id: "videos", label: "Videos" },
              { id: "news", label: "News" },
              { id: "photos", label: "Photos" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-lg font-medium pb-3 relative transition ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      FULL NAME
                    </p>
                    <p className="text-xl font-bold">
                      {playerExtra?.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      BORN
                    </p>
                    <p className="text-xl font-bold">
                      {playerExtra?.date_of_birth}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      AGE
                    </p>
                    <p className="text-xl font-bold">{playerExtra?.age}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      BATTING STYLE
                    </p>
                    <p className="text-xl font-bold">
                      {playerExtra?.batting_style}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      BOWLING STYLE
                    </p>
                    <p className="text-xl font-bold">
                      {playerExtra?.bowling_style}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      PLAYING ROLE
                    </p>
                    <p className="text-xl font-bold">
                      {playerExtra?.playing_role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teams */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-bold mb-6">
                TEAMS
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {player.teams.map((team) => (
                  <Link
                    key={team.team_id}
                    href={`/teams/${team.team_id}`}
                    className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition"
                  >
                    <span className="text-2xl">🏏</span>
                    <span className="font-semibold">{team.team_name}</span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      ({team.players.length})
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Biography */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <p className="text-foreground leading-relaxed mb-4">
                Player biography and career information can be displayed here.
                You can add more dynamic info from API if available.
              </p>
              <button className="text-accent font-semibold hover:opacity-80 transition">
                View more →
              </button>
            </div>

            <PlayerStats playerId={playerId} />
          </div>
        </div>
      </div>
    </div>
  );
}
