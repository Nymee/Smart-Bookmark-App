type CardSize = "sm" | "md" | "lg";

interface GlassCardProps {
  children: React.ReactNode;
  size?: CardSize;
  className?: string;
  hover?: boolean;
}

const sizeStyles: Record<CardSize, string> = {
  sm: "p-4 rounded-xl",
  md: "p-6 rounded-2xl",
  lg: "px-8 py-12 rounded-2xl",
};

export default function GlassCard({
  children,
  size = "md",
  className = "",
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={`border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl ${sizeStyles[size]} ${hover ? "transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
