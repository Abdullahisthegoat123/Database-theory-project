"use client";

import TeamDetails from "@/components/Team";
import { useParams } from "next/navigation";

export default function TeamPage() {
  const params = useParams();
  const teamId = Number(params.id); // make sure this is a number

  if (isNaN(teamId)) return <p className="text-red-400">Invalid team ID</p>;

  return (
    <div className="w-full flex flex-col items-center text-white">
      <TeamDetails teamId={teamId} />
    </div>
  );
}
