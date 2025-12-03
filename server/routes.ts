import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerAuthRoutes } from "./routes/auth";
import { registerToolsRoutes } from "./routes/tools";
import { registerSavedToolsRoutes } from "./routes/saved-tools";

/**
 * Register all API routes
 * @param httpServer - HTTP server instance
 * @param app - Express application instance
 * @returns HTTP server instance
 */
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register modular routes
  registerAuthRoutes(app);
  registerToolsRoutes(app);
  registerSavedToolsRoutes(app);

  return httpServer;
}
