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
import { Check, ChevronsUpDown, UserPlus, X } from "lucide-react";
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


interface Team {
  team_id: number;
  team_name: string;
}

export default function AddPlayerPage() {
  const [playerName, setPlayerName] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [battingStyle, setBattingStyle] = useState("");
  const [bowlingStyle, setBowlingStyle] = useState("");
  const [playingRole, setPlayingRole] = useState("");

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [open, setOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!router) return; // wait for router

    async function checkLogin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("You must log in first.");
        router.push("/admin/auth");
        // user is not logged in → redirect to lo gin
        // window.location.href = "/admin/auth";
        return;
      }

      // Fetch the profile to check if user is admin
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error || !profiles?.is_admin) {
        // Not an admin → redirect or show error
        toast.error("You do not have admin access.");
        // setTimeout(() => router.push("/"), 2000);
        router.push("/");

        // window.location.href = "/";
        return;
      }
      setCheckingAuth(false);

    }
    checkLogin()
  }, [router]);



  // Fetch all teams
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

  const toggleTeamSelection = (teamId: number) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const removeTeam = (teamId: number) => {
    setSelectedTeamIds((prev) => prev.filter((id) => id !== teamId));
  };

  const getSelectedTeamsLabel = () => {
    if (selectedTeamIds.length === 0) return "Select teams...";
    if (selectedTeamIds.length === 1) {
      const team = teams.find((t) => t.team_id === selectedTeamIds[0]);
      return team?.team_name || "Select teams...";
    }
    return `${selectedTeamIds.length} teams selected`;
  };

  const handleSubmit = async () => {
    if (!playerName || !fullName) {
      setMessage("Player Name and Full Name are required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_name: playerName,
          full_name: fullName,
          date_of_birth: dob,
          batting_style: battingStyle,
          bowling_style: bowlingStyle,
          playing_role: playingRole,
          teams: selectedTeamIds.map((id) => ({ team_id: id })),
        }),
      });

      if (!res.ok) throw new Error("Failed to add player");
      const data = await res.json();
      setMessage(
        `Player "${data.player_name}" added successfully! ID: ${data.player_id}`
      );
      setMessageType("success");

      // Reset form
      setPlayerName("");
      setFullName("");
      setDob("");
      setBattingStyle("");
      setBowlingStyle("");
      setPlayingRole("");
      setSelectedTeamIds([]);
    } catch (err) {
      setMessage(`Error: ${err}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
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
            <Link href="/players" className="hover:text-zinc-200 transition-colors">
              Players
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-100">Add Player</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                Add New Player
              </h1>
              <p className="text-zinc-400 mt-1">Create a new player profile for CricMate</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8 shadow-xl">
              <FieldSet>
                <FieldLegend className="text-2xl font-bold text-white mb-2">Player Information</FieldLegend>
                <FieldDescription className="text-zinc-400 mb-6">
                  Fill in the player's details and assign teams.
                </FieldDescription>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel htmlFor="playerName" className="text-zinc-300">Player Name *</FieldLabel>
                      <FieldContent>
                        <Input
                          id="playerName"
                          placeholder="Sachin"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                        />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="fullName" className="text-zinc-300">Full Name *</FieldLabel>
                      <FieldContent>
                        <Input
                          id="fullName"
                          placeholder="Sachin Tendulkar"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="dob" className="text-zinc-300">Date of Birth</FieldLabel>
                    <FieldContent>
                      <Input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="bg-zinc-950 border-white/10 text-white focus:border-orange-500/50"
                      />
                    </FieldContent>
                  </Field>

                  {/* Playing Style */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-4">Playing Style</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field>
                        <FieldLabel htmlFor="battingStyle" className="text-zinc-300">Batting Style</FieldLabel>
                        <FieldContent>
                          <Input
                            id="battingStyle"
                            placeholder="Left hand Bat"
                            value={battingStyle}
                            onChange={(e) => setBattingStyle(e.target.value)}
                            className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                          />
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="bowlingStyle" className="text-zinc-300">Bowling Style</FieldLabel>
                        <FieldContent>
                          <Input
                            id="bowlingStyle"
                            placeholder="Legbreak"
                            value={bowlingStyle}
                            onChange={(e) => setBowlingStyle(e.target.value)}
                            className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                          />
                        </FieldContent>
                      </Field>
                    </div>

                    <Field className="mt-6">
                      <FieldLabel htmlFor="playingRole" className="text-zinc-300">Playing Role</FieldLabel>
                      <FieldContent>
                        <Input
                          id="playingRole"
                          placeholder="Top order Batter"
                          value={playingRole}
                          onChange={(e) => setPlayingRole(e.target.value)}
                          className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  {/* Team Assignment */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-4">Team Assignment</h3>
                    <Field>
                      <FieldLabel className="text-zinc-300">Assign Teams</FieldLabel>
                      <FieldContent>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                            >
                              {getSelectedTeamsLabel()}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                            <Command className="bg-zinc-950 text-white">
                              <CommandInput placeholder="Search teams..." className="text-white" />
                              <CommandList>
                                <CommandEmpty>No team found.</CommandEmpty>
                                <CommandGroup>
                                  {teams.map((team) => (
                                    <CommandItem
                                      key={team.team_id}
                                      value={team.team_name}
                                      className="text-white hover:bg-zinc-900"
                                      onSelect={() => toggleTeamSelection(team.team_id)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedTeamIds.includes(team.team_id)
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
                      <FieldDescription className="text-zinc-500 mt-2">
                        Select multiple teams for this player
                      </FieldDescription>
                    </Field>

                    {selectedTeamIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedTeamIds.map((id) => {
                          const team = teams.find((t) => t.team_id === id);
                          return team ? (
                            <div
                              key={id}
                              className="group flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg hover:border-orange-500/30 transition-colors"
                            >
                              <span className="text-sm text-zinc-300">{team.team_name}</span>
                              <button
                                onClick={() => removeTeam(id)}
                                className="text-zinc-500 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </FieldSet>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !playerName || !fullName}
                  className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Player..." : "Add Player"}
                </Button>
                <Link href="/players" className="flex-shrink-0">
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
                  <span>Player Name and Full Name are required fields</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>You can assign a player to multiple teams</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>All other fields are optional but recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Use standard cricket terminology for styles and roles</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Examples</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-zinc-500 mb-1">Batting Style:</p>
                  <p className="text-zinc-300">Right hand Bat, Left hand Bat</p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Bowling Style:</p>
                  <p className="text-zinc-300">Fast, Medium, Legbreak, Offbreak</p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Playing Role:</p>
                  <p className="text-zinc-300">Batter, Bowler, All-rounder, Wicket Keeper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
