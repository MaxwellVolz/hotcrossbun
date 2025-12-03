// Test the release server
const ws = new WebSocket("ws://localhost:3005/ws");

ws.onopen = () => {
  console.log("✅ Connected to release server!");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("📥 Received:", message);

  if (message.type === "join") {
    console.log(`✅ Got username: ${message.username}`);
    // Send a test message
    ws.send(JSON.stringify({ type: "message", text: "Hello from test!" }));
  } else if (message.type === "message") {
    console.log("✅ Message echoed back successfully!");
    ws.close();
  }
};

ws.onclose = () => {
  console.log("✅ Connection closed");
  process.exit(0);
};

ws.onerror = (error) => {
  console.error("❌ Error:", error);
  process.exit(1);
};

setTimeout(() => {
  console.log("❌ Test timeout");
  process.exit(1);
}, 5000);
