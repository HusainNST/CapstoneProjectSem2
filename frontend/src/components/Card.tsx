"use client";
import Image from "next/image";

interface CardProps {
  id: number;
  icon: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  difficulty?: "easy" | "hard";
}

export default function Card({
  id,
  icon,
  isFlipped,
  isMatched,
  onClick,
}: CardProps) {
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick(id);
    }
  };

  const isCellFlipped = isFlipped || isMatched;

  if (isMatched) {
    return (
      <div className="relative w-full h-full opacity-0 transition-opacity duration-500" />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`relative w-full h-full cursor-pointer opacity-100 transition-opacity duration-500 hover:scale-105 transform transition-transform`}
      style={{ transformStyle: "preserve-3d", perspective: "500px" }}
    >
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-500"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isCellFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl border-2 sm:border-4 border-[#E75234] bg-gradient-to-br from-[#FF8167] to-[#E75234] flex items-center justify-center shadow-lg transition-opacity duration-300"
          style={{ 
            backfaceVisibility: "hidden",
            opacity: isCellFlipped ? "0" : "1"
          }}
        >
          <div className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">?</div>
        </div>

        <div 
          className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl border-2 sm:border-4 border-[#E75234] bg-white flex items-center justify-center shadow-lg transition-opacity duration-300"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            opacity: isCellFlipped ? "1" : "0"
          }}
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
            <Image
              src={`/icons/${icon + 1} Icon.svg`}
              alt={`Icon ${icon + 1}`}
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
}
