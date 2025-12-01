import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import session from "express-session";

import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer, type IncomingMessage } from "http";

const app = express();
const httpServer = createServer(app);

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

app.use(
  express.json({
    verify: (req: Request, _res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "nabdh-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000, // 24 hours
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

// دالة لوج بسيطة
export function log(message: string, source = "express") {
  const time = new Date().toISOString();
  console.log(`[${time}] [${source}] ${message}`);
}

// سجّل الروتس و الملفات الستاتيك
registerRoutes(app);
serveStatic(app);

// 🔴 هنا كان الخطأ في الغالب: استخدام 5000 فقط
// ✅ الحل: استخدام process.env.PORT الذي يوفره Replit
const PORT = Number(process.env.PORT) || 5000;

httpServer.listen(PORT, () => {
  log(`Server listening on port ${PORT}`, "http");
});

export { app, httpServer };