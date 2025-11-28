import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tool-card";
import type { AITool } from "@shared/schema";

interface FeaturedCarouselProps {
  title: string;
  tools: AITool[];
}

export function FeaturedCarousel({ title, tools }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (tools.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            data-testid={`button-carousel-left-${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            data-testid={`button-carousel-right-${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} variant="featured" />
        ))}
      </div>
    </div>
  );
}
