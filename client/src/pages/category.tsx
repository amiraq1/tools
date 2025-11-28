import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Filter } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolsGrid } from "@/components/tools-grid";
import { PricingFilters } from "@/components/category-filters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AITool, ToolsResponse } from "@shared/schema";

const categoryDescriptions: Record<string, string> = {
  personal: "AI tools to enhance your personal life, health, and daily routines.",
  work: "Professional AI solutions for business, productivity, and workplace efficiency.",
  creativity: "Unleash your creative potential with AI-powered creative tools.",
  writing: "AI writing assistants for content creation, editing, and optimization.",
  images: "Generate, edit, and enhance images with artificial intelligence.",
  videos: "AI-powered video creation, editing, and enhancement tools.",
  audio: "Transform audio with AI - transcription, generation, and editing.",
  code: "AI coding assistants, code generation, and development tools.",
  data: "Data analysis, visualization, and insights powered by AI.",
  marketing: "AI marketing tools for campaigns, analytics, and growth.",
  sales: "AI-powered sales tools for lead generation and conversion.",
  "customer-support": "AI chatbots and support solutions for customer service.",
  education: "AI tools for learning, teaching, and educational content.",
  research: "AI research assistants and academic tools.",
  productivity: "Boost your productivity with AI automation and optimization.",
  "social-media": "AI tools for social media management and content creation.",
  design: "AI design tools for graphics, UI/UX, and visual content.",
  finance: "AI solutions for financial analysis and management.",
  legal: "AI tools for legal research and document analysis.",
  healthcare: "AI healthcare tools for diagnostics and patient care.",
};

type SortTab = "new" | "popular" | "top-rated";

function buildToolsUrl(category?: string, pricing?: string, sort?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (pricing) params.set("pricing", pricing);
  if (sort) params.set("sort", sort);
  const queryString = params.toString();
  return queryString ? `/api/tools?${queryString}` : "/api/tools";
}

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const [selectedPricing, setSelectedPricing] = useState<string | undefined>();
  const [sortTab, setSortTab] = useState<SortTab>("new");

  const categoryName = category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
    : "";

  const toolsUrl = buildToolsUrl(categoryName, selectedPricing, sortTab);

  const { data: toolsData, isLoading } = useQuery<ToolsResponse>({
    queryKey: [toolsUrl],
    enabled: !!category,
  });

  const { data: allToolsData } = useQuery<ToolsResponse>({
    queryKey: ["/api/tools"],
  });

  const tools = toolsData?.tools || [];
  const allTools = allToolsData?.tools || [];
  const description = categoryDescriptions[category?.toLowerCase() || ""] || "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header tools={allTools} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all tools
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoryName}</h1>
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {toolsData?.total || 0} tools found
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <Tabs value={sortTab} onValueChange={(v) => setSortTab(v as SortTab)}>
              <TabsList>
                <TabsTrigger value="new" data-testid="tab-new">Newest</TabsTrigger>
                <TabsTrigger value="popular" data-testid="tab-popular">Most Popular</TabsTrigger>
                <TabsTrigger value="top-rated" data-testid="tab-top-rated">Top Rated</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <PricingFilters
                selectedPricing={selectedPricing}
                onPricingChange={setSelectedPricing}
              />
            </div>
          </div>

          <ToolsGrid tools={tools} isLoading={isLoading} />

          {tools.length > 0 && toolsData && toolsData.total > tools.length && (
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" data-testid="button-load-more">
                Load more tools
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
