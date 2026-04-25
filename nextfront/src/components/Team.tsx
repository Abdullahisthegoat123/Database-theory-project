"use client";
import Link from "next/link";
import { Player, Ball, TeamWithPlayers, Match } from "../../types";
import { useEffect, useState } from "react";
import FixturesPanel from "./TeamFixtures";
import TopRunScorers from "./TopRunScores";
import TopWicketTakers from "./TopWicketTaker";
interface TeamPageProps {
  teamId: number;
}

interface Batsman {
  playerId: number;
  playerName: string;
  runs: number;
}
interface Bowler {
  playerId: number;
  playerName: string;
  wickets: number;
  image?: string;
}

export default function TeamDetails({ teamId }: TeamPageProps) {
  const [team, setTeam] = useState<TeamWithPlayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [topBatsmen, setTopBatsmen] = useState<Batsman[]>([]);
  const [bowlers, setBowlers] = useState<Bowler[]>([]);

  const [activeTab, setActiveTab] = useState("fixtures");

  // ✅ Fetch Top Run Scorers
  useEffect(() => {
    async function fetchTopScorers() {
      try {
        const res = await fetch(
          `http://localhost:8080/batting/topscorers/${teamId}`
        );

        if (!res.ok) {
          console.error("Could not fetch top batsmen");
          return;
        }

        const data = await res.json();
        console.log(data);

        setTopBatsmen(data);
      } catch (error) {
        console.error("Error fetching top scorers:", error);
      }
    }
    async function fetchWicketTakers() {
      try {
        const res = await fetch(`http://localhost:8080/bowling/topwickettakers/${teamId}`);
        const data = await res.json();
        setBowlers(data);
      } catch (err) {
        console.error("Error fetching wicket takers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWicketTakers();
    fetchTopScorers();
  }, [teamId]);

  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`http://localhost:8080/matches/team/${teamId}`);
        const data = await res.json();
        console.log(data);

        setMatches(data);
        console.log("FixturesPanel props:", { matches });
        console.log("Type of matches:", typeof matches);
        console.log("Is array:", Array.isArray(matches));
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    }
    fetchMatches();
  }, [teamId]);

  // ✅ Fetch Team Data
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(`http://localhost:8080/teams/full/${teamId}`);
        const data: TeamWithPlayers = await res.json();
        setTeam(data);
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, [teamId]);

  if (loading) return <p className="text-slate-300">Loading team...</p>;
  if (!team) return <p className="text-red-400">Team not found.</p>;

  return (
    <div className="mt-70 p-6 space-y-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <FixturesPanel activeTab={activeTab} setActiveTab={setActiveTab} matches={matches} />
          </div>

          {/* Main */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight">
              {team.team_name}
            </h1>

            <h2 className="text-2xl font-bold text-zinc-200 mb-6">Players</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.players?.map((player) => (
                <Link
                  key={player.player_id}
                  href={`/player/${player.player_id}`}
                  className="block"
                >
                  <div className="group relative p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors text-lg">
                          {player.player_name}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-0.5 font-medium">
                          {player.playing_role}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500 group-hover:text-zinc-300 group-hover:bg-zinc-700 transition-colors border border-zinc-700/50">
                        {player.player_name.charAt(0)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {player.batting_style && (
                        <span className="px-2.5 py-1 rounded-md bg-zinc-950 text-[11px] font-medium text-zinc-400 border border-zinc-800">
                          {player.batting_style}
                        </span>
                      )}
                      {player.bowling_style && (
                        <span className="px-2.5 py-1 rounded-md bg-zinc-950 text-[11px] font-medium text-zinc-400 border border-zinc-800">
                          {player.bowling_style}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-y-5">
            {/* ✅ Passing batsmen data */}
            <TopRunScorers batsmen={topBatsmen} team={team.team_name} />
            <TopWicketTakers
              wicketTakers={bowlers}
              team={team.team_name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
