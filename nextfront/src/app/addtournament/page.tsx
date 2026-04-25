"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

import React, { useState, useEffect } from "react";

export default function AddTournament() {
  const [tournamentName, setTournamentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tournamentName.trim()) {
      setMessage("Tournament name is required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournament_name: tournamentName }),
      });

      if (!res.ok) throw new Error("Failed to add tournament");

      const data = await res.json();
      setMessage(
        `Tournament "${data.tournament_name}" added successfully! ID: ${data.tournament_id}`
      );
      setMessageType("success");
      setTournamentName("");
    } catch (err) {
      setMessage(`Error: ${err}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

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
            <Link href="/tournaments" className="hover:text-zinc-200 transition-colors">
              Tournaments
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-100">Add Tournament</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                Add New Tournament
              </h1>
              <p className="text-zinc-400 mt-1">Create a new cricket tournament</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8 shadow-xl">
              <form onSubmit={handleSubmit}>
                <FieldSet>
                  <FieldLegend className="text-2xl font-bold text-white mb-2">
                    Tournament Information
                  </FieldLegend>
                  <FieldDescription className="text-zinc-400 mb-6">
                    Enter the tournament name to add a new cricket tournament.
                  </FieldDescription>

                  <div className="space-y-6">
                    <Field>
                      <FieldLabel htmlFor="tournamentName" className="text-zinc-300">
                        Tournament Name *
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="tournamentName"
                          placeholder="e.g., ICC World Cup 2024"
                          value={tournamentName}
                          onChange={(e) => setTournamentName(e.target.value)}
                          className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                          required
                        />
                      </FieldContent>
                      <FieldDescription className="text-zinc-500 mt-2">
                        This will be shown on the tournament list and match details.
                      </FieldDescription>
                    </Field>
                  </div>
                </FieldSet>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                  <Button
                    type="submit"
                    disabled={loading || !tournamentName.trim()}
                    className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Adding Tournament..." : "Add Tournament"}
                  </Button>
                  <Link href="/tournaments" className="flex-shrink-0">
                    <Button
                      type="button"
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
              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Tournament name is required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Use descriptive names for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Include year for seasonal tournaments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Matches can be assigned to tournaments later</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Examples</h3>
              <div className="space-y-3 text-sm text-zinc-300">
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <p className="font-medium">ICC World Cup 2024</p>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <p className="font-medium">Indian Premier League 2024</p>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <p className="font-medium">The Ashes 2023</p>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <p className="font-medium">Big Bash League 2023-24</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Tournament Types</h3>
              <div className="space-y-2 text-sm text-zinc-300">
                <p>• International Tournaments</p>
                <p>• Domestic Leagues</p>
                <p>• Bilateral Series</p>
                <p>• T20 Leagues</p>
                <p>• Test Championships</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
