import { test, expect, describe } from "bun:test";

describe("WebSocket Chat Server", () => {
  test("WebSocket connection and messaging", async () => {
    const port = 3100 + Math.floor(Math.random() * 100);

    // Start a test server
    const server = Bun.serve({
      port,
      fetch(req, server) {
        const url = new URL(req.url);
        if (url.pathname === "/ws") {
          const upgraded = server.upgrade(req);
          if (!upgraded) {
            return new Response("WebSocket upgrade failed", { status: 400 });
          }
          return undefined;
        }
        return new Response("Not Found", { status: 404 });
      },
      websocket: {
        open(ws) {
          ws.send(JSON.stringify({ type: "join", username: "TestUser" }));
        },
        message(ws, message) {
          const data = JSON.parse(message.toString());
          if (data.type === "message") {
            ws.send(JSON.stringify({
              type: "message",
              username: "TestUser",
              text: data.text,
              timestamp: Date.now(),
            }));
          }
        },
        close() {},
      },
    });

    try {
      // Connect WebSocket client
      const ws = new WebSocket(`ws://localhost:${port}/ws`);

      // Wait for connection and initial message
      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => resolve();
        ws.onerror = (error) => reject(error);
      });

      // Receive join message
      const joinMessage = await new Promise<string>((resolve) => {
        ws.onmessage = (event) => resolve(event.data);
      });

      const join = JSON.parse(joinMessage);
      expect(join.type).toBe("join");
      expect(join.username).toBe("TestUser");

      // Send a chat message
      ws.send(JSON.stringify({ type: "message", text: "Hello, Bun!" }));

      // Receive echo message
      const echoMessage = await new Promise<string>((resolve) => {
        ws.onmessage = (event) => resolve(event.data);
      });

      const echo = JSON.parse(echoMessage);
      expect(echo.type).toBe("message");
      expect(echo.text).toBe("Hello, Bun!");
      expect(echo.username).toBe("TestUser");

      ws.close();
    } finally {
      server.stop();
    }
  }, 10000);

  test("HTTP endpoint returns 404 for unknown routes", async () => {
    const port = 3200 + Math.floor(Math.random() * 100);

    const server = Bun.serve({
      port,
      fetch() {
        return new Response("Not Found", { status: 404 });
      },
    });

    try {
      const res = await fetch(`http://localhost:${port}/unknown`);
      expect(res.status).toBe(404);
    } finally {
      server.stop();
    }
  });

  test("Multiple clients can connect", async () => {
    const port = 3300 + Math.floor(Math.random() * 100);
    const clients = new Set();

    const server = Bun.serve({
      port,
      fetch(req, server) {
        const url = new URL(req.url);
        if (url.pathname === "/ws") {
          const upgraded = server.upgrade(req);
          return upgraded ? undefined : new Response("Failed", { status: 400 });
        }
        return new Response("Not Found", { status: 404 });
      },
      websocket: {
        open(ws) {
          clients.add(ws);
          ws.send(JSON.stringify({ type: "join", count: clients.size }));
        },
        message() {},
        close(ws) {
          clients.delete(ws);
        },
      },
    });

    try {
      const ws1 = new WebSocket(`ws://localhost:${port}/ws`);
      const ws2 = new WebSocket(`ws://localhost:${port}/ws`);

      await Promise.all([
        new Promise<void>((resolve) => {
          ws1.onopen = () => resolve();
        }),
        new Promise<void>((resolve) => {
          ws2.onopen = () => resolve();
        }),
      ]);

      expect(clients.size).toBe(2);

      ws1.close();
      ws2.close();
    } finally {
      server.stop();
    }
  }, 10000);
});
