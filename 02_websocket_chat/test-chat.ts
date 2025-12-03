// Test script to simulate multiple chat clients
interface ChatMessage {
  type: "message" | "join" | "leave" | "users";
  username?: string;
  text?: string;
  timestamp?: number;
  users?: string[];
}

class TestClient {
  private ws: WebSocket | null = null;
  private name: string;
  private myUsername: string = "";

  constructor(name: string) {
    this.name = name;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket("ws://localhost:3000/ws");

      this.ws.onopen = () => {
        console.log(`[${this.name}] Connected`);
      };

      this.ws.onmessage = (event) => {
        const message: ChatMessage = JSON.parse(event.data);

        if (message.type === "join" && !this.myUsername) {
          this.myUsername = message.username!;
          console.log(`[${this.name}] Assigned username: ${this.myUsername}`);
          resolve();
        } else if (message.type === "join") {
          console.log(`[${this.name}] 👋 ${message.username} joined`);
        } else if (message.type === "leave") {
          console.log(`[${this.name}] 👋 ${message.username} left`);
        } else if (message.type === "message") {
          const isMe = message.username === this.myUsername;
          console.log(`[${this.name}] ${isMe ? "📤" : "📥"} ${message.username}: ${message.text}`);
        }
      };

      this.ws.onerror = (error) => {
        console.error(`[${this.name}] Error:`, error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log(`[${this.name}] Disconnected`);
      };
    });
  }

  sendMessage(text: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "message", text }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function testChat() {
  console.log("🚀 Starting WebSocket chat test...\n");

  // Create three clients
  const alice = new TestClient("Alice");
  const bob = new TestClient("Bob");
  const charlie = new TestClient("Charlie");

  try {
    // Connect clients sequentially
    console.log("📡 Connecting clients...\n");
    await alice.connect();
    await new Promise(resolve => setTimeout(resolve, 500));

    await bob.connect();
    await new Promise(resolve => setTimeout(resolve, 500));

    await charlie.connect();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate a conversation
    console.log("\n💬 Starting conversation...\n");

    alice.sendMessage("Hello everyone!");
    await new Promise(resolve => setTimeout(resolve, 500));

    bob.sendMessage("Hey Alice! How are you?");
    await new Promise(resolve => setTimeout(resolve, 500));

    charlie.sendMessage("Hi folks! Great to be here!");
    await new Promise(resolve => setTimeout(resolve, 500));

    alice.sendMessage("Doing great! This WebSocket chat is fast!");
    await new Promise(resolve => setTimeout(resolve, 500));

    bob.sendMessage("Yeah, Bun is amazing! 🚀");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Charlie leaves
    console.log("\n👋 Charlie leaving...\n");
    charlie.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500));

    alice.sendMessage("Bye Charlie!");
    await new Promise(resolve => setTimeout(resolve, 500));

    bob.sendMessage("See you later!");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Cleanup
    console.log("\n🧹 Disconnecting remaining clients...\n");
    alice.disconnect();
    bob.disconnect();

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("✅ Test completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testChat();
