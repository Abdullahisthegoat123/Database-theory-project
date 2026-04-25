import Navbar from "./Navbar"
import RecentMatches from "@/components/RecentMatches"



export default function FullNavbar() {
  return (
    <div className="absolute left-0 top-0 w-full rounded-lg">
      <RecentMatches />
      <Navbar />
    </div>
  );
}