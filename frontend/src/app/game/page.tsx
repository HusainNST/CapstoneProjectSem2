"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND } from "~/constants/env";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import GameBoard from "~/components/GameBoard";
import GameStats from "~/components/GameStats";
import Header from "~/components/Header";

export default function GamePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [gameKey, setGameKey] = useState(0);
  const [gameState, setGameState] = useState({
    moves: 0,
    matches: 0,
    time: 0,
    isComplete: false,
  });
  const [isStarted, setIsStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    setNotyf(new Notyf({}));
  }, []);

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
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, [router]);

  useEffect(() => {
    if (!isStarted || gameState.isComplete) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, gameState.isComplete]);

  useEffect(() => {
    setGameState(prev => ({ ...prev, time: timeElapsed }));
  }, [timeElapsed]);

  const saveHighScore = async (moves: number, time: number) => {
    try {
      const response = await fetch(`${BACKEND}/api/game/saveScore`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moves,
          time,
          difficulty,
        }),
      });

      if (!response.ok) {
        if (notyf) {
          notyf.error("Failed to save your score. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const resetGame = () => {
    setGameState({
      moves: 0,
      matches: 0,
      time: 0,
      isComplete: false,
    });
    setIsStarted(false);
    setTimeElapsed(0);
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    resetGame();
    setGameKey(prev => prev + 1);
  };

  const handleGameReset = () => {
    resetGame();
    setGameKey(prev => prev + 1);
  };

  const formatGameTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStatsUpdate = (moves: number, matches: number, isComplete: boolean) => {
    if (!isStarted && moves > 0) {
      setIsStarted(true);
    }
    
    setGameState(prev => ({ ...prev, moves, matches }));

    if (isComplete && !gameState.isComplete) {
      setGameState(prev => ({ ...prev, isComplete: true }));
      setIsStarted(false);
      saveHighScore(moves, gameState.time);
      
      const formattedTime = formatGameTime(gameState.time);
      if (notyf) {
        notyf.success(
          `🎉 Congratulations! You completed the game in ${moves} moves and ${formattedTime}!`
        );
      }
    }
  };

  const getDifficultyButtonStyle = (buttonDifficulty: string) => {
    return difficulty === buttonDifficulty
      ? "bg-[#E75234] text-white shadow-lg"
      : "bg-orange-100 text-gray-700 hover:bg-orange-200";
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header user={user} currentPage="game" />
      
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            
            {/* Left Main Area - Game Board */}
            <div className="lg:col-span-3 order-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 border border-orange-200 shadow-lg">
                <GameBoard
                  key={gameKey}
                  difficulty={difficulty as "easy" | "hard"}
                  onStatsUpdate={handleStatsUpdate}
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2">
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-orange-200 shadow-lg">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Memory Game</h1>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDifficultyChange("easy")}
                        className={`flex-1 px-2 sm:px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${getDifficultyButtonStyle("easy")}`}
                      >
                        Easy (4x4)
                      </button>
                      <button
                        onClick={() => handleDifficultyChange("hard")}
                        className={`flex-1 px-2 sm:px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${getDifficultyButtonStyle("hard")}`}
                      >
                        Hard (6x6)
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleGameReset}
                    className="w-full bg-[#E75234] hover:bg-[#E75234]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg text-sm sm:text-base"
                  >
                    New Game
                  </button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-orange-200 shadow-lg">
                <GameStats 
                  moves={gameState.moves}
                  matches={gameState.matches}
                  time={gameState.time}
                  difficulty={difficulty as "easy" | "hard"}
                  isComplete={gameState.isComplete}
                  onReset={handleGameReset}
                />
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
