import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { telegramBot } from "./telegram";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    
    // Check if bot token is available
    if (process.env.TELEGRAM_BOT_TOKEN) {
      console.log("Bot will be accessible to everyone as requested");
      
      try {
        // Get replit domains for the web app
        const webAppUrl = process.env.REPLIT_DEV_DOMAIN ? 
          `https://${process.env.REPLIT_DEV_DOMAIN}` : 
          process.env.REPLIT_DOMAINS ? 
            `https://${process.env.REPLIT_DOMAINS}` : 
            null;
            
        if (webAppUrl) {
          console.log(`Using Web App URL: ${webAppUrl}`);
          
          // Set bot commands and menu button
          fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setMyCommands`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              commands: [
                {
                  command: 'start',
                  description: 'Открыть магазин'
                },
                {
                  command: 'help',
                  description: 'Показать справку'
                }
              ]
            })
          }).then(res => res.json())
            .then(data => console.log('Set bot commands result:', data))
            .catch(err => console.error('Error setting bot commands:', err));
          
          // Set the web app as a menu button for the bot
          fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setChatMenuButton`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              menu_button: {
                type: 'web_app',
                text: 'Открыть магазин',
                web_app: {
                  url: webAppUrl
                }
              }
            })
          }).then(res => res.json())
            .then(data => console.log('Set menu button result:', data))
            .catch(err => console.error('Error setting menu button:', err));
        }
        
        // Start polling for updates instead of using webhook
        console.log("Starting Telegram polling (long-polling mode)");
        
        // Start polling in background
        telegramBot.startPolling().catch(error => {
          console.error("Error in polling main loop:", error);
        });
        
        console.log("Telegram bot initialized in polling mode");
      } catch (error) {
        console.error("Error setting up Telegram webhook:", error);
      }
    } else {
      console.warn("TELEGRAM_BOT_TOKEN not provided, bot functionality will be limited");
    }
  });
})();
