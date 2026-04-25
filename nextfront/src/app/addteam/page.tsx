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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function AddTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [addedTeamId, setAddedTeamId] = useState("");
  const [addedTeamName, setAddedTeamName] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      setMessage("Team name is required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_name: teamName }),
      });

      if (!res.ok) throw new Error("Failed to add team");

      const data = await res.json();
      setMessage(`Team "${data.team_name}" added successfully! ID: ${data.team_id}`);
      setMessageType("success");
      setAddedTeamId(data.team_id);
      setAddedTeamName(data.team_name);
      setTeamName("");
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
            <Link href="/teams" className="hover:text-zinc-200 transition-colors">
              Teams
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-100">Add Team</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                Add New Team
              </h1>
              <p className="text-zinc-400 mt-1">Create a new cricket team</p>
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
                    Team Information
                  </FieldLegend>
                  <FieldDescription className="text-zinc-400 mb-6">
                    Enter the team name to add a new cricket team.
                  </FieldDescription>

                  <div className="space-y-6">
                    <Field>
                      <FieldLabel htmlFor="teamName" className="text-zinc-300">
                        Team Name *
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="teamName"
                          placeholder="e.g., India, Australia, England"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
                          required
                        />
                      </FieldContent>
                      <FieldDescription className="text-zinc-500 mt-2">
                        This will be shown on the team list and match details.
                      </FieldDescription>
                    </Field>
                  </div>
                </FieldSet>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                  <Button
                    type="submit"
                    disabled={loading || !teamName.trim()}
                    className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Adding Team..." : "Add Team"}
                  </Button>
                  <Link href="/teams" className="flex-shrink-0">
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
                  <span>Team name is required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Use official team names for consistency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Players can be added to teams later</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Teams can be used in matches and tournaments</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Examples</h3>
              <div className="space-y-3 text-sm text-zinc-300">
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <p className="font-medium">India</p>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <p className="font-medium">Australia</p>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <p className="font-medium">England</p>
                </div>
                <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <p className="font-medium">Mumbai Indians</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Team Types</h3>
              <div className="space-y-2 text-sm text-zinc-300">
                <p>• National Teams</p>
                <p>• Franchise Teams</p>
                <p>• Club Teams</p>
                <p>• Regional Teams</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
