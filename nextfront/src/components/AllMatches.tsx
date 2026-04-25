"use client";
import { Team, Match } from "../../types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Search, Calendar, Pencil, Check, ChevronsUpDown } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";

export default function AllMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    matchState: "",
    matchFormat: "",
    venue: "",
    matchDate: "",
    tossWinnerTeamId: null as number | null,
    tossDecision: "",
    matchWinnerTeamId: null as number | null,
    tournamentId: null as number | null,
  });

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("http://localhost:8080/matches");
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();
        setMatches(data);
        setFilteredMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMatches(matches);
    } else {
      const filtered = matches.filter((match) =>
        match.teamA?.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.teamB?.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.venue?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMatches(filtered);
    }
  }, [searchQuery, matches]);

  const handleMatchClick = (matchId: number) => {
    window.location.href = `/match/${matchId}`;
  };

  const getMatchStateColor = (state?: string) => {
    switch (state?.toUpperCase()) {
      case "ONGOING":
        return "bg-red-500/10 border-red-500/50 text-red-500";
      case "UPCOMING":
        return "bg-blue-500/10 border-blue-500/50 text-blue-500";
      case "COMPLETED":
        return "bg-green-500/10 border-green-500/50 text-green-500";
      default:
        return "bg-zinc-800 border-white/10 text-zinc-400";
    }
  };

  const handleEditMatch = (match: Match, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMatch(match);
    setEditFormData({
      matchState: match.matchState || "",
      matchFormat: match.matchFormat || "",
      venue: match.venue || "",
      matchDate: match.matchDate || "",
      tossWinnerTeamId: match.tossWinnerTeam?.team_id || null,
      tossDecision: match.tossDecision || "",
      matchWinnerTeamId: match.matchWinnerTeam?.team_id || null,
      tournamentId: match.tournament?.tournament_id || null,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateMatch = async () => {
    if (!editingMatch) return;

    setEditLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/matches/${editingMatch.match_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        console.log("Match updated successfully");
        setEditDialogOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error updating match:", err);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <nav className="text-sm text-zinc-400 mb-4">
            <a href="/" className="hover:text-zinc-200 transition-colors">
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="text-zinc-100">Cricket Matches</span>
          </nav>
        </header>

        {/* Title Section */}
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 mb-2">
                Cricket Matches
              </h1>
              <p className="text-zinc-400">All Matches On Cricmate</p>
            </div>
            <a href="/addmatch">
              <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold">
                <Trophy className="w-4 h-4 mr-2" />
                Add Match
              </Button>
            </a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search matches by team or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-orange-500/50"
            />
          </div>
        </div>

        {/* Main Content */}
        <main>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-1">
              {searchQuery ? `Search Results (${filteredMatches.length})` : "All Matches"}
            </h2>
            <p className="text-sm text-zinc-500">
              {filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""} found
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">Loading matches...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-12 text-center">
              <p className="text-zinc-500">
                {searchQuery ? "No matches found matching your search." : "No matches found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMatches.map((match) => (
                <div
                  key={match.match_id}
                  className="group cursor-pointer bg-zinc-900/50 hover:bg-zinc-900/70 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-xl"
                  onClick={() => handleMatchClick(match.match_id)}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-zinc-400 min-w-[140px]">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{match.matchDate || "TBA"}</span>
                      </div>

                      {/* Teams */}
                      <div className="flex-1 flex items-center justify-center gap-4">
                        <div className="text-right flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-purple-400 transition-all">
                            {match.teamA?.team_name || "Team A"}
                          </h3>
                        </div>
                        <div className="px-4 py-2 bg-zinc-950 rounded-lg border border-white/10">
                          <span className="text-sm font-bold text-zinc-400">VS</span>
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-purple-400 transition-all">
                            {match.teamB?.team_name || "Team B"}
                          </h3>
                        </div>
                      </div>

                      {/* Match State */}
                      <div className="flex items-center gap-3 min-w-[220px] justify-end">
                        {match.matchFormat && (
                          <span className="text-xs font-bold text-zinc-500 bg-zinc-950 px-3 py-1 rounded border border-white/5">
                            {match.matchFormat}
                          </span>
                        )}
                        <span className={`text-xs font-bold px-3 py-1 rounded border ${getMatchStateColor(match.matchState)}`}>
                          {match.matchState || "UNKNOWN"}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleEditMatch(match, e)}
                          className="bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:border-orange-500/50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Venue */}
                    {match.venue && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-sm text-zinc-500">
                          <span className="text-zinc-600">Venue:</span> {match.venue}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Edit Match Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                Edit Match Details
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Update match information
              </DialogDescription>
            </DialogHeader>

            {editingMatch && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel className="text-zinc-300 text-sm">Match State</FieldLabel>
                    <select
                      value={editFormData.matchState}
                      onChange={(e) => setEditFormData({ ...editFormData, matchState: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 text-white rounded-md px-3 py-2 focus:border-orange-500/50 focus:outline-none"
                    >
                      <option value="">Select State</option>
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="ONGOING">ONGOING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="ABANDONED">ABANDONED</option>
                    </select>
                  </Field>

                  <Field>
                    <FieldLabel className="text-zinc-300 text-sm">Match Format</FieldLabel>
                    <select
                      value={editFormData.matchFormat}
                      onChange={(e) => setEditFormData({ ...editFormData, matchFormat: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 text-white rounded-md px-3 py-2 focus:border-orange-500/50 focus:outline-none"
                    >
                      <option value="">Select Format</option>
                      <option value="T20">T20</option>
                      <option value="ODI">ODI</option>
                      <option value="Test">Test</option>
                      <option value="T10">T10</option>
                    </select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel className="text-zinc-300 text-sm">Venue</FieldLabel>
                  <Input
                    type="text"
                    value={editFormData.venue}
                    onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                    className="bg-zinc-900 border-white/10 text-white focus:border-orange-500/50"
                    placeholder="Enter venue"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-zinc-300 text-sm">Match Date</FieldLabel>
                  <Input
                    type="datetime-local"
                    value={editFormData.matchDate}
                    onChange={(e) => setEditFormData({ ...editFormData, matchDate: e.target.value })}
                    className="bg-zinc-900 border-white/10 text-white focus:border-orange-500/50"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel className="text-zinc-300 text-sm">Toss Winner</FieldLabel>
                    <select
                      value={editFormData.tossWinnerTeamId || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, tossWinnerTeamId: e.target.value ? Number(e.target.value) : null })}
                      className="w-full bg-zinc-900 border border-white/10 text-white rounded-md px-3 py-2 focus:border-orange-500/50 focus:outline-none"
                    >
                      <option value="">Select Team</option>
                      <option value={editingMatch.teamA?.team_id}>{editingMatch.teamA?.team_name}</option>
                      <option value={editingMatch.teamB?.team_id}>{editingMatch.teamB?.team_name}</option>
                    </select>
                  </Field>

                  <Field>
                    <FieldLabel className="text-zinc-300 text-sm">Toss Decision</FieldLabel>
                    <select
                      value={editFormData.tossDecision}
                      onChange={(e) => setEditFormData({ ...editFormData, tossDecision: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 text-white rounded-md px-3 py-2 focus:border-orange-500/50 focus:outline-none"
                    >
                      <option value="">Select Decision</option>
                      <option value="BAT">BAT</option>
                      <option value="FIELD">FIELD</option>
                    </select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel className="text-zinc-300 text-sm">Match Winner</FieldLabel>
                  <select
                    value={editFormData.matchWinnerTeamId || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, matchWinnerTeamId: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-zinc-900 border border-white/10 text-white rounded-md px-3 py-2 focus:border-orange-500/50 focus:outline-none"
                  >
                    <option value="">Select Winner</option>
                    <option value={editingMatch.teamA?.team_id}>{editingMatch.teamA?.team_name}</option>
                    <option value={editingMatch.teamB?.team_id}>{editingMatch.teamB?.team_name}</option>
                  </select>
                </Field>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="bg-zinc-900 border-white/10 text-white hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateMatch}
                disabled={editLoading}
                className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold"
              >
                {editLoading ? "Updating..." : "Update Match"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
