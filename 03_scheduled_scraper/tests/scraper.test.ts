import { describe, test, expect } from "bun:test";
import { scrapeHackerNews } from "../src/scraper";

describe("HackerNews Scraper", () => {
  test("should scrape posts from Hacker News", async () => {
    const posts = await scrapeHackerNews(10);

    expect(posts).toBeDefined();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.length).toBeLessThanOrEqual(10);
  });

  test("should return posts with required fields", async () => {
    const posts = await scrapeHackerNews(5);

    expect(posts.length).toBeGreaterThan(0);

    const post = posts[0];
    expect(post).toHaveProperty("rank");
    expect(post).toHaveProperty("title");
    expect(post).toHaveProperty("url");
    expect(post).toHaveProperty("points");
    expect(post).toHaveProperty("author");
    expect(post).toHaveProperty("commentCount");
    expect(post).toHaveProperty("timestamp");

    expect(typeof post.rank).toBe("number");
    expect(typeof post.title).toBe("string");
    expect(typeof post.url).toBe("string");
    expect(typeof post.points).toBe("number");
    expect(typeof post.author).toBe("string");
    expect(typeof post.commentCount).toBe("number");
    expect(typeof post.timestamp).toBe("number");
  });

  test("should return posts in ascending rank order", async () => {
    const posts = await scrapeHackerNews(10);

    // Ranks should be positive and generally increasing
    // (HN may have gaps due to ads or pinned posts)
    for (let i = 0; i < posts.length; i++) {
      expect(posts[i].rank).toBeGreaterThan(0);

      if (i > 0) {
        expect(posts[i].rank).toBeGreaterThanOrEqual(posts[i - 1].rank);
      }
    }
  });

  test("should have valid URLs", async () => {
    const posts = await scrapeHackerNews(5);

    for (const post of posts) {
      expect(post.url).toMatch(/^https?:\/\//);
    }
  });

  test("should handle different limits", async () => {
    const smallBatch = await scrapeHackerNews(3);
    const largeBatch = await scrapeHackerNews(20);

    expect(smallBatch.length).toBeLessThanOrEqual(3);
    expect(largeBatch.length).toBeLessThanOrEqual(20);
    expect(largeBatch.length).toBeGreaterThan(smallBatch.length);
  });

  test("should have recent timestamps", async () => {
    const posts = await scrapeHackerNews(1);
    const post = posts[0];

    const now = Date.now();
    const fiveSecondsAgo = now - 5000;

    expect(post.timestamp).toBeGreaterThan(fiveSecondsAgo);
    expect(post.timestamp).toBeLessThanOrEqual(now);
  });

  test("should have non-empty titles", async () => {
    const posts = await scrapeHackerNews(10);

    for (const post of posts) {
      expect(post.title.length).toBeGreaterThan(0);
    }
  });

  test("should have valid author names", async () => {
    const posts = await scrapeHackerNews(5);

    for (const post of posts) {
      expect(post.author.length).toBeGreaterThan(0);
      expect(post.author).not.toBe("unknown");
    }
  });
});
