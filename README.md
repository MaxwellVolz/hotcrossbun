
# Hot Cross Bun

![Hot Cross Bun Logo](./hotcrossbun.png)

A collection of small, focused projects built to explore **Bun**: the runtime, the bundler, the test runner, and Bun’s ability to ship **self-contained executables**.

Each subproject isolates one capability with the goal of understanding how Bun behaves in real-world build and release workflows.

## Goals

* Learn Bun’s runtime, APIs, and development workflow
* Compare Bun to traditional Node tooling
* Ship standalone binaries using `bun build --compile`
* Keep each example minimal, fast, and production-lean

## Project Structure

```
01_tiny_api_and_client/   Minimal API + client bundle, compiled release
02_websocket_chat/        WebSocket chat server + browser test page
03_scheduled_scraper/     Cron-style scraper with local data output
04_tiny_cli/              Simple CLI tool compiled to a native binary
```

Each folder includes:

* `src/` – the implementation
* `tests/` – Bun test examples
* `bunfig.toml` – project config
* `release/` – compiled executables

## Getting Started

Install Bun:

```sh
curl -fsSL https://bun.sh/install | bash
```

Run any example:

```sh
cd 01_tiny_api_and_client
bun dev
```

Build a native executable:

```sh
bun build src/app.ts --compile --outfile release/app
```

