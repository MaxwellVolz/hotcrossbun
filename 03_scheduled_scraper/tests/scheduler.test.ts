import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { HackerNewsScheduler } from "../src/index";
import { rm, readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const TEST_DATA_DIR = "test-data";

describe("HackerNews Scheduler", () => {
  beforeEach(async () => {
    // Clean up test data directory before each test
    if (existsSync(TEST_DATA_DIR)) {
      await rm(TEST_DATA_DIR, { recursive: true });
    }
  });

  afterEach(async () => {
    // Clean up test data directory after each test
    if (existsSync(TEST_DATA_DIR)) {
      await rm(TEST_DATA_DIR, { recursive: true });
    }
  });

  test("should create scheduler with default config", () => {
    const scheduler = new HackerNewsScheduler();
    expect(scheduler).toBeDefined();
  });

  test("should create scheduler with custom config", () => {
    const scheduler = new HackerNewsScheduler({
      intervalMinutes: 30,
      limit: 10,
      dataDir: TEST_DATA_DIR,
    });
    expect(scheduler).toBeDefined();
  });

  test("should create data directory on start", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: false,
    });

    await scheduler.start();
    expect(existsSync(TEST_DATA_DIR)).toBe(true);
    await scheduler.stop();
  });

  test("should save JSON file when scraping", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: true,
      limit: 5,
      saveJson: true,
      saveCsv: false,
    });

    await scheduler.start();

    // Wait a bit for scraping to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const files = await readdir(TEST_DATA_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    expect(jsonFiles.length).toBeGreaterThan(0);

    await scheduler.stop();
  });

  test("should save CSV file when scraping", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: true,
      limit: 5,
      saveJson: false,
      saveCsv: true,
    });

    await scheduler.start();

    // Wait a bit for scraping to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const files = await readdir(TEST_DATA_DIR);
    const csvFiles = files.filter((f) => f.endsWith(".csv"));

    expect(csvFiles.length).toBeGreaterThan(0);

    await scheduler.stop();
  });

  test("should save both JSON and CSV files", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: true,
      limit: 5,
      saveJson: true,
      saveCsv: true,
    });

    await scheduler.start();

    // Wait a bit for scraping to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const files = await readdir(TEST_DATA_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const csvFiles = files.filter((f) => f.endsWith(".csv"));

    expect(jsonFiles.length).toBeGreaterThan(0);
    expect(csvFiles.length).toBeGreaterThan(0);

    await scheduler.stop();
  });

  test("JSON file should have valid structure", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: true,
      limit: 3,
      saveJson: true,
      saveCsv: false,
    });

    await scheduler.start();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const files = await readdir(TEST_DATA_DIR);
    const jsonFile = files.find((f) => f.endsWith(".json"));

    expect(jsonFile).toBeDefined();

    const content = await readFile(`${TEST_DATA_DIR}/${jsonFile}`, "utf-8");
    const data = JSON.parse(content);

    expect(data).toHaveProperty("scrapedAt");
    expect(data).toHaveProperty("count");
    expect(data).toHaveProperty("posts");
    expect(Array.isArray(data.posts)).toBe(true);
    expect(data.posts.length).toBeGreaterThan(0);

    await scheduler.stop();
  });

  test("CSV file should have valid structure", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: true,
      limit: 3,
      saveJson: false,
      saveCsv: true,
    });

    await scheduler.start();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const files = await readdir(TEST_DATA_DIR);
    const csvFile = files.find((f) => f.endsWith(".csv"));

    expect(csvFile).toBeDefined();

    const content = await readFile(`${TEST_DATA_DIR}/${csvFile}`, "utf-8");
    const lines = content.trim().split("\n");

    // Should have header + data rows
    expect(lines.length).toBeGreaterThan(1);

    // Check header
    const header = lines[0];
    expect(header).toContain("rank");
    expect(header).toContain("title");
    expect(header).toContain("url");
    expect(header).toContain("points");
    expect(header).toContain("author");
    expect(header).toContain("commentCount");

    await scheduler.stop();
  });

  test("should respect runOnStart=false", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: false,
    });

    await scheduler.start();
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Directory should exist but be empty
    const files = await readdir(TEST_DATA_DIR);
    expect(files.length).toBe(0);

    await scheduler.stop();
  });

  test("should handle stop when not running", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: false,
    });

    // Should not throw
    await expect(scheduler.stop()).resolves.toBeUndefined();
  });

  test("should handle multiple start calls", async () => {
    const scheduler = new HackerNewsScheduler({
      dataDir: TEST_DATA_DIR,
      runOnStart: false,
    });

    await scheduler.start();
    await scheduler.start(); // Second call should be ignored

    await scheduler.stop();
  });
});
