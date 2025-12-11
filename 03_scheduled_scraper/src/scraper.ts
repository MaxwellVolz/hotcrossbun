export interface HNPost {
  rank: number;
  title: string;
  url: string;
  points: number;
  author: string;
  commentCount: number;
  timestamp: number;
}

export async function scrapeHackerNews(limit: number = 30): Promise<HNPost[]> {
  console.log(`📡 Fetching Hacker News front page...`);

  const response = await fetch("https://news.ycombinator.com/");

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const posts: HNPost[] = [];

  // Split by "athing submission" to get each post
  const postBlocks = html.split('<tr class="athing submission"');

  for (let i = 1; i < postBlocks.length && posts.length < limit; i++) {
    const block = postBlocks[i];

    // Extract rank
    const rankMatch = block.match(/<span class="rank">(\d+)\.<\/span>/);
    if (!rankMatch) continue;
    const rank = parseInt(rankMatch[1]);

    // Extract title and URL
    const titleMatch = block.match(/<span class="titleline"><a href="([^"]+)">([^<]+)<\/a>/);
    if (!titleMatch) continue;
    let url = titleMatch[1];
    const title = titleMatch[2];

    // Make URL absolute if it's relative
    if (!url.startsWith("http")) {
      url = `https://news.ycombinator.com/${url}`;
    }

    // Extract points
    const pointsMatch = block.match(/<span class="score"[^>]*>(\d+) points<\/span>/);
    const points = pointsMatch ? parseInt(pointsMatch[1]) : 0;

    // Extract author
    const authorMatch = block.match(/<a href="user\?id=([^"]+)" class="hnuser">/);
    const author = authorMatch ? authorMatch[1] : "unknown";

    // Extract comment count
    const commentsMatch = block.match(/<a href="item\?id=\d+">(\d+)&nbsp;comments?<\/a>/);
    const commentCount = commentsMatch ? parseInt(commentsMatch[1]) : 0;

    posts.push({
      rank,
      title,
      url,
      points,
      author,
      commentCount,
      timestamp: Date.now(),
    });
  }

  console.log(`✅ Scraped ${posts.length} posts`);
  return posts;
}

// Run if executed directly
if (import.meta.main) {
  try {
    const posts = await scrapeHackerNews(30);
    console.log("\n📊 Top 30 Hacker News Posts:\n");

    posts.forEach((post) => {
      console.log(`${post.rank}. ${post.title}`);
      console.log(`   ${post.url}`);
      console.log(`   ${post.points} points | by ${post.author} | ${post.commentCount} comments\n`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}
