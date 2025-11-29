import { Link } from "wouter";
import {
  User,
  Briefcase,
  Palette,
  PenTool,
  Image,
  Video,
  Music,
  Code,
  Database,
  TrendingUp,
  Users,
  Headphones,
  GraduationCap,
  Search,
  Zap,
  Share2,
  Paintbrush,
  DollarSign,
  Scale,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string | undefined) => void;
}

const categoryConfig = [
  { name: "Personal", icon: User, color: "text-pink-500" },
  { name: "Work", icon: Briefcase, color: "text-blue-500" },
  { name: "Creativity", icon: Palette, color: "text-purple-500" },
  { name: "Writing", icon: PenTool, color: "text-emerald-500" },
  { name: "Images", icon: Image, color: "text-orange-500" },
  { name: "Videos", icon: Video, color: "text-red-500" },
  { name: "Audio", icon: Music, color: "text-cyan-500" },
  { name: "Code", icon: Code, color: "text-green-500" },
  { name: "Data", icon: Database, color: "text-indigo-500" },
  { name: "Marketing", icon: TrendingUp, color: "text-amber-500" },
  { name: "Sales", icon: DollarSign, color: "text-lime-500" },
  { name: "Customer Support", icon: Headphones, color: "text-teal-500" },
  { name: "Education", icon: GraduationCap, color: "text-violet-500" },
  { name: "Research", icon: Search, color: "text-rose-500" },
  { name: "Productivity", icon: Zap, color: "text-yellow-500" },
  { name: "Social Media", icon: Share2, color: "text-sky-500" },
  { name: "Design", icon: Paintbrush, color: "text-fuchsia-500" },
  { name: "Finance", icon: DollarSign, color: "text-emerald-600" },
  { name: "Legal", icon: Scale, color: "text-slate-500" },
  { name: "Healthcare", icon: Heart, color: "text-red-600" },
];

export function CategoryFilters({ selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-3">
        <Badge
          variant={!selectedCategory ? "default" : "outline"}
          className={cn(
            "cursor-pointer shrink-0 hover-elevate px-3 py-1.5",
            !selectedCategory && "bg-primary text-primary-foreground"
          )}
          onClick={() => onCategoryChange?.(undefined)}
          data-testid="filter-all"
        >
          الكل
        </Badge>
        {categoryConfig.map(({ name, icon: Icon, color }) => (
          <Badge
            key={name}
            variant={selectedCategory === name ? "default" : "outline"}
            className={cn(
              "cursor-pointer shrink-0 hover-elevate px-3 py-1.5 gap-1.5",
              selectedCategory === name && "bg-primary text-primary-foreground"
            )}
            onClick={() => onCategoryChange?.(name)}
            data-testid={`filter-category-${name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Icon className={cn("w-3.5 h-3.5", selectedCategory !== name && color)} />
            {name}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
}

export function PricingFilters({
  selectedPricing,
  onPricingChange,
}: {
  selectedPricing?: string;
  onPricingChange?: (pricing: string | undefined) => void;
}) {
  const pricingOptions = [
    { name: "Free", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { name: "Freemium", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { name: "Free Trial", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { name: "Paid", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {pricingOptions.map(({ name, color }) => (
        <Badge
          key={name}
          variant="outline"
          className={cn(
            "cursor-pointer hover-elevate px-3 py-1.5",
            selectedPricing === name && color
          )}
          onClick={() => onPricingChange?.(selectedPricing === name ? undefined : name)}
          data-testid={`filter-pricing-${name.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {name}
        </Badge>
      ))}
    </div>
  );
}
