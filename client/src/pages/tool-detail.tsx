import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import {
  ExternalLink,
  ArrowUp,
  Bookmark,
  Share2,
  Star,
  Check,
  ArrowLeft,
  Globe,
  Tag,
  Calendar,
  Eye,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolIcon } from "@/components/tool-icon";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { AITool } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: tool, isLoading } = useQuery<AITool>({
    queryKey: [`/api/tools/${slug}`],
    enabled: !!slug,
  });

  const { data: relatedTools } = useQuery<AITool[]>({
    queryKey: [`/api/tools/related/${encodeURIComponent(tool?.category || "")}?excludeId=${tool?.id || ""}`],
    enabled: !!tool?.category,
  });

  const { data: allTools } = useQuery<{ tools: AITool[] }>({
    queryKey: ["/api/tools"],
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "Free":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "Freemium":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "Free Trial":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      default:
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header tools={allTools?.tools || []} />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-6">
              <Skeleton className="w-24 h-24 rounded-xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-full max-w-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header tools={allTools?.tools || []} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Tool not found</h1>
            <p className="text-muted-foreground mb-4">
              The tool you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header tools={allTools?.tools || []} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to tools
            </Button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-4 md:gap-6">
                <ToolIcon
                  initials={tool.iconInitials}
                  color={tool.iconColor}
                  size="lg"
                  className="w-20 h-20 md:w-24 md:h-24 text-2xl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{tool.name}</h1>
                    {tool.isFeatured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    {tool.isNew && (
                      <Badge className="bg-emerald-500/10 text-emerald-500">New</Badge>
                    )}
                    {tool.isTrending && (
                      <Badge className="bg-orange-500/10 text-orange-500">Trending</Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{tool.tagline}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="button-visit-website"
                    >
                      <Button className="gap-2">
                        <Globe className="w-4 h-4" />
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button variant="outline" className="gap-2" data-testid="button-save">
                      <Bookmark className="w-4 h-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="icon" data-testid="button-share">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>About {tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                </CardContent>
              </Card>

              {tool.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {tool.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pricing</span>
                      <Badge className={cn("text-sm", getPricingColor(tool.pricing))}>
                        {tool.pricing}
                        {tool.priceDetails && ` ${tool.priceDetails}`}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <Link href={`/category/${tool.category.toLowerCase()}`}>
                        <Badge variant="outline" className="cursor-pointer hover-elevate">
                          {tool.category}
                        </Badge>
                      </Link>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{tool.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Votes</span>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4" />
                        <span className="font-medium">{formatNumber(tool.votes)}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Views</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{formatNumber(tool.views)}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Released</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(tool.releasedAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button className="w-full gap-2" size="lg" data-testid="button-upvote">
                    <ArrowUp className="w-5 h-5" />
                    Upvote ({formatNumber(tool.votes)})
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {relatedTools && relatedTools.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">Related Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.slice(0, 3).map((relatedTool) => (
                  <ToolCard key={relatedTool.id} tool={relatedTool} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
