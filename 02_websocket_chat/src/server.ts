import { serve, ServerWebSocket } from "bun";
import { resolve } from "path";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isDev = process.env.NODE_ENV !== "production";

// Detect if running as compiled executable
const isCompiled = import.meta.dir.includes("/$bunfs/");
const baseDir = isCompiled ? process.cwd() : import.meta.dir;

// Message types
interface ChatMessage {
  type: "message" | "join" | "leave" | "users";
  username?: string;
  text?: string;
  timestamp?: number;
  users?: string[];
}

// Store connected clients
const clients = new Set<ServerWebSocket<{ username: string }>>();

function broadcastMessage(message: ChatMessage, excludeClient?: ServerWebSocket) {
  const messageStr = JSON.stringify(message);
  for (const client of clients) {
    if (client !== excludeClient && client.readyState === 1) {
      client.send(messageStr);
    }
  }
}

function getUsersList(): string[] {
  return Array.from(clients).map((client) => client.data.username);
}

serve({
  port: PORT,
  async fetch(req, server) {
    const url = new URL(req.url);

    // WebSocket upgrade
    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req);
      if (!upgraded) {
        return new Response("WebSocket upgrade failed", { status: 400 });
      }
      return undefined;
    }

    // Serve HTML
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const file = Bun.file(resolve(baseDir, "index.html"));
      return new Response(file, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Serve client JavaScript
    if (url.pathname === "/client.js") {
      if (isDev && !isCompiled) {
        // In dev mode, transpile TypeScript on-the-fly
        const file = Bun.file(resolve(baseDir, "client.ts"));
        const transpiler = new Bun.Transpiler({ loader: "ts" });
        const code = await file.text();
        const js = transpiler.transformSync(code);
        return new Response(js, {
          headers: { "Content-Type": "text/javascript" },
        });
      } else {
        // Production: serve pre-bundled file
        const file = Bun.file(resolve(baseDir, "client.js"));
        return new Response(file, {
          headers: { "Content-Type": "text/javascript" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) {
      // Generate username
      const username = `User${Math.floor(Math.random() * 1000)}`;
      ws.data = { username };
      clients.add(ws);

      console.log(`${username} connected (${clients.size} total)`);

      // Notify user of their username
      ws.send(JSON.stringify({
        type: "join",
        username,
        timestamp: Date.now(),
      } as ChatMessage));

      // Broadcast to others
      broadcastMessage({
        type: "join",
        username,
        timestamp: Date.now(),
      }, ws);

      // Send current users list to new user
      ws.send(JSON.stringify({
        type: "users",
        users: getUsersList(),
      } as ChatMessage));
    },
    message(ws, message) {
      try {
        const data = JSON.parse(message.toString()) as ChatMessage;

        if (data.type === "message" && data.text) {
          const chatMessage: ChatMessage = {
            type: "message",
            username: ws.data.username,
            text: data.text,
            timestamp: Date.now(),
          };

          // Broadcast to all clients including sender
          broadcastMessage(chatMessage);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    },
    close(ws) {
      clients.delete(ws);
      console.log(`${ws.data.username} disconnected (${clients.size} remaining)`);

      // Notify others
      broadcastMessage({
        type: "leave",
        username: ws.data.username,
        timestamp: Date.now(),
      });
    },
  },
});

console.log(`🚀 WebSocket server running at http://localhost:${PORT}`);
console.log(`   Connect to: ws://localhost:${PORT}/ws`);
