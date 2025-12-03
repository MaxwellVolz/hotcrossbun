# WebSocket Chat Application

A real-time chat application built with Bun, showcasing WebSocket capabilities, JSON messaging, TypeScript transpilation, and standalone compilation.

## What This Project Does

A full-featured real-time chat application featuring:
- **WebSocket server** with Bun's native WebSocket support
- **JSON messaging structure** for typed communication
- **Real-time chat** with instant message broadcasting
- **User presence** tracking (join/leave notifications)
- **Multiple clients** support with synchronized state
- **TypeScript transpilation** on-the-fly in development
- **Beautiful UI** with smooth CSS animations
- **Standalone executable** compilation

## Installation

### Prerequisites
[Bun](https://bun.sh) must be installed on your system.

```bash
# Install Bun (macOS, Linux, WSL)
curl -fsSL https://bun.sh/install | bash

# Or on Windows
powershell -c "irm bun.sh/install.ps1|iex"
```

### Setup
```bash
cd 02_websocket_chat
bun install
```

## Quick Start

### Development Mode
```bash
# Start dev server with hot reload
bun run dev
```

Visit `http://localhost:3000` and open multiple browser tabs/windows to test multi-user chat in real-time.

### Production Mode
```bash
# Build client bundle
bun run build

# Start production server
bun run start
```

### Run Tests
```bash
# Run all WebSocket tests
bun test

# Run the interactive chat simulation
bun test-chat.ts
```

## Project Structure

```
02_websocket_chat/
├── src/
│   ├── server.ts        # WebSocket server with JSON messaging
│   ├── client.ts        # Chat client TypeScript code
│   └── index.html       # Chat UI with CSS animations
├── tests/
│   └── server.test.ts   # WebSocket functionality tests
├── dist/                # Build output (generated)
│   ├── client.js        # Bundled frontend (~4KB)
│   └── server           # Compiled executable (~100MB)
├── test-chat.ts         # Interactive multi-client test script
├── bunfig.toml          # Bun configuration
├── package.json         # Project metadata and scripts
└── .gitignore           # Exclude build artifacts
```

## Available Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `bun run dev`       | Start development server with hot reload |
| `bun run build`     | Bundle client to `dist/client.js`        |
| `bun run compile`   | Compile server to standalone executable  |
| `bun run build:all` | Build client + compile server            |
| `bun run start`     | Start production server                  |
| `bun test`          | Run all tests                            |
| `bun test-chat.ts`  | Run interactive chat simulation          |

## Testing the Chat

### Method 1: Browser (Visual Testing)

1. Start the server: `bun run dev`
2. Open `http://localhost:3000` in **multiple browser tabs** or windows
3. Send messages in one tab and watch them appear in all tabs instantly
4. Close a tab and see the "left" notification in other tabs

### Method 2: Automated Test Script

```bash
bun test-chat.ts
```

This simulates 3 users (Alice, Bob, Charlie) having a conversation:
- Alice, Bob, and Charlie connect sequentially
- They exchange 5 messages
- Charlie leaves early
- Alice and Bob say goodbye
- All clients disconnect cleanly

**Expected Output:**
```
🚀 Starting WebSocket chat test...
📡 Connecting clients...
[Alice] Connected
[Alice] Assigned username: User842
[Bob] Connected
[Alice] 👋 User292 joined
...
✅ Test completed successfully!
```

### Method 3: Unit Tests

```bash
bun test
```

Tests include:
- WebSocket connection lifecycle
- Message sending and receiving
- JSON parsing and validation
- Multiple concurrent clients
- 404 handling for unknown routes

## How It Works

### Message Types

The application uses a typed JSON messaging structure:

```typescript
interface ChatMessage {
  type: "message" | "join" | "leave" | "users";
  username?: string;
  text?: string;
  timestamp?: number;
  users?: string[];
}
```

**Message Types:**
- `join` - User connected (server assigns username like `User123`)
- `leave` - User disconnected
- `message` - Chat message with text content
- `users` - List of currently connected users

### Server Flow
1. Server starts on port 3000 (configurable via `PORT` env var)
2. Client connects to `/ws` WebSocket endpoint
3. Server assigns random username (`User${random}`)
4. Server sends join notification to new client
5. Server broadcasts join notification to all other clients
6. Server sends current user list to new client
7. When client sends message, server broadcasts to ALL clients (including sender)
8. On disconnect, server broadcasts leave notification

### Client Flow
1. Client connects to WebSocket at `ws://localhost:3000/ws`
2. Receives assigned username from server
3. Updates UI to show "Connected" status
4. Enables input field and send button
5. Displays system messages (join/leave) in gray/italic
6. Renders incoming messages with username, text, and timestamp
7. Distinguishes own messages (right-aligned, purple) from others
8. Auto-reconnects after 3 seconds if connection drops

### TypeScript Transpilation

In development mode, the server uses Bun's `Transpiler` to convert TypeScript to JavaScript on-the-fly:

```typescript
const transpiler = new Bun.Transpiler({ loader: "ts" });
const code = await file.text();
const js = transpiler.transformSync(code);
```

This allows browsers to execute the TypeScript code without a separate build step during development.

### Compiled Executable Mode
1. `bun build --compile` creates standalone binary
2. Binary includes entire Bun runtime (~100MB)
3. Detects compiled mode via `import.meta.dir.includes("/$bunfs/")`
4. Uses `process.cwd()` to locate static assets
5. **No Bun installation required** on target system!

## Distribution

### Option 1: Standalone Executable (Recommended)

Perfect for deploying without dependencies.

```bash
# Build everything
bun run build:all

# Create release package
mkdir -p release
cp dist/server release/
cp src/index.html release/
cp dist/client.js release/
zip -r release.zip release/
```

**Recipients:**
```bash
unzip release.zip
cd release
./server

# Or with custom port
PORT=8080 ./server
```

**Important:** Run the executable from the directory containing `index.html` and `client.js`.

### Option 2: Share Source Code

**Via Git:**
```bash
git clone <your-repo-url>
cd 02_websocket_chat
bun install
bun run dev
```

## Features Demonstrated

✅ Native WebSocket server with Bun
✅ JSON message structure with TypeScript types
✅ Real-time bidirectional communication
✅ Multiple client support with broadcasting
✅ User presence tracking (join/leave events)
✅ Automatic reconnection logic
✅ TypeScript transpilation on-the-fly
✅ Standalone executable compilation
✅ Hot reload in development
✅ Production bundling and optimization

## Development Phases

### Phase 1: Project Setup
- Created `package.json` with WebSocket-focused scripts
- Set up `bunfig.toml` and `.gitignore`
- Created directory structure (`src/`, `tests/`)
- **Key Learning**: Same minimal configuration as REST API project

### Phase 2: WebSocket Server
- Built WebSocket server with Bun's native `websocket` option in `serve()`
- Implemented JSON messaging structure with TypeScript interfaces
- Added user tracking with `Set<ServerWebSocket>`
- Created `broadcastMessage()` function for message distribution
- Added random username generation (`User${random}`)
- Implemented join/leave notifications
- **Key Learning**: Bun's WebSocket API is simple and performant - no external libraries needed

### Phase 3: Chat Client
- Created beautiful chat UI with gradient background and CSS animations
- Built TypeScript client with `ChatClient` class
- Implemented WebSocket connection handling with error recovery
- Added message rendering with user distinction (self vs others)
- Implemented auto-scroll to bottom on new messages
- Added timestamp formatting
- Created reconnection logic (3-second delay)
- **Key Learning**: Native browser WebSocket API works seamlessly with Bun server

### Phase 4: Testing
- Implemented unit tests with `bun:test` for:
  - WebSocket connection lifecycle
  - Message sending and receiving
  - Multiple concurrent clients
  - 404 handling
- Created interactive test script (`test-chat.ts`) simulating 3 users
- All tests pass in under 50ms
- **Key Learning**: Bun's test runner handles async WebSocket tests easily with promises

### Phase 5: Build & Compilation
- Generated production client bundle (~4KB)
- Added TypeScript transpilation with `Bun.Transpiler` for dev mode
- Fixed async/await in server's fetch handler
- Compiled server to standalone executable
- Verified both dev and compiled modes work correctly
- Fixed duplicate message issue (was broadcasting + sending separately)
- **Key Learning**: TypeScript needs transpilation for browsers; Bun makes this trivial

## WebSocket Message Flow

```
Client A                Server                Client B
   |                      |                      |
   |------- connect ----->|                      |
   |<-- join (UserA) -----|                      |
   |<-- users list -------|                      |
   |                      |                      |
   |                      |<----- connect -------|
   |<-- join (UserB) -----|----> join (UserB) -->|
   |                      |----> users list ---->|
   |                      |                      |
   |--- message(text) --->|                      |
   |<------ message ------|----> message ------->|
   |                      |                      |
   |                      |      disconnect <----|
   |<-- leave (UserB) ----|                      |
```

## Why Bun for WebSockets?

- **Native Support**: No socket.io or ws library needed
- **Type Safety**: Full TypeScript support for messages
- **Performance**: Fast WebSocket implementation
- **Simple API**: Clean, intuitive server/client API
- **Hot Reload**: Changes reflect immediately with `--watch`
- **Transpilation**: Built-in TypeScript transpiler
- **Standalone Builds**: Deploy single executable without dependencies

## Common Issues & Solutions

### Issue: "Connecting..." stuck
**Solution**: The TypeScript wasn't transpiled. Fixed by adding `Bun.Transpiler` to convert TS to JS for browsers.

### Issue: Duplicate messages for sender
**Solution**: Server was broadcasting AND sending directly to sender. Removed redundant send.

### Issue: Can't send messages in browser
**Solution**: Make sure server's fetch handler is `async` to support transpilation.

## Next Steps

Enhance this chat app with:
- **Custom Usernames**: Allow users to set their own names
- **Rooms/Channels**: Multiple chat rooms with tabs
- **Private Messages**: Direct messaging between users
- **Message History**: Store messages in Bun's built-in SQLite
- **File Sharing**: Upload and share images/files
- **Typing Indicators**: Show when users are typing
- **Read Receipts**: Track message read status
- **User Authentication**: Login system with sessions
- **Emojis and Reactions**: Rich message content with emoji picker
- **User Avatars**: Profile pictures with Gravatar integration
- **Message Search**: Full-text search through chat history
- **Markdown Support**: Format messages with markdown
- **Code Highlighting**: Syntax highlighting for code blocks

## License

MIT
