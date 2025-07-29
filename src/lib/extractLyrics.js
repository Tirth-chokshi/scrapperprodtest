// First install: npm install cheerio
// Use cheerio/server instead of cheerio-without-node-native
// import { load } from "cheerio/server";
import { load } from "cheerio";

export default async function extractLyrics(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);

    let lyrics = $('div[class="lyrics"]').text().trim();

    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet =
            $(elem)
              .html()
              ?.replace(/<br>/g, "\n")
              ?.replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "") || "";
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }

    return lyrics.trim() || null;
  } catch (error) {
    console.error("Error extracting lyrics:", error);
    throw error;
  }
}
