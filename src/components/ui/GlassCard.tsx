type CardSize = "sm" | "md" | "lg";

interface GlassCardProps {
  children: React.ReactNode;
  size?: CardSize;
  className?: string;
  hover?: boolean;
}

const sizeStyles: Record<CardSize, string> = {
  sm: "px-5 py-4 rounded-xl",
  md: "p-6 rounded-2xl",
  lg: "px-10 py-12 rounded-2xl",
};

export default function GlassCard({
  children,
  size = "md",
  className = "",
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={`border border-amber-200/[0.05] bg-surface/60 shadow-lg shadow-black/10 backdrop-blur-xl ${sizeStyles[size]} ${hover ? "transition-all duration-200 hover:border-amber-200/[0.1] hover:bg-surface/80" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
