"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Player, Ball, Team, Innings, Match } from "../../types";
import Commentary from "@/components/Commentary";
import Scorecard from "@/components/Scorecard";
import MatchSummary from "@/components/MatchSummary";
import Link from "next/link";

function MatchDetails() {
  const { id } = useParams(); // how does it know? - it probably matches the name
  /* <Route path="/match/:id" element={<MatchDetails />} /> */



  const [match, setMatch] = useState<Match | null>(null);
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState<"scorecard" | "commentary">(
    "scorecard"
  );

  useEffect(() => {
    fetch(`http://localhost:8080/matches/${id}`)
      .then((res) => res.json())
      .then((data) => { setMatch(data); console.log(data); setResult(data) })
      .catch((err) => console.error(err));
  }, [id]);

  if (!match) return <p className="text-white">Loading...</p>;

  return (
    <div className="mt-80 w-full">
      <div className=" bg-zinc-950 max-w-7xl mx-auto rounded-xl overflow-hidden">
        <MatchSummary match={match} />
        {/* Tabs */}
        <div className="flex bg-zinc-950 w-full justify-start mx-auto ">
          <div
            onClick={() => setActiveTab("scorecard")}
            className={`px-4 py-2   font-semibold transition cursor-pointer ${activeTab === "scorecard"
              ? "font-bold text-xl border-b-4 border-b-orange-500"
              : " text-lg"
              }`}
          >
            Scorecard
          </div>
          <div
            onClick={() => setActiveTab("commentary")}
            className={`px-4 py-2 text-white font-semibold transition cursor-pointer${activeTab === "commentary"
              ? "font-bold text-xl border-b-4 border-b-orange-500"
              : " text-lg"
              }`}
          >
            Commentary
          </div>
          <Link
            href={`/addinnings`} // your dynamic route
            className={`px-4 py-2 text-white font-semibold transition cursor-pointer text-lg
              `}
          >
            Add Innings
          </Link>
        </div>
      </div>

      {/* Tab content */}
      <div className="w-full mx-auto">
        {activeTab === "commentary" ? (
          <Commentary innings={match.innings || []} />
        ) : (
          match.innings?.map((inn) => (
            <Scorecard
              key={inn.innings_id}
              inningsId={inn.innings_id}
              battingTeamName={inn.battingTeam.team_name}
            />
          ))
        )}
      </div>

      <div className="mt-6 w-full max-w-7xl mx-auto bg-zinc-900 rounded text-xs max-h-60">
        <div className="font-bold mb-2 text-green-400">Debug Response:</div>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>

      {/*doesnt work: React can’t render raw JavaScript objects {result} */}

      {/* future: ScoreCard or Commentary toggle ball by ball*/}
    </div>
  );
}

export default MatchDetails;
