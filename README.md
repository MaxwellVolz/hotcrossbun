
# Hot Cross Bun

![Hot Cross Bun Logo](./hotcrossbun.png)

A collection of small, focused projects built to explore **Bun**: the runtime, the bundler, the test runner, and Bun's ability to ship **self-contained executables**.

Each subproject isolates one capability with the goal of understanding how Bun behaves in real-world build and release workflows.

## Goals

* Learn Bun's runtime, APIs, and development workflow
* Compare Bun to traditional Node tooling
* Ship standalone binaries using `bun build --compile`
* Keep each example minimal, fast, and production-lean
* Build progressively complex applications showcasing different features

## Project Status

| Project                                            | Status     | Description                           | Key Features                                                          |
| -------------------------------------------------- | ---------- | ------------------------------------- | --------------------------------------------------------------------- |
| [01_tiny_api_and_client](./01_tiny_api_and_client) | ✅ Complete | REST API + web client                 | HTTP server, static files, TypeScript transpilation, bundling         |
| [02_websocket_chat](./02_websocket_chat)           | ✅ Complete | Real-time WebSocket chat              | Native WebSockets, JSON messaging, multi-client, auto-reconnect       |
| [03_scheduled_scraper](./03_scheduled_scraper)     | ✅ Complete | Hacker News scraper with scheduling   | Web scraping, cron-like intervals, JSON/CSV export, graceful shutdown |
| [04_tiny_cli](./04_tiny_cli)                       | 📋 Planned  | CLI tool with argument parsing        | Command-line args, colored output, interactive prompts                |
| Future                                             | 💡 Ideas    | Database app, file watcher, API proxy | SQLite, fs watching, HTTP proxying                                    |

## Completed Projects

### 01_tiny_api_and_client

A full-stack application demonstrating Bun's web server capabilities and bundler.

**What it does:**
- Serves REST API endpoints
- Transpiles TypeScript on-the-fly for browsers in dev mode
- Bundles client code for production
- Compiles to standalone executable

**Try it:**
```sh
cd 01_tiny_api_and_client
bun install
bun run dev
# Visit http://localhost:3000
```

**Key learnings:**
- Bun.serve() API for HTTP servers
- Hot reload with --watch
- Zero-config bundling and TypeScript
- Standalone compilation with embedded runtime

---

### 02_websocket_chat

A real-time chat application using Bun's native WebSocket support.

**What it does:**
- WebSocket server with connection handling
- JSON-based messaging protocol
- Real-time broadcasting to all clients
- User presence tracking (join/leave notifications)

**Try it:**
```sh
cd 02_websocket_chat
bun install
bun run dev
# Open http://localhost:3000 in multiple tabs
```

**Key learnings:**
- Native WebSocket API (no socket.io needed)
- TypeScript interfaces for message types
- Multi-client state management
- Auto-reconnection logic

---

### 03_scheduled_scraper

An automated web scraper with configurable scheduling.

**What it does:**
- Scrapes Hacker News front page using regex parsing
- Runs on configurable intervals (cron-like)
- Exports data to JSON and CSV formats
- Handles graceful shutdown (SIGINT/SIGTERM)

**Try it:**
```sh
cd 03_scheduled_scraper
bun install
bun run dev
# Or run once: bun run scrape
```

**Key learnings:**
- Web scraping with native fetch()
- Regex-based HTML parsing (no dependencies)
- setInterval() for scheduling
- Environment-based configuration
- Node.js fs/promises APIs

**Configuration:**
```sh
INTERVAL_MINUTES=15 SCRAPE_LIMIT=50 bun run dev
```

## Project Structure

Each project follows a consistent structure:

```
0X_project_name/
├── src/
│   ├── index.ts           # Main entry point
│   ├── ...                # Additional source files
├── tests/
│   └── *.test.ts          # Test files using bun:test
├── dist/                  # Build output (generated)
│   ├── client.js          # Bundled frontend (if applicable)
│   └── server             # Compiled executable
├── release/               # Release package
│   └── ...                # Standalone binary + assets
├── bunfig.toml            # Bun configuration
├── package.json           # Scripts and metadata
├── .gitignore             # Exclude build artifacts
└── README.md              # Project documentation
```

## Common Scripts

All projects support similar npm scripts:

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `bun run dev`       | Start development server with hot reload |
| `bun run build`     | Bundle client code (if applicable)       |
| `bun run compile`   | Compile to standalone executable         |
| `bun run build:all` | Build client + compile server            |
| `bun run start`     | Run in production mode                   |
| `bun test`          | Run all tests                            |

## Getting Started

### Prerequisites

Install Bun:

```sh
# macOS, Linux, WSL
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1|iex"
```

### Run Any Project

```sh
# Navigate to a project
cd 01_tiny_api_and_client

# Install dependencies (if any)
bun install

# Start development mode
bun run dev
```

### Build a Standalone Executable

```sh
# Compile to single binary
bun run compile

# Run the executable (no Bun required!)
./dist/server
```

## Features Demonstrated Across Projects

### Runtime Features
- ✅ Native TypeScript execution (no tsc needed)
- ✅ Fast startup times (2-3x faster than Node.js)
- ✅ Web-standard APIs (fetch, WebSocket, etc.)
- ✅ Native file I/O (Bun.file, fs/promises)
- ✅ Hot reload with --watch flag

### Build Features
- ✅ Built-in bundler (no webpack/vite)
- ✅ Standalone compilation with --compile
- ✅ TypeScript transpilation for browsers
- ✅ Production optimization

### Test Features
- ✅ Built-in test runner (bun:test)
- ✅ Fast execution (~10s for all tests)
- ✅ expect() API similar to Jest
- ✅ Async/await support

### Development Features
- ✅ Zero-config TypeScript
- ✅ Environment variable support
- ✅ Hot module reload
- ✅ Error stack traces with source maps

## Next Steps

### 04_tiny_cli (Planned)
A command-line tool demonstrating:
- Argument parsing (process.argv)
- Colored terminal output
- Interactive prompts
- File system operations
- Compiled to cross-platform binary

### Future Ideas
- **05_database_app** - CRUD app with Bun's built-in SQLite
- **06_file_watcher** - File system watcher with event handling
- **07_api_proxy** - HTTP proxy with request/response transformation
- **08_image_processor** - Image manipulation with sharp
- **09_real_time_dashboard** - WebSocket + Server-Sent Events
- **10_microservice** - REST API with routing and middleware

## Why Bun?

### Speed
- **2-3x faster startup** than Node.js
- **Fast bundling** compared to webpack
- **Instant tests** with built-in runner

### Simplicity
- **One tool** for dev, test, build, and run
- **Zero configuration** for TypeScript
- **No babel, webpack, jest, ts-node** needed

### Modern
- **Native ESM** and TypeScript
- **Web-standard APIs** (fetch, WebSocket, etc.)
- **Latest JavaScript features** out of the box

### Deployment
- **Standalone binaries** with embedded runtime (~100MB)
- **No dependencies** on target system
- **Cross-platform** compilation

## Development Workflow

1. **Create project structure**
   - Set up package.json, bunfig.toml, .gitignore
   - Create src/ and tests/ directories

2. **Implement core functionality**
   - Write TypeScript code in src/
   - Use native Bun APIs where possible

3. **Add tests**
   - Create tests in tests/ using bun:test
   - Run with `bun test`

4. **Develop with hot reload**
   - Use `bun --watch` for instant feedback
   - No build step required

5. **Build for production**
   - Bundle client code if needed
   - Compile to standalone executable

6. **Document**
   - Comprehensive README with examples
   - Configuration options
   - Deployment instructions

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [Bun GitHub Repository](https://github.com/oven-sh/bun)
- [Bun Discord Community](https://bun.sh/discord)

## License

MIT

