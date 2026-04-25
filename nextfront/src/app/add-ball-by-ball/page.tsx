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
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Match, Innings } from "../../../types";
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function addBallByBall() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [innings, setInnings] = useState<Innings[]>([]);

  const [matchId, setMatchId] = useState<number | null>(null);
  const [inningId, setInningId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [openC, setOpenC] = useState(false);
  const [openInnings, setOpenInnings] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

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

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("http://localhost:8080/matches");
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();
        setMatches(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  useEffect(() => {
    setInnings([]); // reset innings on match change
    setInningId(null);

    if (!matchId) return;
    const selectedMatch = matches.find((m) => m.match_id == matchId);
    if (!selectedMatch || !selectedMatch.innings) return;

    selectedMatch.innings.forEach((inn) => {
      setInnings((prev) => [...prev, inn]);
    });
  }, [matchId, matches]);

  function getMatchLabel(LocalMatchId: number | null) {
    if (!LocalMatchId) return "Select A Match";
    const selectedMatch = matches.find((m) => m.match_id == LocalMatchId);
    if (!selectedMatch) return "Select A Match";
    return `${selectedMatch.teamA?.team_name} vs ${selectedMatch.teamB?.team_name}`;
  }

  function getInningLabel(LocalInningId: number | null) {
    if (!LocalInningId) return "Select Inning";
    const selectedInning = innings.find((i) => i.innings_id === LocalInningId);
    if (!selectedInning) return "Select Inning";
    return `Inning ${selectedInning.innings_id}`;
  }

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center text-white">Checking access...</div>;

  return (
    <div className="mt-70 max-w-lg mx-auto bg-black p-6 rounded-md text-white">
      <h1 className="text-3xl font-bold mb-6">Add a New Ball by Ball Update</h1>

      <div className="flex flex-col gap-4">
        <FieldSet>
          <FieldLegend>Add Ball By Ball Insert</FieldLegend>
          <FieldDescription>
            First Select the Match, Then Innings, and finally the ball by ball
            details
          </FieldDescription>

          {/* Match Name */}
          <Field>
            <FieldLabel>Match</FieldLabel>
            <FieldContent>
              <Popover open={openC} onOpenChange={setOpenC}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-black"
                  >
                    {getMatchLabel(matchId)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-black text-white">
                  <Command className="bg-black text-white">
                    <CommandInput placeholder="Search match..." />
                    <CommandList>
                      <CommandEmpty>No Match found.</CommandEmpty>
                      <CommandGroup>
                        {matches.map((m) => (
                          <CommandItem
                            className="text-white"
                            key={m.match_id}
                            onSelect={() => {
                              setMatchId(m.match_id);
                              setOpenC(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                matchId === m.match_id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {m.teamA?.team_name} vs {m.teamB?.team_name} — ID:{" "}
                            {m.match_id}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FieldContent>
          </Field>

          {/* Inning Selector */}
          <Field>
            <FieldLabel>Inning</FieldLabel>
            <FieldContent>
              <Popover open={openInnings} onOpenChange={setOpenInnings}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-black"
                    disabled={innings.length === 0}
                  >
                    {getInningLabel(inningId)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-black text-white">
                  <Command className="bg-black text-white">
                    <CommandInput placeholder="Search inning..." />
                    <CommandList>
                      <CommandEmpty>No Inning found.</CommandEmpty>
                      <CommandGroup>
                        {innings.map((inn, i) => (
                          <CommandItem
                            className="text-white"
                            key={inn.innings_id}
                            onSelect={() => {
                              setInningId(inn.innings_id);
                              setOpenInnings(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                inningId === inn.innings_id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            ID: {inn.innings_id} Batting: {inn.battingTeam.team_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FieldContent>
          </Field>
        </FieldSet>
      </div>
    </div>
  );
}
