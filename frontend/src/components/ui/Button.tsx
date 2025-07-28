// ===== TYPES =====

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
}

// ===== STYLES =====

const BUTTON_STYLES = {
  base: "w-full text-xl font-semibold rounded-2xl py-3 border-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
  
  variants: {
    primary: "text-white bg-[#E75234] border-[#FF8167] hover:bg-[#d63e1f]",
    secondary: "text-white bg-blue-600 border-blue-400 hover:bg-blue-700", 
    danger: "text-white bg-red-600 border-red-400 hover:bg-red-700"
  }
} as const;

// ===== COMPONENT =====

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}: ButtonProps) {
  const buttonClasses = [
    BUTTON_STYLES.base,
    BUTTON_STYLES.variants[variant],
    className
  ].join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}
