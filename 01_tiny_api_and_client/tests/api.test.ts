import { test, expect, describe } from "bun:test";
import { serve } from "bun";

describe("API Server", () => {
  test("GET /api returns hello message", async () => {
    const server = serve({
      port: 0,
      fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/api") {
          return new Response(JSON.stringify({ message: "Hello from Bun!" }), {
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response("Not Found", { status: 404 });
      },
    });

    const res = await fetch(`http://localhost:${server.port}/api`);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Hello from Bun!");

    server.stop();
  });

  test("GET / returns 404 for unknown routes", async () => {
    const server = serve({
      port: 0,
      fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/api") {
          return new Response(JSON.stringify({ message: "Hello from Bun!" }));
        }
        return new Response("Not Found", { status: 404 });
      },
    });

    const res = await fetch(`http://localhost:${server.port}/unknown`);

    expect(res.status).toBe(404);

    server.stop();
  });
});
