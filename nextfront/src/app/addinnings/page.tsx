"use client";
import { useState, useEffect } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Check, ChevronsUpDown, ListPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Team, Match } from "../../../types";
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function AddInnings() {
  const [matchId, setMatchId] = useState<number | null>(null);
  const [battingTeam, setBattingTeam] = useState<number | null>(null);
  const [bowlingTeam, setBowlingTeam] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matchTeams, setMatchTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [openC, setOpenC] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!router) return;

    async function checkLogin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("You must log in first.");
        router.push("/admin/auth");
        return;
      }

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error || !profiles?.is_admin) {
        toast.error("You do not have admin access.");
        router.push("/");
        return;
      }
      setCheckingAuth(false);
    }
    checkLogin();
  }, [router]);

  // Fetch teams
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("http://localhost:8080/teams");
        if (!res.ok) throw new Error("Failed to fetch teams");
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTeams();
  }, [matchId]);

  // Fetch Matches
  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("http://localhost:8080/matches");
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMatches();
  }, []);

  useEffect(() => {
    if (!matchId) return;
    const match = matches.find((m) => m.match_id == matchId);
    if (!match) return;

    if (typeof match.teamA === "object" && match.teamA && match.teamB) {
      setMatchTeams([match.teamA, match.teamB]);
    } else {
      const tA = teams.find((t) => t.team_id === match.teamA?.team_id);
      const tB = teams.find((t) => t.team_id === match.teamB?.team_id);
      setMatchTeams([tA, tB].filter(Boolean) as Team[]);
    }
  }, [matchId]);

  const handleSubmit = async () => {
    if (!matchId || !battingTeam || !bowlingTeam) {
      setMessage("Match, batting team, and bowling team are all required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/innings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match: { match_id: matchId },
          battingTeam: { team_id: battingTeam },
          bowlingTeam: { team_id: bowlingTeam },
        }),
      });

      if (!res.ok) throw new Error("Failed to add innings");

      const data = await res.json();

      setMessage(`Innings added successfully! ID: ${data.innings_id}`);
      setMessageType("success");

      // Reset
      setBattingTeam(null);
      setBowlingTeam(null);
      setMatchId(null);
      setMatchTeams([]);
    } catch (err) {
      setMessage(`Error: ${err}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getTeamLabel = (teamId: number | null) => {
    if (!teamId) return "Select team...";
    const t = teams.find((x) => x.team_id === teamId);
    return t?.team_name || "Select team...";
  };

  const getMatchLabel = (matchid: number | null) => {
    if (!matchid) return "Select Match...";
    const match = matches.find((x) => x.match_id === matchid);
    if (!match) return "Select Match...";
    return `Match #${match.match_id}: ${match.teamA?.team_name || "Team A"} vs ${match.teamB?.team_name || "Team B"}`;
  };

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center text-white">Checking access...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <nav className="text-sm text-zinc-400 mb-4">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/matches" className="hover:text-zinc-200 transition-colors">
              Matches
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-100">Add Innings</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              <ListPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                Add New Innings
              </h1>
              <p className="text-zinc-400 mt-1">Create a new innings for a match</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8 shadow-xl">
              <FieldSet>
                <FieldLegend className="text-2xl font-bold text-white mb-2">Innings Details</FieldLegend>
                <FieldDescription className="text-zinc-400 mb-6">
                  Select a match and assign batting and bowling teams.
                </FieldDescription>

                <div className="space-y-6">
                  {/* Match Selection */}
                  <Field>
                    <FieldLabel className="text-zinc-300">Match *</FieldLabel>
                    <FieldContent>
                      <Popover open={openC} onOpenChange={setOpenC}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                          >
                            {getMatchLabel(matchId)}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                          <Command className="bg-zinc-950 text-white">
                            <CommandInput placeholder="Search match..." className="text-white" />
                            <CommandList>
                              <CommandEmpty>No Match found.</CommandEmpty>
                              <CommandGroup>
                                {matches.map((m) => (
                                  <CommandItem
                                    className="text-white hover:bg-zinc-900"
                                    key={m.match_id}
                                    onSelect={() => {
                                      setMatchId(m.match_id);
                                      setOpenC(false);
                                      setBattingTeam(null);
                                      setBowlingTeam(null);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        matchId === m.match_id
                                          ? "opacity-100 text-orange-500"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span>Match #{m.match_id}</span>
                                      <span className="text-xs text-zinc-500">
                                        {m.teamA?.team_name} vs {m.teamB?.team_name}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FieldContent>
                    <FieldDescription className="text-zinc-500 mt-2">
                      Select the match for which you want to add an innings
                    </FieldDescription>
                  </Field>

                  {/* Teams Section */}
                  {matchId && matchTeams.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                      <h3 className="text-lg font-semibold text-white mb-4">Team Roles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field>
                          <FieldLabel className="text-zinc-300">Batting Team *</FieldLabel>
                          <FieldContent>
                            <Popover open={openA} onOpenChange={setOpenA}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                                >
                                  {getTeamLabel(battingTeam)}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                                <Command className="bg-zinc-950 text-white">
                                  <CommandInput placeholder="Search team..." className="text-white" />
                                  <CommandList>
                                    <CommandEmpty>No team found.</CommandEmpty>
                                    <CommandGroup>
                                      {matchTeams.map((team) => (
                                        <CommandItem
                                          className="text-white hover:bg-zinc-900"
                                          key={team.team_id}
                                          onSelect={() => {
                                            setBattingTeam(team.team_id);
                                            setOpenA(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              battingTeam === team.team_id
                                                ? "opacity-100 text-orange-500"
                                                : "opacity-0"
                                            )}
                                          />
                                          {team.team_name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel className="text-zinc-300">Bowling Team *</FieldLabel>
                          <FieldContent>
                            <Popover open={openB} onOpenChange={setOpenB}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                                >
                                  {getTeamLabel(bowlingTeam)}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                                <Command className="bg-zinc-950 text-white">
                                  <CommandInput placeholder="Search team..." className="text-white" />
                                  <CommandList>
                                    <CommandEmpty>No team found.</CommandEmpty>
                                    <CommandGroup>
                                      {matchTeams.map((team) => (
                                        <CommandItem
                                          className="text-white hover:bg-zinc-900"
                                          key={team.team_id}
                                          onSelect={() => {
                                            setBowlingTeam(team.team_id);
                                            setOpenB(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              bowlingTeam === team.team_id
                                                ? "opacity-100 text-orange-500"
                                                : "opacity-0"
                                            )}
                                          />
                                          {team.team_name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FieldContent>
                        </Field>
                      </div>
                    </div>
                  )}

                  {!matchId && (
                    <div className="p-4 bg-zinc-900 rounded-lg border border-white/5 text-center">
                      <p className="text-zinc-400 text-sm">Please select a match first to choose teams</p>
                    </div>
                  )}
                </div>
              </FieldSet>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !matchId || !battingTeam || !bowlingTeam}
                  className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Innings..." : "Add Innings"}
                </Button>
                <Link href="/matches" className="flex-shrink-0">
                  <Button
                    variant="outline"
                    className="bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 py-6 px-8"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`mt-6 p-4 rounded-lg border ${messageType === "success"
                    ? "bg-green-500/10 border-green-500/20 text-green-500"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
                    }`}
                >
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Select a match first to see available teams</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Batting team scores runs in this innings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Bowling team tries to get wickets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>All fields are required to create an innings</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">What is an Innings?</h3>
              <p className="text-sm text-zinc-400 mb-3">
                An innings is a period in which one team bats while the other team bowls and fields.
              </p>
              <p className="text-sm text-zinc-400">
                Most cricket matches have 2 innings (one per team), but some formats may have more.
              </p>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Next Steps</h3>
              <div className="space-y-2 text-sm text-zinc-300">
                <p>After creating an innings:</p>
                <ul className="space-y-1 ml-4 mt-2">
                  <li>• Add ball-by-ball data</li>
                  <li>• Track runs and wickets</li>
                  <li>• View scorecard</li>
                  <li>• Generate commentary</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
