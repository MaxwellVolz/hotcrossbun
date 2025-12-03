# Tiny API Server + Web Client

A minimal Bun project showcasing the runtime's key features: fast startup, built-in TypeScript support, native bundling, standalone compilation, and zero-config development.

## What This Project Does

A single-repo full-stack application featuring:
- **REST API** serving JSON data at `/api`
- **Static file server** for HTML and assets
- **Web client** that fetches and displays API data
- **Built-in tests** using Bun's test runner
- **Hot reload** for rapid development
- **Standalone executable** compilation (no runtime dependencies!)

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
cd 01_tiny_api_and_client
bun install
```

## Quick Start

### Development Mode
```bash
# Start dev server with hot reload
bun run dev
```

Visit `http://localhost:3000` - TypeScript files are transpiled on-the-fly (no build step needed).

### Production Mode
```bash
# Build client bundle
bun run build

# Start production server
bun run start
```

### Run Tests
```bash
bun test
```

## Project Structure

```
01_tiny_api_and_client/
├── src/
│   ├── api.ts         # Server with API and static file handling
│   ├── client.ts      # Frontend TypeScript code
│   └── index.html     # HTML page
├── tests/
│   └── api.test.ts    # API endpoint tests
├── dist/              # Build output (generated)
│   ├── client.js      # Bundled frontend
│   └── server         # Compiled executable (~100MB)
├── bunfig.toml        # Bun configuration
├── package.json       # Project metadata and scripts
└── .gitignore         # Exclude node_modules, dist, etc.
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

## How It Works

### Development Mode
1. Server starts (`src/api.ts`) on port 3000
2. Browser requests `http://localhost:3000`
3. Server responds with `index.html`
4. Browser loads `/client.js`
5. Server serves `client.ts` and transpiles it on-the-fly
6. Client fetches data from `/api` endpoint
7. Client renders the response in the DOM

### Production Mode
1. `bun run build` creates optimized `dist/client.js`
2. `bun run start` sets `NODE_ENV=production`
3. Server serves pre-bundled `dist/client.js` (no transpilation)
4. Faster response times and reduced server load

### Compiled Executable Mode
1. `bun build --compile` creates a standalone binary
2. Binary includes the entire Bun runtime (~100MB)
3. Detects it's compiled via `import.meta.dir.includes("/$bunfs/")`
4. Uses `process.cwd()` to locate `index.html` and `client.js`
5. **No Bun installation required** on target system!

## Distribution

### Option 1: Standalone Executable (Recommended)

Perfect for sharing with users who don't have Bun installed.

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

# Or with custom settings
PORT=8080 NODE_ENV=production ./server
```

**Important:** Run the executable from the directory containing `index.html` and `client.js`.

### Option 2: Share Source Code

**Via Git:**
```bash
git clone <your-repo-url>
cd 01_tiny_api_and_client
bun install
bun run dev
```

**Via ZIP:**
Share the project folder (`.gitignore` excludes build artifacts). Recipients need Bun installed.

## Deployment

### Fly.io
```bash
curl -L https://fly.io/install.sh | sh
fly launch
fly deploy
```

### Railway
1. Connect your GitHub repo
2. Railway auto-detects Bun
3. Set start command: `bun run build && bun run start`
4. Deploy!

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to `production` for production builds

## Development Phases

### Phase 1: Project Setup
- Created `package.json` with dev scripts
- Set up `bunfig.toml` and directory structure
- **Key Learning**: Minimal configuration needed

### Phase 2: API Server
- Built REST endpoint at `/api`
- Added static file serving
- Implemented on-the-fly TypeScript transpilation
- **Key Learning**: Bun serves TypeScript directly to browsers

### Phase 3: Web Client
- Created HTML with embedded styles
- Built TypeScript client with fetch and DOM manipulation
- **Key Learning**: No bundler required in development

### Phase 4: Testing
- Implemented tests with `bun:test`
- Tested API endpoints and error handling
- **Key Learning**: Instant test startup, zero config

### Phase 5: Build & Compilation
- Generated production bundle
- Compiled to standalone executable with `bun build --compile`
- Implemented path detection for compiled vs source mode
- **Key Learning**: Ship a single ~100MB binary - no dependencies!

## Why Bun?

- **Speed**: 2-3x faster startup than Node.js
- **Simplicity**: One tool for dev, test, build, and production
- **Modern**: Native TypeScript, ESM, and Web APIs
- **Batteries Included**: Bundler, test runner, runtime - all built-in
- **Standalone Builds**: Compile to executable with embedded runtime

## Features Demonstrated

✅ Direct TypeScript execution
✅ Hot reload with `--watch`
✅ Built-in bundler (no webpack/vite)
✅ Built-in test runner (no Jest)
✅ Web-standard APIs (`serve()`, `fetch()`, `Bun.file()`)
✅ Zero-config TypeScript
✅ Standalone executable compilation
✅ Environment-based configuration

## Next Steps

Enhance this project with:
- Additional REST endpoints (POST, PUT, DELETE)
- Bun's built-in SQLite database
- WebSocket support for real-time features
- CSS preprocessing or Tailwind
- Authentication and sessions
- Docker containerization
- CI/CD pipelines

## License

MIT
