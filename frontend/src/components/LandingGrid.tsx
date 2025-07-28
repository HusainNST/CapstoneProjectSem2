"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function LandingGrid() {
  const [cellValues, setCellValues] = useState<number[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const pairsCount = 8;

    const pairs: number[] = [];
    for (let i = 1; i <= pairsCount; i++) {
      pairs.push(i, i);
    }

    // Shuffle the pairs
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    setCellValues(pairs);
    setFlippedIndices([]);
    setMatchedIndices(new Set());
  };

  const handleCellClick = (index: number) => {
    if (
      isChecking ||
      flippedIndices.includes(index) ||
      matchedIndices.has(index)
    ) {
      return;
    }

    if (flippedIndices.length >= 2) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (cellValues[firstIndex] === cellValues[secondIndex]) {
        // Match found
        const newMatchedIndices = new Set(matchedIndices);
        newMatchedIndices.add(firstIndex);
        newMatchedIndices.add(secondIndex);

        setTimeout(() => {
          setMatchedIndices(newMatchedIndices);
          setFlippedIndices([]);
          setIsChecking(false);

          // Check if game is complete
          if (newMatchedIndices.size === 16) {
            // Game complete - restart after a short delay
            setTimeout(() => {
              initializeGame();
            }, 1500);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const isCellFlipped = (index: number) => {
    return flippedIndices.includes(index) || matchedIndices.has(index);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-2xl border-4 border-[#E75234] p-4 sm:p-6 md:p-8 shadow-lg">
        <div
          className="grid gap-2 sm:gap-3 rounded-lg"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            width: "min(90vw, 480px)",
            height: "min(90vw, 480px)",
            maxWidth: "480px",
            maxHeight: "480px",
          }}>
          {cellValues.map((value, index) => {
            // If matched, render an invisible div
            if (matchedIndices.has(index)) {
              return (
                <div
                  key={index}
                  className="relative w-full h-full opacity-0 transition-opacity duration-500"
                />
              );
            }

            return (
              <div
                key={index}
                onClick={() => handleCellClick(index)}
                className="relative w-full h-full cursor-pointer opacity-100 transition-opacity duration-500 hover:scale-105 transform transition-transform"
                style={{ transformStyle: "preserve-3d", perspective: "500px" }}
              >
                <div
                  className="absolute inset-0 w-full h-full transition-transform duration-500"
                  style={{ 
                    transformStyle: "preserve-3d",
                    transform: isCellFlipped(index) ? "rotateY(180deg)" : "rotateY(0deg)"
                  }}>
                  {/* Card back */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl border-2 sm:border-4 border-[#E75234] bg-gradient-to-br from-[#FF8167] to-[#E75234] flex items-center justify-center shadow-lg transition-opacity duration-300"
                    style={{ 
                      backfaceVisibility: "hidden",
                      opacity: isCellFlipped(index) ? "0" : "1"
                    }}>
                    <div className="text-white text-lg sm:text-xl md:text-2xl font-bold">?</div>
                  </div>

                  {/* Card front */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl border-2 sm:border-4 border-[#E75234] bg-white flex items-center justify-center shadow-lg transition-opacity duration-300"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      opacity: isCellFlipped(index) ? "1" : "0"
                    }}>
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                      <Image
                        src={`/icons/${value} Icon.svg`}
                        alt={`Icon ${value}`}
                        fill
                        style={{ 
                          objectFit: "contain",
                          filter: "brightness(0) saturate(100%) invert(13%) sepia(100%) saturate(7500%) hue-rotate(223deg) brightness(85%) contrast(101%)"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      </div>
    </div>
  );
}
