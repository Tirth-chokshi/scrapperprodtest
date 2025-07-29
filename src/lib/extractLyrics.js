// Option 1: Using native fetch instead of axios and jsdom-compatible cheerio
export default async function extractLyrics(url) {
  try {
    // Use native fetch instead of axios
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Simple regex-based extraction as fallback
    let lyrics = extractLyricsWithRegex(html);

    return lyrics || null;
  } catch (error) {
    console.error("Error extracting lyrics:", error);
    throw error;
  }
}

function extractLyricsWithRegex(html) {
  // Try multiple patterns for Genius lyrics
  const patterns = [
    // New Genius format
    /<div[^>]*class="[^"]*Lyrics__Container[^"]*"[^>]*>(.*?)<\/div>/gs,
    // Old Genius format
    /<div[^>]*class="lyrics"[^>]*>(.*?)<\/div>/gs,
  ];

  let lyrics = "";

  for (const pattern of patterns) {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        // Clean HTML tags and decode entities
        let cleaned = match
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<[^>]+>/g, "")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&nbsp;/g, " ")
          .trim();

        if (cleaned.length > 0) {
          lyrics += cleaned + "\n\n";
        }
      });
    }
  }

  return lyrics.trim() || null;
}
