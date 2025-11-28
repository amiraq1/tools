import { cn } from "@/lib/utils";

interface ToolIconProps {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-lg",
};

export function ToolIcon({ initials, color, size = "md", className }: ToolIconProps) {
  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center font-bold text-white shrink-0",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
