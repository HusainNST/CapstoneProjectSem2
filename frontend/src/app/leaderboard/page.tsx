"use client";

import { useState, useEffect } from "react";
import Header from "~/components/Header";
import Table from "~/components/ui/Table";
import { BACKEND } from "~/constants/env";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"easy" | "hard">("easy");
  const [user, setUser] = useState<any>(null);

  const columns = [
    { key: "rank", label: "Rank", className: "text-center" },
    { key: "name", label: "Player", className: "" },
    { key: "score", label: "Score", className: "text-center" },
    { key: "time", label: "Time", className: "text-center" },
    { key: "date", label: "Date", className: "text-center" },
  ];

  const fetchUser = async () => {
    try {
      const response = await fetch(`${BACKEND}/api/auth/verify`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchLeaderboard = async (difficulty: "easy" | "hard") => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND}/api/game/getLeaderboard`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Filter by difficulty on frontend since backend doesn't support it
        const filteredData = data.filter((entry: any) => entry.difficulty === difficulty);
        setLeaderboard(filteredData);
      } else {
        console.error("Failed to fetch leaderboard");
        setLeaderboard([]);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header user={user} currentPage="leaderboard" />
      
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-gray-900 text-center mb-8">
            Leaderboard
          </h1>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200 shadow-lg">
            <div className="mb-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setActiveTab("easy")}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all ${
                  activeTab === "easy"
                    ? "bg-[#E75234] text-white shadow-lg"
                    : "bg-orange-100 text-gray-700 hover:bg-orange-200"
                }`}
              >
                Easy Mode
              </button>
              <button
                onClick={() => setActiveTab("hard")}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all ${
                  activeTab === "hard"
                    ? "bg-[#E75234] text-white shadow-lg"
                    : "bg-orange-100 text-gray-700 hover:bg-orange-200"
                }`}
              >
                Hard Mode
              </button>
            </div>

            {isLoading ? (
              <div className="text-center text-gray-700 text-xl">Loading...</div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center text-gray-700 text-xl">No scores available</div>
            ) : (
              <Table
                columns={columns}
                data={leaderboard}
                renderRow={(entry: any, index: number) => {
                  const position = index + 1;
                  let rowClass = "border-b border-orange-200 hover:bg-orange-50";
                  let positionClass = "py-3 px-4 text-gray-900 text-center font-semibold";
                  
                  // Special styling for top 3 positions
                  if (position === 1) {
                    rowClass = "border-b border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200";
                    positionClass = "py-3 px-4 text-yellow-800 text-center font-bold text-lg";
                  } else if (position === 2) {
                    rowClass = "border-b border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200";
                    positionClass = "py-3 px-4 text-gray-700 text-center font-bold";
                  } else if (position === 3) {
                    rowClass = "border-b border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200";
                    positionClass = "py-3 px-4 text-orange-700 text-center font-bold";
                  }
                  
                  return (
                    <tr key={index} className={rowClass}>
                      <td className={positionClass}>
                        {position === 1 && "🥇 "}
                        {position === 2 && "🥈 "}
                        {position === 3 && "🥉 "}
                        {position}
                      </td>
                      <td className="py-3 px-4 text-gray-900">{entry.user?.username || 'Unknown'}</td>
                      <td className="py-3 px-4 text-gray-900 text-center font-bold text-[#E75234]">{entry.score}</td>
                      <td className="py-3 px-4 text-gray-900 text-center">{entry.time}s</td>
                      <td className="py-3 px-4 text-gray-900 text-center">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                }}
                className="text-gray-900"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
