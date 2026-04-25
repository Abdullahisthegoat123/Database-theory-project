"use client"
import { Tournament } from "../../types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Search } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import Link from "next/link";

export default function AllTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const res = await fetch("http://localhost:8080/tournaments");
        if (!res.ok) throw new Error(
          `Failed to fetch tournaments: ${res.status} ${res.statusText}`
        );
        const data = await res.json();
        setTournaments(data);
        setFilteredTournaments(data);
      }
      catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTournaments(tournaments);
    } else {
      const filtered = tournaments.filter((tournament) =>
        tournament.tournament_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTournaments(filtered);
    }
  }, [searchQuery, tournaments]);

  const handleTournamentClick = (tournamentId: number) => {
    window.location.href = `/tournaments/${tournamentId}`;
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
            <span className="text-zinc-100">All Tournaments</span>
          </nav>
        </header>

        {/* Title Section */}
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 mb-2">
                Cricket Tournaments
              </h1>
              <p className="text-zinc-400">All Tournaments On Cricmate</p>
            </div>
            <a href="/addtournament">
              <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold">
                <Award className="w-4 h-4 mr-2" />
                Add Tournament
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
              placeholder="Search tournaments..."
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
              {searchQuery ? `Search Results (${filteredTournaments.length})` : "All Tournaments"}
            </h2>
            <p className="text-sm text-zinc-500">
              {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">Loading Tournaments...</p>
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-12 text-center">
              <p className="text-zinc-500">
                {searchQuery ? "No tournaments found matching your search." : "No tournaments found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament.tournament_id}
                  className="group cursor-pointer"
                  onClick={() =>
                    handleTournamentClick(tournament.tournament_id)
                  }
                >
                  <div className="p-6 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/70 border border-white/5 hover:border-orange-500/30 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-purple-400 transition-all">
                          {tournament.tournament_name}
                        </h3>
                        <p className="text-xs text-zinc-500">ID: {tournament.tournament_id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}