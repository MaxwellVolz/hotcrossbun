import { scrapeHackerNews, type HNPost } from "./scraper";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface SchedulerConfig {
  intervalMinutes: number;
  limit: number;
  dataDir: string;
  saveJson: boolean;
  saveCsv: boolean;
  runOnStart: boolean;
}

class HackerNewsScheduler {
  private config: SchedulerConfig;
  private intervalId: Timer | null = null;
  private isRunning = false;

  constructor(config: Partial<SchedulerConfig> = {}) {
    this.config = {
      intervalMinutes: parseInt(process.env.INTERVAL_MINUTES || "60"),
      limit: parseInt(process.env.SCRAPE_LIMIT || "30"),
      dataDir: process.env.DATA_DIR || "data",
      saveJson: process.env.SAVE_JSON !== "false",
      saveCsv: process.env.SAVE_CSV !== "false",
      runOnStart: process.env.RUN_ON_START !== "false",
      ...config,
    };
  }

  async start() {
    if (this.isRunning) {
      console.log("⚠️  Scheduler is already running");
      return;
    }

    this.isRunning = true;
    console.log("🚀 Starting Hacker News Scheduler");
    console.log(`📅 Interval: ${this.config.intervalMinutes} minutes`);
    console.log(`📊 Limit: ${this.config.limit} posts`);
    console.log(`💾 Data directory: ${this.config.dataDir}`);
    console.log(`📄 Formats: ${this.config.saveJson ? "JSON " : ""}${this.config.saveCsv ? "CSV" : ""}`);
    console.log("");

    // Ensure data directory exists
    await this.ensureDataDir();

    // Run immediately if configured
    if (this.config.runOnStart) {
      await this.runScrape();
    }

    // Schedule recurring scrapes
    const intervalMs = this.config.intervalMinutes * 60 * 1000;
    this.intervalId = setInterval(() => {
      this.runScrape();
    }, intervalMs);

    console.log(`⏰ Next scrape in ${this.config.intervalMinutes} minutes`);
  }

  async stop() {
    if (!this.isRunning) {
      return;
    }

    console.log("\n🛑 Stopping scheduler...");
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("✅ Scheduler stopped");
  }

  private async ensureDataDir() {
    try {
      await mkdir(this.config.dataDir, { recursive: true });
    } catch (error) {
      console.error(`❌ Failed to create data directory: ${error}`);
      throw error;
    }
  }

  private async runScrape() {
    const startTime = Date.now();
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🕐 ${new Date().toISOString()}`);
    console.log(`${"=".repeat(60)}`);

    try {
      const posts = await scrapeHackerNews(this.config.limit);

      if (posts.length === 0) {
        console.log("⚠️  No posts scraped");
        return;
      }

      // Save data
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      if (this.config.saveJson) {
        await this.saveJson(posts, timestamp);
      }

      if (this.config.saveCsv) {
        await this.saveCsv(posts, timestamp);
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n✨ Scrape completed in ${duration}s`);
      console.log(`⏰ Next scrape at ${new Date(Date.now() + this.config.intervalMinutes * 60 * 1000).toLocaleTimeString()}`);
    } catch (error) {
      console.error(`❌ Scrape failed: ${error}`);
    }
  }

  private async saveJson(posts: HNPost[], timestamp: string) {
    const filename = `hn-${timestamp}.json`;
    const filepath = join(this.config.dataDir, filename);

    const data = {
      scrapedAt: new Date().toISOString(),
      count: posts.length,
      posts,
    };

    await writeFile(filepath, JSON.stringify(data, null, 2));
    console.log(`💾 Saved JSON: ${filename}`);
  }

  private async saveCsv(posts: HNPost[], timestamp: string) {
    const filename = `hn-${timestamp}.csv`;
    const filepath = join(this.config.dataDir, filename);

    // CSV header
    const headers = ["rank", "title", "url", "points", "author", "commentCount", "timestamp"];
    const rows = [headers.join(",")];

    // CSV rows
    for (const post of posts) {
      const row = [
        post.rank,
        `"${post.title.replace(/"/g, '""')}"`, // Escape quotes
        post.url,
        post.points,
        post.author,
        post.commentCount,
        post.timestamp,
      ];
      rows.push(row.join(","));
    }

    await writeFile(filepath, rows.join("\n"));
    console.log(`💾 Saved CSV: ${filename}`);
  }
}

// Run if executed directly
if (import.meta.main) {
  const scheduler = new HackerNewsScheduler();

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n");
    await scheduler.stop();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await scheduler.stop();
    process.exit(0);
  });

  await scheduler.start();
}

export { HackerNewsScheduler, type SchedulerConfig };
