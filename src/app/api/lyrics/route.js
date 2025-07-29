import extractLyrics from "@/lib/extractLyrics";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    
    if (!url.includes("genius.com")) {
      return Response.json(
        { error: "Only Genius URLs are supported" },
        { status: 400 }
      );
    }

    console.log("Attempting to extract lyrics from:", url);

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
