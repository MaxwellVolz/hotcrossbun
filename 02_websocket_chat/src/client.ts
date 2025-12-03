interface ChatMessage {
  type: "message" | "join" | "leave" | "users";
  username?: string;
  text?: string;
  timestamp?: number;
  users?: string[];
}

class ChatClient {
  private ws: WebSocket | null = null;
  private myUsername: string = "";
  private messagesEl: HTMLElement;
  private statusEl: HTMLElement;
  private inputEl: HTMLInputElement;
  private sendButton: HTMLButtonElement;

  constructor() {
    this.messagesEl = document.getElementById("messages")!;
    this.statusEl = document.getElementById("status")!;
    this.inputEl = document.getElementById("messageInput") as HTMLInputElement;
    this.sendButton = document.getElementById("sendButton") as HTMLButtonElement;

    this.setupEventListeners();
    this.connect();
  }

  private connect() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.updateStatus("Connected", true);
      this.inputEl.disabled = false;
      this.sendButton.disabled = false;
    };

    this.ws.onmessage = (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.updateStatus("Error", false);
    };

    this.ws.onclose = () => {
      this.updateStatus("Disconnected", false);
      this.inputEl.disabled = true;
      this.sendButton.disabled = true;

      // Attempt to reconnect after 3 seconds
      setTimeout(() => this.connect(), 3000);
    };
  }

  private setupEventListeners() {
    this.sendButton.addEventListener("click", () => this.sendMessage());
    this.inputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });
  }

  private sendMessage() {
    const text = this.inputEl.value.trim();
    if (!text || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message: ChatMessage = {
      type: "message",
      text,
    };

    this.ws.send(JSON.stringify(message));
    this.inputEl.value = "";
  }

  private handleMessage(message: ChatMessage) {
    switch (message.type) {
      case "join":
        if (!this.myUsername) {
          this.myUsername = message.username!;
          this.addSystemMessage(`You joined as ${this.myUsername}`);
        } else {
          this.addSystemMessage(`${message.username} joined the chat`);
        }
        break;

      case "leave":
        this.addSystemMessage(`${message.username} left the chat`);
        break;

      case "message":
        this.addChatMessage(message);
        break;

      case "users":
        console.log("Current users:", message.users);
        break;
    }
  }

  private addSystemMessage(text: string) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message system";
    messageDiv.textContent = text;
    this.messagesEl.appendChild(messageDiv);
    this.scrollToBottom();
  }

  private addChatMessage(message: ChatMessage) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message user ${message.username === this.myUsername ? "me" : ""}`;

    const usernameDiv = document.createElement("div");
    usernameDiv.className = "username";
    usernameDiv.textContent = message.username!;

    const textDiv = document.createElement("div");
    textDiv.className = "text";
    textDiv.textContent = message.text!;

    const timestampDiv = document.createElement("div");
    timestampDiv.className = "timestamp";
    timestampDiv.textContent = this.formatTime(message.timestamp!);

    messageDiv.appendChild(usernameDiv);
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timestampDiv);

    this.messagesEl.appendChild(messageDiv);
    this.scrollToBottom();
  }

  private updateStatus(status: string, connected: boolean) {
    this.statusEl.textContent = status;
    this.statusEl.style.color = connected ? "#90ee90" : "#ffcccb";
  }

  private scrollToBottom() {
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  private formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}

// Initialize chat when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ChatClient();
});
