"use client"
import { Pencil } from "lucide-react";
import { Player, Ball, Team, Innings, Match, Tournament } from "../../types";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";



export default function MatchSummary({ match }: { match: Match }) {
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
  const calculateScore = (innings: Innings) => {
    if (!innings || !innings.balls) return { runs: 0, wickets: 0, overs: "0.0" };

    const runs = innings.balls.reduce((acc, ball) => acc + ball.runs, 0);
    const wickets = innings.balls.filter((ball) => ball.wicket).length;
    const validBalls = innings.balls.length; // Assuming all balls in array are valid deliveries for now
    const overs = `${Math.floor(validBalls / 6)}.${validBalls % 6}`;

    return { runs, wickets, overs };
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
    <div className="bg-zinc-950 w-full max-w-7xl mx-auto mt-6 rounded-xl border border-white/5 shadow-lg p-6 relative overflow-hidden">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 opacity-50" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${match.matchState === 'LIVE' || match.matchState === 'ONGOING'
          ? 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'
          : 'bg-zinc-900 border-white/10 text-zinc-400'
          }`}>
          {match.matchState || "State"}
        </span>
        <span className="text-zinc-500">|</span>
        <span className="text-zinc-300 font-medium">Match {match.match_id}</span>
        <span className="text-zinc-500">|</span>
        <span className="text-zinc-400">{match.matchDate ? new Date(match.matchDate).toLocaleDateString() : "TBA"}</span>
        <span className="text-zinc-500">|</span>
        <span className="text-zinc-400">{match.venue || "Venue TBA"}</span>
        <span className="text-zinc-500">|</span>
        <span className="text-zinc-300 font-medium">{match.tournament?.tournament_name}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => handleEditMatch(match, e)}
          className="bg-zinc-900 border-white/10  text-white hover:text-white hover:bg-zinc-800 hover:border-orange-500/50"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Teams & Scores - Vertical Layout */}
      <div className="space-y-6 mb-8">
        {Array.isArray(match.innings) && match.innings.length > 0 ? (
          <>
            {/* Batting Team */}
            {match.innings.map((inn) => {
              const score = calculateScore(inn);
              return (
                <div key={inn.innings_id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl font-bold transition-colors ${inn.battingTeam.team_id === match.teamA?.team_id ? 'text-white group-hover:text-orange-400' : 'text-zinc-400 group-hover:text-purple-400'}`}>
                      {inn.battingTeam.team_name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-black ${inn.battingTeam.team_id === match.teamA?.team_id ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400' : 'text-zinc-300'}`}>
                      {score.runs}/{score.wickets}
                    </div>
                    <div className="text-xs text-zinc-500 font-medium mt-1">
                      {score.overs} Overs
                    </div>
                  </div>

                </div>
              );
            })}

            {/* If only one innings played, show second team waiting */}
            {match.innings.length === 1 && (
              <div className="flex justify-between items-center group opacity-60">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-zinc-500">
                    {match.innings[0].bowlingTeam.team_name}
                  </div>
                </div>
                <div className="text-3xl font-black text-zinc-700">
                  Yet to Bat
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-white hover:text-orange-400 transition-colors">
              {match.teamA?.team_name}
            </div>
            <div className="text-3xl font-bold text-zinc-400 hover:text-purple-400 transition-colors">
              {match.teamB?.team_name}
            </div>
          </>
        )}
      </div>

      {/* Footer Info (Toss & Result) */}
      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="flex items-start gap-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5 min-w-[60px]">Toss</span>
          <div className="text-sm text-zinc-300">
            {match.tossWinnerTeam ? (
              <>
                <span className="text-white font-semibold">{match.tossWinnerTeam.team_name}</span> won the toss and elected to <span className="text-white font-semibold">{match.tossDecision}</span> first
              </>
            ) : "Toss not yet decided"}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5 min-w-[60px]">Result</span>
          <div className="text-sm font-bold">
            {match.result ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                {match.result}
              </span>
            ) : <span className="text-zinc-500">Match in progress or scheduled</span>}
          </div>
        </div>
      </div>
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
  );
}
