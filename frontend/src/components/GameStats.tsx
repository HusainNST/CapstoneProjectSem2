"use client";

interface GameStatsProps {
  moves: number;
  matches: number;
  time: number;
  isComplete: boolean;
  difficulty: "easy" | "hard";
  onReset: () => void;
}

export default function GameStats({
  moves,
  matches,
  time,
  isComplete,
  difficulty,
  onReset,
}: GameStatsProps) {
  const totalPairs = difficulty === "easy" ? 8 : 18;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const calculateScore = () => {
    if (!isComplete) return 0;
    const moveScore = Math.max(0, 1000 - moves * 10);
    const timeScore = Math.max(0, 1000 - time);
    return moveScore + timeScore;
  };

  return (
    <div className="bg-white rounded-3xl border-6 border-[#E75234] p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#E75234]">
        Game Stats
      </h2>

      <div className="space-y-4 flex-1">
        <div className="bg-orange-100 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Moves:</span>
            <span className="text-2xl font-bold text-[#E75234]">{moves}</span>
          </div>
        </div>

        <div className="bg-orange-100 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Matches:</span>
            <span className="text-2xl font-bold text-[#E75234]">
              {matches}/{totalPairs}
            </span>
          </div>
        </div>

        <div className="bg-orange-100 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Time:</span>
            <span className="text-2xl font-bold text-[#E75234]">
              {formatTime(time)}
            </span>
          </div>
        </div>

        <div className="bg-orange-100 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Difficulty:</span>
            <span className="text-lg font-bold text-[#E75234]">
              {difficulty === "easy" ? "4x4 (Easy)" : "6x6 (Hard)"}
            </span>
          </div>
        </div>

        {isComplete && (
          <div className="bg-green-100 rounded-xl p-4 border-2 border-green-300">
            <div className="text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">
                🎉 Congratulations!
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Final Score:</span>
                <span className="text-2xl font-bold text-green-600">
                  {calculateScore()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="mt-6 bg-[#E75234] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
      >
        New Game
      </button>
    </div>
  );
}
