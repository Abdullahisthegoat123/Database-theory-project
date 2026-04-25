import { useEffect, useState } from "react";

interface ScorecardDataBatsman {
  batsman_id: number;
  batsman_name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal?: string;
}

interface ScorecardDataBowler {
  bowlerId: number;
  bowlerName: string;
  runsConceded: number;
  balls: number;
  wickets: number;
  fours: number;
  sixes: number;
  economyRate: number;
}

export default function Scorecard({
  inningsId,
  battingTeamName,
}: {
  inningsId: number;
  battingTeamName: string;
}) {
  const [scoreboardData, setScoreboardData] = useState<
    ScorecardDataBatsman[] | null
  >(null);
  const [bowlingData, setBowlingData] = useState<ScorecardDataBowler[] | null>(
    null
  );

  useEffect(() => {
    fetch(`http://localhost:8080/scoreboard/batsman/${inningsId}`)
      .then((res) => res.json())
      .then((data) => setScoreboardData(data))
      .catch((err) => console.error(err));

    fetch(`http://localhost:8080/scoreboard/bowler/${inningsId}`)
      .then((res) => res.json())
      .then((data) => setBowlingData(data))
      .catch((err) => console.error(err));
  }, [inningsId]);

  if (!scoreboardData || !bowlingData)
    return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 bg-zinc-950 text-white rounded-xl overflow-hidden border border-white/5 shadow-xl">
      {/* Batting Section */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 px-6 py-3">
          <h2 className="text-lg font-bold text-white">{battingTeamName} Innings</h2>
        </div>

        {/* Batting Table Header */}
        <div className="bg-zinc-900/50 px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-white/10">
          <div>Batting</div>
          <div className="text-right">R</div>
          <div className="text-right">B</div>
          <div className="text-right">M</div>
          <div className="text-right">4s</div>
          <div className="text-right">6s</div>
          <div className="text-right">SR</div>
        </div>

        {/* Batsmen Rows */}
        {scoreboardData.map((batsman, index) => (
          <div
            key={batsman.batsman_id}
            className={`px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center text-sm border-b border-white/5 hover:bg-zinc-900/60 transition-colors ${index % 2 === 0 ? "bg-zinc-900/30" : "bg-zinc-900/50"
              }`}
          >
            <div>
              <div className="font-semibold text-zinc-200">{batsman.batsman_name}</div>
              {batsman.dismissal && (
                <div className="text-zinc-500 text-xs mt-1">{batsman.dismissal}</div>
              )}
            </div>
            <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">{batsman.runs}</div>
            <div className="text-right text-zinc-400">{batsman.balls}</div>
            <div className="text-right text-zinc-500">-</div>
            <div className="text-right text-zinc-400">{batsman.fours}</div>
            <div className="text-right text-zinc-400">{batsman.sixes}</div>
            <div className="text-right text-zinc-300">{batsman.strikeRate.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Bowling Section */}
      <div>
        <div className="bg-zinc-900/50 px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-white/10">
          <div className="text-left">Bowling</div>
          <div className="text-right">R</div>
          <div className="text-right">B</div>
          <div className="text-right">W</div>
          <div className="text-right">4s</div>
          <div className="text-right">6s</div>
          <div className="text-right">Econ</div>
        </div>

        {/* Bowler Rows */}
        {bowlingData.map((bowler, index) => (
          <div
            key={bowler.bowlerId}
            className={`px-6 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center text-sm border-b border-white/5 hover:bg-zinc-900/60 transition-colors ${index % 2 === 0 ? "bg-zinc-900/30" : "bg-zinc-900/50"
              }`}
          >
            <div>
              <div className="font-semibold text-zinc-200">{bowler.bowlerName}</div>
            </div>
            <div className="text-right font-bold text-zinc-300">
              {bowler.runsConceded}
            </div>
            <div className="text-right text-zinc-400">{bowler.balls}</div>
            <div className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{bowler.wickets}</div>
            <div className="text-right text-zinc-400">{bowler.fours}</div>
            <div className="text-right text-zinc-400">{bowler.sixes}</div>
            <div className="text-right text-zinc-300">{bowler.economyRate.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
