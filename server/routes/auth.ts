import type { Express } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";
import { hash, verify } from "../auth";

/**
 * Register authentication routes
 * @param app - Express application instance
 */
export function registerAuthRoutes(app: Express): void {
  /**
   * POST /api/auth/signup
   * Create a new user account
   */
  app.post("/api/auth/signup", async (req, res) => {
    try {
      // Validate input using zod schema
      const validatedBody = insertUserSchema.safeParse(req.body);
      if (!validatedBody.success) {
        return res.status(400).json({
          error: "Invalid input data",
          details: validatedBody.error.flatten(),
        });
      }

      const { username, password, email } = validatedBody.data;

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hash(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
      });

      req.session!.userId = user.id;
      res.status(201).json({ user: { id: user.id, username: user.username } });
    } catch (error: any) {
      console.error("Error in signup route:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * POST /api/auth/login
   * Authenticate user with username and password
   */
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Validate input
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isValid = await verify(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session
      req.session!.userId = user.id;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error: any) {
      console.error("Error in login route:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * GET /api/auth/me
   * Get current authenticated user information
   */
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error: any) {
      console.error("Error in auth/me route:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

  /**
   * POST /api/auth/logout
   * Logout current user and destroy session
   */
  app.post("/api/auth/logout", (req, res) => {
    req.session!.destroy((err: any) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "An internal server error occurred." });
      }
      res.json({ success: true });
    });
  });
}
