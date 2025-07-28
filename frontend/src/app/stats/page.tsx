"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND } from "~/constants/env";
import Header from "~/components/Header";
import Table from "~/components/ui/Table";

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/auth/verify`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/login");
        return;
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const statsResponse = await fetch(`${BACKEND}/api/game/getUserStats`, {
          method: "GET",
          credentials: "include",
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        const gamesResponse = await fetch(`${BACKEND}/api/game/myScores`, {
          method: "GET",
          credentials: "include",
        });

        if (gamesResponse.ok) {
          const gamesData = await gamesResponse.json();
          setAllGames(gamesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const columns = [
    { key: "difficulty", label: "Difficulty" },
    { key: "score", label: "Score" },
    { key: "moves", label: "Moves" },
    { key: "time", label: "Time" },
    { key: "date", label: "Date" },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header user={user} currentPage="stats" />
      
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-gray-900 text-center mb-8">
            Your Statistics
          </h1>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200 shadow-lg">
            {/* Tab Navigation */}
            <div className="mb-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all ${
                  activeTab === "overview"
                    ? "bg-[#E75234] text-white shadow-lg"
                    : "bg-orange-100 text-gray-700 hover:bg-orange-200"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("all-games")}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all ${
                  activeTab === "all-games"
                    ? "bg-[#E75234] text-white shadow-lg"
                    : "bg-orange-100 text-gray-700 hover:bg-orange-200"
                }`}
              >
                All Games ({allGames.length})
              </button>
            </div>

            {loading ? (
              <div className="text-center text-gray-700 text-xl">Loading...</div>
            ) : activeTab === "overview" ? (
              // Overview Tab
              !stats || stats.totalGames === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No statistics yet</h2>
                  <p className="text-gray-600">Play some games to see your stats here!</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Overall Stats */}
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Overall Performance</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                        <div className="text-2xl font-bold text-[#E75234]">{stats.totalGames}</div>
                        <div className="text-gray-600">Total Games</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                        <div className="text-2xl font-bold text-[#E75234]">{formatTime(stats.avgTime)}</div>
                        <div className="text-gray-600">Avg Time</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                        <div className="text-2xl font-bold text-[#E75234]">{stats.avgMoves}</div>
                        <div className="text-gray-600">Avg Moves</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                        <div className="text-2xl font-bold text-[#E75234]">{stats.mostPlayedDifficulty === 'easy' ? 'Easy' : 'Hard'}</div>
                        <div className="text-gray-600">Most Played</div>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty-specific Stats */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Easy Mode */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">🟢 Easy Mode</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Games:</span>
                          <span className="font-semibold">{stats.easyStats.gamesPlayed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Time:</span>
                          <span className="font-semibold">{formatTime(stats.easyStats.avgTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Moves:</span>
                          <span className="font-semibold">{Math.round(stats.easyStats.avgMoves)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Best Score:</span>
                          <span className="font-bold text-green-600">{stats.bestEasyScore?.score || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hard Mode */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">🔴 Hard Mode</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Games:</span>
                          <span className="font-semibold">{stats.hardStats.gamesPlayed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Time:</span>
                          <span className="font-semibold">{formatTime(stats.hardStats.avgTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Moves:</span>
                          <span className="font-semibold">{Math.round(stats.hardStats.avgMoves)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Best Score:</span>
                          <span className="font-bold text-red-600">{stats.bestHardScore?.score || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // All Games Tab
              allGames.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎮</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No games played yet</h2>
                  <p className="text-gray-600">Start playing to see your game history!</p>
                </div>
              ) : (
                <Table
                  columns={columns}
                  data={allGames}
                  renderRow={(game: any, index: number) => (
                    <tr key={index} className="border-b border-orange-200 hover:bg-orange-50">
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          game.difficulty === 'easy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {game.difficulty === 'easy' ? '🟢 Easy' : '🔴 Hard'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#E75234]">{game.score}</td>
                      <td className="py-3 px-4 text-center">{game.moves}</td>
                      <td className="py-3 px-4 text-center">{formatTime(game.time)}</td>
                      <td className="py-3 px-4 text-center">
                        {new Date(game.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  )}
                  className="text-gray-900"
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
