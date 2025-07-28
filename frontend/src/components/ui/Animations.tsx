// ===== ANIMATION WRAPPER COMPONENTS =====

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '' 
}: FadeInProps) {
  const getDirectionClass = () => {
    switch (direction) {
      case 'up': return 'translate-y-8';
      case 'down': return '-translate-y-8';
      case 'left': return 'translate-x-8';
      case 'right': return '-translate-x-8';
      default: return 'translate-y-8';
    }
  };

  return (
    <div
      className={`opacity-0 ${getDirectionClass()} animate-fadeInUp ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        animationDuration: '600ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
}

interface FloatingProps {
  children: React.ReactNode;
  delay?: number;
  intensity?: 'light' | 'medium' | 'strong';
}

export function Floating({ children, delay = 0, intensity = 'medium' }: FloatingProps) {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'light': return 'animate-floating-light';
      case 'medium': return 'animate-floating-medium';
      case 'strong': return 'animate-floating-strong';
      default: return 'animate-floating-medium';
    }
  };

  return (
    <div
      className={getIntensityClass()}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: '3s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
      }}
    >
      {children}
    </div>
  );
}

// ===== SCROLL REVEAL COMPONENT =====

interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function ScrollReveal({ 
  children, 
  threshold = 0.1, // eslint-disable-line @typescript-eslint/no-unused-vars
  className = '' 
}: ScrollRevealProps) {
  return (
    <div className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}
