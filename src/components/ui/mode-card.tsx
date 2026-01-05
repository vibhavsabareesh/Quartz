import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ModeCardProps {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

export function ModeCard({
  icon,
  label,
  description,
  selected,
  onToggle,
  className,
}: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative flex flex-col items-start gap-3 p-5 rounded-xl border-2 text-left transition-all duration-200",
        "hover:border-primary/50 hover:bg-primary/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-primary/10 shadow-md"
          : "border-border bg-card",
        className
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <span className="text-3xl" role="img" aria-hidden>
        {icon}
      </span>
      <div>
        <h3 className="font-semibold text-foreground">{label}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </button>
  );
}
