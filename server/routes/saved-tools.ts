import type { Express } from "express";
import { storage } from "../storage";

/**
 * Middleware to check if user is authenticated
 */
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

/**
 * Register saved tools routes
 * @param app - Express application instance
 */
export function registerSavedToolsRoutes(app: Express): void {
  /**
   * GET /api/saved-tools
   * Get all saved tools for the current user
   */
  app.get("/api/saved-tools", requireAuth, async (req, res) => {
    try {
      const tools = await storage.getSavedTools(req.session.userId);
      res.json({ tools });
    } catch (error: any) {
      console.error("Error fetching saved tools:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * GET /api/saved-tools/ids
   * Get IDs of all saved tools for the current user
   */
  app.get("/api/saved-tools/ids", requireAuth, async (req, res) => {
    try {
      const ids = await storage.getSavedToolIds(req.session.userId);
      res.json({ ids });
    } catch (error: any) {
      console.error("Error fetching saved tool IDs:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * POST /api/saved-tools/:toolId
   * Save a tool for the current user
   */
  app.post("/api/saved-tools/:toolId", requireAuth, async (req, res) => {
    try {
      const { toolId } = req.params;
      const tool = await storage.getToolById(toolId);
      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }
      const savedTool = await storage.saveTool(req.session.userId, toolId);
      res.status(201).json({ success: true, savedTool });
    } catch (error: any) {
      console.error("Error saving tool:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * DELETE /api/saved-tools/:toolId
   * Remove a saved tool for the current user
   */
  app.delete("/api/saved-tools/:toolId", requireAuth, async (req, res) => {
    try {
      const { toolId } = req.params;
      const removed = await storage.unsaveTool(req.session.userId, toolId);
      res.json({ success: removed });
    } catch (error: any) {
      console.error("Error removing saved tool:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * GET /api/saved-tools/check/:toolId
   * Check if a tool is saved by the current user
   */
  app.get("/api/saved-tools/check/:toolId", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.json({ isSaved: false });
      }
      const { toolId } = req.params;
      const isSaved = await storage.isToolSaved(req.session.userId, toolId);
      res.json({ isSaved });
    } catch (error: any) {
      console.error("Error checking saved tool:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });
}
