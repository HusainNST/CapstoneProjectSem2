"use client";
import { useState, useEffect } from "react";
import Card from "./Card";

interface GameBoardProps {
  difficulty: "easy" | "hard";
  onStatsUpdate: (moves: number, matches: number, isComplete: boolean) => void;
}

interface GameCard {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function GameBoard({ difficulty, onStatsUpdate }: GameBoardProps) {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const gridSize = difficulty === "easy" ? 4 : 6;
  const totalPairs = (gridSize * gridSize) / 2;

  useEffect(() => {
    initializeGame();
  }, [difficulty, gridSize]);

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairs = totalCards / 2;
    const icons = Array.from({ length: pairs }, (_, i) => i);
    const doubledIcons = [...icons, ...icons];
    
    const shuffled = doubledIcons.sort(() => Math.random() - 0.5);
    
    const newCards = shuffled.map((iconIndex, id) => ({
      id,
      iconIndex,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCardIds([]);
    setMoves(0);
    setMatches(0);
    setIsProcessing(false);
    
    console.log('Game initialized with', newCards.length, 'cards for', difficulty, 'mode');
  };

  const handleCardClick = (cardId: number) => {
    if (isProcessing) return;
    if (flippedCardIds.includes(cardId)) return;
    if (cards[cardId]?.isMatched) return;

    // Increment moves on every card click
    const newMoves = moves + 1;
    setMoves(newMoves);

    const newFlippedIds = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlippedIds);

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    onStatsUpdate(newMoves, matches, false);

    if (newFlippedIds.length === 2) {
      setIsProcessing(true);

      setTimeout(() => {
        const [firstId, secondId] = newFlippedIds;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        if (firstCard.iconIndex === secondCard.iconIndex) {
          const newMatches = matches + 1;
          setMatches(newMatches);
          
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          ));

          const isComplete = newMatches === totalPairs;
          onStatsUpdate(newMoves, newMatches, isComplete);
        } else {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          ));
        }

        setFlippedCardIds([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center p-2 sm:p-4">
      <div 
        className={`grid gap-2 sm:gap-3 md:gap-4 ${
          difficulty === "easy" ? "grid-cols-4" : "grid-cols-6"
        }`}
        style={{ 
          width: "100%",
          maxWidth: difficulty === "easy" ? "min(90vw, 600px)" : "min(95vw, 720px)",
          aspectRatio: "1",
        }}
      >
        {cards.length > 0 ? cards.map((card) => (
          <div 
            key={card.id} 
            className="aspect-square w-full"
          >
            <Card
              id={card.id}
              icon={card.iconIndex}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={() => handleCardClick(card.id)}
              difficulty={difficulty}
            />
          </div>
        )) : (
          <div className={`${difficulty === "easy" ? "col-span-4" : "col-span-6"} text-center text-gray-500 p-4 sm:p-8 bg-yellow-100 rounded-lg`}>
            <div>Loading game...</div>
            <div className="text-sm mt-2">Cards length: {cards.length}</div>
            <div className="text-sm">Difficulty: {difficulty}</div>
            <div className="text-sm">Grid size: {gridSize}</div>
          </div>
        )}
      </div>
    </div>
  );
}
