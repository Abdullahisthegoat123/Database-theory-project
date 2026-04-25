"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

interface Player {
  player_id: number;
  player_name: string;
}

export const metadata = {
  title: "Cricket Players",
  description: "Popular international cricket players",
};

export default function AllPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("http://localhost:8080/players");
        if (!res.ok) throw new Error("Failed to fetch players");
        const data = await res.json();
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter((player) =>
        player.player_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [searchQuery, players]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <nav className="text-sm text-zinc-400 mb-4">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-100">Cricket Players</span>
          </nav>
        </header>

        {/* Title Section */}
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 mb-2">
                Cricket Players
              </h1>
              <p className="text-zinc-400">Top Recognized Players On Cricmate</p>
            </div>
            <Link href="/addplayer">
              <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search players..."
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
              {searchQuery ? `Search Results (${filteredPlayers.length})` : "All Players"}
            </h2>
            <p className="text-sm text-zinc-500">
              {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">Loading players...</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-12 text-center">
              <p className="text-zinc-500">
                {searchQuery ? "No players found matching your search." : "No players found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlayers.map((player) => (
                <Link
                  key={player.player_id}
                  href={`/player/${player.player_id}`}
                  className="group"
                >
                  <div className="p-6 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/70 border border-white/5 hover:border-orange-500/30 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {player.player_name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-purple-400 transition-all">
                          {player.player_name || "Unknown Player"}
                        </h3>
                        <p className="text-xs text-zinc-500">Player ID: {player.player_id}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
