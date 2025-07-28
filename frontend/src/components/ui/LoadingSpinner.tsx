interface LoadingSpinnerProps {
  message?: string;
  icon?: string;
}

export default function LoadingSpinner({ message = "Loading...", icon = "🎮" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-100 to-orange-200">
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <div className="text-2xl">{message}</div>
      </div>
    </div>
  );
}
