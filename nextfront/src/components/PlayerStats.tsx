"use client";

import { useEffect, useState } from "react";
interface BowlingCareerStats {
  playerId: number;
  playerName: string;
  matchFormat: string;
  totalRuns: number;
  totalBalls: number;
  totalWickets: number;
  economy: number;
  fours: number;
  sixes: number;
}
interface BattingCareerStats {
  playerId: number;
  playerName: string;
  matchFormat: string;

  notOuts: number;
  totalRuns: number;
  totalBalls: number;

  average: number;
  strikeRate: number;

  fours: number;
  sixes: number;
  hundreds: number;
  fifties: number;
}


export function PlayerStats({ playerId = 12 }) {
const [bowling, setBowling] = useState<BowlingCareerStats[] | null>([]);
const [batting, setBatting] = useState<BattingCareerStats[] | null>([]);

  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(
          `http://localhost:8080/bowling/career/${playerId}`
        );
        const data = await res.json();
        setBowling(data);
        const resBat = await fetch(
          `http://localhost:8080/batting/career/${playerId}`
        );
        const dataBat = await resBat.json();
        setBatting(dataBat);

      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [playerId]);

  if (loading) return <p className="text-slate-300">Loading stats...</p>;
  if (!bowling) return <p className="text-red-400">No data found.</p>;

  return (
    <div className="space-y-12">
      {/* BOWLING SECTION */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-slate-400">
          BATTING & FIELDING
        </h2>

        {/* Responsive table wrapper */}
        {/* BATTING SECTION */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-slate-400">
            BATTING & FIELDING
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-300">
                    Format
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    NO
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    Runs
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    Balls
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    Ave
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    SR
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    100s
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    50s
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    4s
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-300">
                    6s
                  </th>
                </tr>
              </thead>
              <tbody>
                {batting?.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {row.matchFormat}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">
                      {row.notOuts}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-slate-100">
                      {row.totalRuns}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">
                      {row.totalBalls}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">
                      {row.average != null ? row.average.toFixed(2) : "-"}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">
                      {row.strikeRate != null ? row.strikeRate.toFixed(2) : "-"}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">
                      {row.hundreds}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">
                      {row.fifties}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">
                      {row.fours}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">
                      {row.sixes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOWLING SECTION */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-slate-400">BOWLING</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-300">
                  Format
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  Mat
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  Inns
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  Balls
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  Runs
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  Wkts
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  BBI
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  BBM
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  Ave
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  Econ
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  SR
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  4w
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  5w
                </th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">
                  10w
                </th>
              </tr>
            </thead>
            <tbody>
              {bowling.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-100">
                    {row.matchFormat}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {/* {row.sixes} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {" "}
                    {/* {row.sixes} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {row.totalBalls}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {row.totalRuns}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {row.totalWickets}
                  </td>
                  <td className="text-right py-3 px-4 font-semibold text-slate-100">
                    {/* {row.sixes} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {/* {row.} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {/* {row.bbm} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {/* {row.ave} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {row.economy != null ? row.economy.toFixed(2) : "-"}

                    {/* {row.economy} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {/* {row.sr} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {/* {row._4w} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {/* {row._5w} */}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    {/* {row._10w} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// function Stat({ label, value }) {
//   return (
//     <tr className="border-b border-slate-800">
//       <td className="py-3 px-4 font-semibold text-slate-100">{label}</td>
//       <td className="text-right py-3 px-4 text-slate-300">{value}</td>
//     </tr>
//   );
// }
