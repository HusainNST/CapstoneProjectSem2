import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  titleIcon?: string;
}

export default function Card({ children, className = "", title, titleIcon }: CardProps) {
  return (
    <div className={`bg-white rounded-3xl border-6 border-[#E75234] p-8 ${className}`}>
      {title && (
        <h1 className="text-4xl font-bold text-center mb-8 text-[#E75234]">
          {titleIcon && <span className="mr-2">{titleIcon}</span>}
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
