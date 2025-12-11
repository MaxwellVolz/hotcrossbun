# Session Notes & Continuity Guide

**Last Updated:** 2025-12-10

## Current Status

### Completed Projects (3/4)

1. **01_tiny_api_and_client** ✅
   - REST API + web client
   - Production ready with standalone binary
   - All tests passing
   - Complete documentation

2. **02_websocket_chat** ✅
   - Real-time WebSocket chat application
   - Production ready with standalone binary
   - All tests passing
   - Complete documentation

3. **03_scheduled_scraper** ✅
   - Hacker News scraper with scheduling
   - Production ready with standalone binary
   - 19 tests passing (scraper + scheduler)
   - Complete documentation
   - JSON/CSV export functionality
   - Environment-based configuration

### Next Project

**04_tiny_cli** 📋 Planned
- Command-line tool with argument parsing
- Interactive prompts
- Colored terminal output
- File system operations
- Compiled to cross-platform binary

## Project Pattern Established

Each project follows this consistent structure:

```
0X_project_name/
├── src/
│   ├── index.ts           # Main entry point
│   └── ...                # Additional modules
├── tests/
│   └── *.test.ts          # Tests using bun:test
├── dist/                  # Build output (gitignored)
│   └── executable         # Compiled binary
├── release/               # Release package (gitignored)
│   └── executable         # Copy for distribution
├── bunfig.toml            # Bun configuration (minimal)
├── package.json           # Standard scripts
├── .gitignore             # Exclude builds, data, node_modules
└── README.md              # Comprehensive documentation
```

### Standard Scripts (package.json)

```json
{
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "compile": "bun build --compile src/index.ts --outfile dist/executable",
    "test": "bun test"
  }
}
```

### Standard .gitignore

```
node_modules/
dist/
release/
*.zip
.bun/
.env
.env.local
.DS_Store
Thumbs.db
.vscode/
.idea/
```

## Development Philosophy

1. **Minimal Dependencies** - Use native Bun/Node APIs whenever possible
2. **Comprehensive READMEs** - Each project has detailed documentation
3. **Production Ready** - All projects compile to standalone binaries
4. **Test Coverage** - All projects have meaningful tests
5. **Environment Config** - Use env vars for configuration
6. **Graceful Shutdown** - Handle SIGINT/SIGTERM properly
7. **Consistent Patterns** - Similar structure across all projects

## Key Learnings So Far

### Bun Runtime
- ✅ Native TypeScript execution (no tsc needed)
- ✅ 2-3x faster startup than Node.js
- ✅ Web-standard APIs (fetch, WebSocket)
- ✅ Hot reload with --watch flag
- ✅ Built-in test runner (bun:test)
- ✅ Zero-config TypeScript

### Bun Build
- ✅ Built-in bundler (no webpack/vite)
- ✅ Standalone compilation (~100MB binaries)
- ✅ TypeScript transpilation for browsers
- ✅ Fast compilation times

### Common Patterns
- ✅ Bun.serve() for HTTP servers
- ✅ Native WebSocket support
- ✅ Environment variable configuration
- ✅ fs/promises for file operations
- ✅ setInterval() for scheduling
- ✅ Process signal handling

## Next Session Checklist

When starting `04_tiny_cli`, follow this pattern:

### Phase 1: Project Setup
- [ ] Create directory structure
- [ ] Set up package.json with standard scripts
- [ ] Create bunfig.toml (can be minimal)
- [ ] Add .gitignore
- [ ] Create src/ and tests/ directories

### Phase 2: Core Implementation
- [ ] Create src/index.ts with main logic
- [ ] Implement CLI argument parsing
- [ ] Add colored output (using ANSI codes)
- [ ] Add interactive prompts if needed
- [ ] Implement file operations

### Phase 3: Testing
- [ ] Create tests/cli.test.ts
- [ ] Test argument parsing
- [ ] Test file operations
- [ ] Test error handling
- [ ] Run `bun test` and verify all pass

### Phase 4: Compilation & Distribution
- [ ] Test compilation with `bun run compile`
- [ ] Verify executable works without Bun
- [ ] Create release/ directory
- [ ] Copy executable to release/

### Phase 5: Documentation
- [ ] Create comprehensive README.md
- [ ] Document all CLI commands/flags
- [ ] Add usage examples
- [ ] Document environment variables
- [ ] Add installation instructions
- [ ] Include troubleshooting section

### Phase 6: Final Verification
- [ ] All tests passing
- [ ] Executable compiles successfully
- [ ] README is complete and accurate
- [ ] Update root README.md status table

## CLI Project Ideas

For `04_tiny_cli`, consider building one of these:

1. **File organizer** - Organize files by extension, date, or size
2. **Text processor** - Search/replace, word count, format conversion
3. **Git helper** - Common git operations with friendly prompts
4. **JSON formatter** - Pretty print, validate, query JSON files
5. **Todo CLI** - Simple task manager with persistent storage
6. **System info** - Display system stats, disk usage, etc.
7. **Config manager** - Manage dotfiles or configuration files

## Recommended CLI Libraries (If Needed)

While we prefer minimal dependencies, these are worth considering:

- **Argument parsing:** Native `process.argv` or `commander`/`yargs`
- **Colors:** ANSI escape codes or `chalk`
- **Prompts:** Native `readline` or `prompts`
- **Tables:** `cli-table3` for formatted output
- **Spinner:** `ora` for loading indicators

**Recommendation:** Start with native APIs, add libraries only if necessary.

## Testing Strategy

For CLI tools, test:
1. Argument parsing (valid/invalid inputs)
2. File operations (read/write/delete)
3. Output formatting (captured stdout)
4. Error handling (invalid paths, permissions)
5. Exit codes (success=0, error=1)

Example test structure:
```typescript
import { spawn } from "bun";

test("should parse arguments correctly", async () => {
  const proc = spawn(["./dist/cli", "--flag", "value"]);
  const output = await proc.exited;
  expect(output).toBe(0);
});
```

## Questions to Consider for Next Project

1. What problem will the CLI solve?
2. What arguments/flags will it accept?
3. Does it need interactive prompts?
4. What file operations are required?
5. Should it have colored output?
6. Does it need persistent storage?
7. Should it support piping (stdin/stdout)?

## Repository Maintenance

### Before Committing
- [ ] Run all tests: `bun test` in each project
- [ ] Verify builds: `bun run compile` in each project
- [ ] Check READMEs are up to date
- [ ] Update root README.md status table
- [ ] Clean up test data directories

### Git Workflow
```bash
# Check status
git status

# Add completed project
git add 03_scheduled_scraper/

# Commit with descriptive message
git commit -m "Complete 03_scheduled_scraper with tests and docs"

# Update root README
git add README.md SESSION_NOTES.md
git commit -m "Update project documentation"
```

## Useful Commands Reference

### Bun Commands
```bash
bun install                    # Install dependencies
bun run dev                    # Development with hot reload
bun run compile                # Build standalone executable
bun test                       # Run all tests
bun test --watch               # Run tests in watch mode
bun --watch src/index.ts       # Run with hot reload
```

### Project Commands
```bash
tree -L 2 -I 'node_modules|dist|data'  # View structure
ls -lh dist/                           # Check binary size
./dist/executable                      # Test executable
```

### Cleanup Commands
```bash
rm -rf dist/ release/ data/    # Clean build artifacts
rm -rf node_modules/           # Clean dependencies
find . -name "*.log" -delete   # Remove logs
```

## Performance Benchmarks

### Build Times (Approximate)
- TypeScript compilation: Instant (no tsc needed)
- Bundling client: < 100ms
- Standalone compilation: 200-300ms
- Test execution: 10-15s for all projects

### Binary Sizes
- Standalone executable: ~100MB (includes Bun runtime)
- Client bundle: 3-5KB (minified)

### Runtime Performance
- Startup time: < 50ms
- Hot reload: < 100ms
- Test execution: ~10s total

## Notes for Future Projects

### 05_database_app
- Use Bun's built-in SQLite (`import { Database } from "bun:sqlite"`)
- Implement CRUD operations
- Add migrations system
- Include transaction examples

### 06_file_watcher
- Use `fs.watch()` or `fs.watchFile()`
- Handle different event types (create, modify, delete)
- Add debouncing for rapid changes
- Include recursive directory watching

### 07_api_proxy
- Build HTTP proxy with request/response transformation
- Add rate limiting
- Include caching layer
- Support WebSocket proxying

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [Bun API Reference](https://bun.sh/docs/api)
- [Bun Discord](https://bun.sh/discord)
- [Project Repository](https://github.com/narfa/hotcrossbun)

## Session Continuity

When resuming work:

1. Read this SESSION_NOTES.md
2. Check root README.md for current status
3. Review completed projects for patterns
4. Decide on next project from roadmap
5. Follow the established pattern
6. Update this file when done

---

**Remember:** Keep projects minimal, production-ready, well-tested, and thoroughly documented.
