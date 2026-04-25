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
import { Check, ChevronsUpDown, Trophy } from "lucide-react";
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
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

import { Tournament, Team } from "../../../types";

export default function AddMatchPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamA, setTeamA] = useState<number | null>(null);
  const [teamB, setTeamB] = useState<number | null>(null);
  const [tournament, setTournament] = useState<number | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [matchState, setMatchState] = useState("");
  const [matchFormat, setMatchFormat] = useState("");
  const [venue, setVenue] = useState("");

  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [openC, setOpenC] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const [messageType, setMessageType] = useState<"success" | "error">("success");

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
  }, []);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const res = await fetch("http://localhost:8080/tournaments");
        if (!res.ok) throw new Error("Failed to fetch Tournaments");
        const data = await res.json();
        setTournaments(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTournaments();
  }, []);

  const handleSubmit = async () => {
    if (!teamA || !teamB) {
      setMessage("Both teams are required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamA: { team_id: teamA },
          teamB: { team_id: teamB },
          matchDate: `${matchDate}T${matchTime}:00`,
          matchState: matchState,
          matchFormat: matchFormat,
          venue: venue,
          tournament: tournament ? { tournament_id: tournament } : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add match");

      const data = await res.json();

      setMessage(`Match added successfully! ID: ${data.match_id}`);
      setMessageType("success");

      // Reset
      setTeamA(null);
      setTeamB(null);
      setMatchDate("");
      setMatchTime("");
      setMatchState("");
      setMatchFormat("");
      setVenue("");
      setTournament(null);
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

  const getTournamentLabel = (tournamentId: number | null) => {
    if (!tournamentId) return "Select Tournament...";
    const t = tournaments.find((x) => x.tournament_id === tournamentId);
    return t?.tournament_name || "Select Tournament...";
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
            <span className="text-zinc-100">Add Match</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                Add New Match
              </h1>
              <p className="text-zinc-400 mt-1">Schedule a new cricket match</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8 shadow-xl">
              <FieldSet>
                <FieldLegend className="text-2xl font-bold text-white mb-2">Match Details</FieldLegend>
                <FieldDescription className="text-zinc-400 mb-6">
                  Enter match details and select two teams.
                </FieldDescription>

                <div className="space-y-6">
                  {/* Teams Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel className="text-zinc-300">Team A *</FieldLabel>
                      <FieldContent>
                        <Popover open={openA} onOpenChange={setOpenA}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                            >
                              {getTeamLabel(teamA)}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                            <Command className="bg-zinc-950 text-white">
                              <CommandInput placeholder="Search team..." className="text-white" />
                              <CommandList>
                                <CommandEmpty>No team found.</CommandEmpty>
                                <CommandGroup>
                                  {teams.map((team) => (
                                    <CommandItem
                                      className="text-white hover:bg-zinc-900"
                                      key={team.team_id}
                                      onSelect={() => {
                                        setTeamA(team.team_id);
                                        setOpenA(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          teamA === team.team_id
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
                      <FieldLabel className="text-zinc-300">Team B *</FieldLabel>
                      <FieldContent>
                        <Popover open={openB} onOpenChange={setOpenB}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                            >
                              {getTeamLabel(teamB)}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                            <Command className="bg-zinc-950 text-white">
                              <CommandInput placeholder="Search team..." className="text-white" />
                              <CommandList>
                                <CommandEmpty>No team found.</CommandEmpty>
                                <CommandGroup>
                                  {teams.map((team) => (
                                    <CommandItem
                                      className="text-white hover:bg-zinc-900"
                                      key={team.team_id}
                                      onSelect={() => {
                                        setTeamB(team.team_id);
                                        setOpenB(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          teamB === team.team_id
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

                  {/* Date and Time */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-4">Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field>
                        <FieldLabel className="text-zinc-300">Date</FieldLabel>
                        <FieldContent>
                          <Input
                            type="date"
                            value={matchDate}
                            onChange={(e) => setMatchDate(e.target.value)}
                            className="bg-zinc-950 border-white/10 text-white focus:border-orange-500/50"
                          />
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel className="text-zinc-300">Time</FieldLabel>
                        <FieldContent>
                          <Input
                            type="time"
                            value={matchTime}
                            onChange={(e) => setMatchTime(e.target.value)}
                            className="bg-zinc-950 border-white/10 text-white focus:border-orange-500/50"
                          />
                        </FieldContent>
                      </Field>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-4">Match Information</h3>
                    <div className="space-y-6">
                      <Field>
                        <FieldLabel className="text-zinc-300">Venue</FieldLabel>
                        <FieldContent>
                          <Input
                            placeholder="e.g., Melbourne Cricket Ground"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                          />
                        </FieldContent>
                      </Field>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field>
                          <FieldLabel className="text-zinc-300">Match State</FieldLabel>
                          <FieldContent>
                            <Input
                              placeholder="e.g., UPCOMING, ONGOING, COMPLETED"
                              value={matchState}
                              onChange={(e) => setMatchState(e.target.value)}
                              className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                            />
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel className="text-zinc-300">Match Format</FieldLabel>
                          <FieldContent>
                            <Input
                              placeholder="e.g., T20, ODI, Test"
                              value={matchFormat}
                              onChange={(e) => setMatchFormat(e.target.value)}
                              className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                            />
                          </FieldContent>
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel className="text-zinc-300">Tournament</FieldLabel>
                        <FieldContent>
                          <Popover open={openC} onOpenChange={setOpenC}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                              >
                                {getTournamentLabel(tournament)}
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                              <Command className="bg-zinc-950 text-white">
                                <CommandInput placeholder="Search tournament..." className="text-white" />
                                <CommandList>
                                  <CommandEmpty>No Tournament found.</CommandEmpty>
                                  <CommandGroup>
                                    {tournaments.map((t) => (
                                      <CommandItem
                                        className="text-white hover:bg-zinc-900"
                                        key={t.tournament_id}
                                        onSelect={() => {
                                          setTournament(t.tournament_id);
                                          setOpenC(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            tournament === t.tournament_id
                                              ? "opacity-100 text-orange-500"
                                              : "opacity-0"
                                          )}
                                        />
                                        {t.tournament_name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FieldContent>
                        <FieldDescription className="text-zinc-500 mt-2">
                          Optional: Select a tournament for this match
                        </FieldDescription>
                      </Field>
                    </div>
                  </div>
                </div>
              </FieldSet>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !teamA || !teamB}
                  className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Match..." : "Add Match"}
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
                  <span>Both Team A and Team B are required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Date and time help organize the schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Tournament assignment is optional</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Use standard match states for consistency</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Match States</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-zinc-300">UPCOMING</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-zinc-300">ONGOING</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-zinc-300">COMPLETED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-zinc-300">ABANDONED</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Match Formats</h3>
              <div className="space-y-2 text-sm text-zinc-300">
                <p>• T20 (20 overs)</p>
                <p>• ODI (50 overs)</p>
                <p>• Test (5 days)</p>
                <p>• T10 (10 overs)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
