import type { Express } from "express";
import { storage } from "../storage";

/**
 * Register tools-related routes
 * @param app - Express application instance
 */
export function registerToolsRoutes(app: Express): void {
  /**
   * GET /api/tools
   * Get all tools with optional filters (query, category, pricing, sort)
   */
  app.get("/api/tools", async (req, res) => {
    try {
      const query = {
        query: req.query.query as string | undefined,
        category: req.query.category as any,
        pricing: req.query.pricing as any,
        sort: req.query.sort as "new" | "popular" | "trending" | "top-rated" | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const result = await storage.searchTools(query);
      res.json(result);
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * GET /api/tools/featured
   * Get featured, trending, and just released tools
   */
  app.get("/api/tools/featured", async (req, res) => {
    try {
      const result = await storage.getFeaturedTools();
      res.json(result);
    } catch (error) {
      console.error("Error fetching featured tools:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * GET /api/tools/related/:category
   * Get tools related to a specific category
   */
  app.get("/api/tools/related/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const excludeId = req.query.excludeId as string | undefined;
      const result = await storage.getRelatedTools(category, excludeId);
      res.json(result);
    } catch (error) {
      console.error("Error fetching related tools:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * GET /api/tools/:slug
   * Get a single tool by its slug
   */
  app.get("/api/tools/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const tool = await storage.getToolBySlug(slug);

      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }

      res.json(tool);
    } catch (error) {
      console.error("Error fetching tool:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });
}
