"use client";

import TournamentDetails from "@/components/TournamentDetails";
import { useParams } from "next/navigation";

export default function TournamentPage() {
    const params = useParams();
    const tournamentId = Number(params.id);

    if (isNaN(tournamentId)) return <p className="text-red-400">Invalid tournament ID</p>;

    return (
        <div className="mt-70 w-full flex flex-col items-center text-white">
            <TournamentDetails tournamentId={tournamentId} />
        </div>
    );
}
