import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-orange-100 to-orange-200 p-4 ${className}`}>
      {children}
    </div>
  );
}
