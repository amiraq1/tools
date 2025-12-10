import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import session from "express-session";
import compression from "compression";

import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { createServer, type IncomingMessage } from "http";

const app = express();
const httpServer = createServer(app);

// Enable response compression for better performance
app.use(compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

const SessionStore = MemoryStore(session);

declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

declare module "express-serve-static-core" {
  // نضيف rawBody للـ Request
  interface Request extends IncomingMessage {}
}

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Optimize JSON parsing with limit
app.use(
  express.json({
    limit: '10mb', // Set reasonable limit
    verify: (req: Request, _res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Add caching headers for static API responses
app.use((req: Request, res: Response, next: NextFunction) => {
  // Cache GET requests for public endpoints
  if (req.method === 'GET' && req.path.startsWith('/api/tools')) {
    // Cache for 5 minutes for tools listings
    res.set('Cache-Control', 'public, max-age=300');
  }
  next();
});

// Validate session secret in production
if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  log("❌ SESSION_SECRET must be set in production environment.", "express");
  process.exit(1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-key-only-for-development",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000, // 24 hours
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

// دالة لوج بسيطة
export function log(message: string, source = "express") {
  const time = new Date().toISOString();
  console.log(`[${time}] [${source}] ${message}`);
}

// سجّل الروتس
registerRoutes(httpServer, app);

// Setup based on environment
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    // In production, serve static built files
    const { serveStatic } = await import("./static");
    serveStatic(app);
  } else {
    // In development, try to setup Vite, but don't fail if it can't
    try {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    } catch (error) {
      log(`⚠️ Vite setup skipped (running API server only): ${error instanceof Error ? error.message : "Unknown error"}`, "express");
    }
  }

  const PORT = Number(process.env.PORT) || 5000;
  httpServer.listen(PORT, () => {
    log(`Server listening on port ${PORT}`, "http");
  });
}

startServer().catch((error) => {
  log(`❌ Failed to start server: ${error instanceof Error ? error.message : "Unknown error"}`, "express");
  process.exit(1);
});

export { app, httpServer };