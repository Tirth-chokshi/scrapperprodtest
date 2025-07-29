import extractLyrics from "@/lib/extractLyrics";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    if (!url.includes("genius.com")) {
      return Response.json(
        { error: "Only Genius URLs are supported" },
        { status: 400 }
      );
    }

    console.log("Attempting to extract lyrics from:", url);

    // Test if we can reach the URL at all
    try {
      const testResponse = await fetch(url, {
        method: "HEAD",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      console.log("URL accessibility test - Status:", testResponse.status);
    } catch (testError) {
      console.log("URL accessibility test failed:", testError.message);
    }

    const lyrics = await extractLyrics(url);

    if (!lyrics) {
      console.log("No lyrics found for URL:", url);
      return Response.json({ error: "Lyrics not found" }, { status: 404 });
    }

    console.log("Successfully extracted lyrics, length:", lyrics.length);
    return Response.json({ lyrics });
  } catch (error) {
    console.error("Lyrics API error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Return more specific error messages
    if (error.message.includes("fetch")) {
      return Response.json(
        { error: "Failed to fetch lyrics page" },
        { status: 502 }
      );
    }

    if (error.message.includes("HTTP error")) {
      return Response.json(
        { error: "Lyrics page not accessible" },
        { status: 502 }
      );
    }

    return Response.json(
      { error: "Failed to extract lyrics" },
      { status: 500 }
    );
  }
}
