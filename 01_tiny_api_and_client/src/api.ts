import { serve } from "bun";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isDev = process.env.NODE_ENV !== "production";

// Detect if running as compiled executable
// When compiled, import.meta.dir contains "/$bunfs/"
const isCompiled = import.meta.dir.includes("/$bunfs/");
// For compiled: use current working directory
// For source: use script directory
const baseDir = isCompiled ? process.cwd() : import.meta.dir;

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // API endpoint
    if (url.pathname === "/api") {
      return new Response(JSON.stringify({ message: "Hello from Bun!" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Serve static files
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const file = Bun.file(resolve(baseDir, "index.html"));
      return new Response(file, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Serve client JavaScript
    // Dev: transpile TypeScript on-the-fly
    // Prod/Compiled: serve pre-bundled file
    if (url.pathname === "/client.js") {
      const file = isDev && !isCompiled
        ? Bun.file(resolve(baseDir, "client.ts"))
        : Bun.file(resolve(baseDir, "client.js"));
      return new Response(file, {
        headers: { "Content-Type": "text/javascript" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Server running at http://localhost:${PORT} (${isDev ? "development" : "production"} mode)`);
