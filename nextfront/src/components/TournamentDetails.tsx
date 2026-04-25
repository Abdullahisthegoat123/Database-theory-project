"use client";

import { useEffect, useState } from "react";
import { Match, Tournament } from "../../types";
import FixturesPanel from "./TeamFixtures";

interface Props {
    tournamentId: number;
}

export default function TournamentDetails({ tournamentId }: Props) {
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("fixtures");

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch tournament details
                const tournamentRes = await fetch(
                    `http://localhost:8080/tournaments/${tournamentId}`
                );
                const tournamentData = await tournamentRes.json();
                setTournament(tournamentData);

                // Fetch matches for the tournament
                const matchesRes = await fetch(
                    `http://localhost:8080/matches/tournament/${tournamentId}`
                );
                if (matchesRes.ok) {
                    const matchesData = await matchesRes.json();
                    if (Array.isArray(matchesData)) {
                        setMatches(matchesData);
                    } else {
                        console.error("Matches data is not an array:", matchesData);
                        setMatches([]);
                    }
                } else {
                    console.error("Failed to fetch matches:", matchesRes.statusText);
                    setMatches([]);
                }
            } catch (error) {
                console.error("Error fetching tournament data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [tournamentId]);

    if (loading) return <p className="text-zinc-400">Loading tournament...</p>;
    if (!tournament) return <p className="text-red-400">Tournament not found.</p>;

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950">
            <header className="border-zinc-800 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 pt-6">
                    <nav className="text-sm text-zinc-400">
                        <a href="/" className="hover:text-zinc-200 transition-colors">
                            Home
                        </a>
                        <span className="mx-2">/</span>
                        <a href="/tournaments" className="hover:text-zinc-200 transition-colors">
                            Tournaments
                        </a>
                        <span className="mx-2">/</span>
                        <span className="text-zinc-100">{tournament.tournament_name}</span>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight">
                    {tournament.tournament_name}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <FixturesPanel
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            matches={matches}
                        />
                    </div>

                    {/* Placeholder for stats or other info */}
                    <div className="lg:col-span-4">
                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                            <h3 className="text-lg font-bold text-white mb-4">Tournament Info</h3>
                            <p className="text-zinc-400 text-sm">
                                Details about {tournament.tournament_name} will appear here.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
