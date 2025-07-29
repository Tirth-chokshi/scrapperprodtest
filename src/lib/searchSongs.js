import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GENIUS_API_KEY =
  "uZfTdXIdC3FE9sMik7Trns1h90omQBo8sC09Vg9ukaCN_V7v6zBaa-WkejhHpSjc";
const searchUrl = "https://api.genius.com/search?q=";

export async function searchSongs(query) {
  if (!query || query.trim() === "") {
    return [];
  }

  try {
    const reqUrl = `${searchUrl}${encodeURIComponent(query)}`;
    const headers = {
      Authorization: `Bearer ${GENIUS_API_KEY}`,
    };

    const { data } = await axios.get(reqUrl, { headers });

    if (!data.response.hits || data.response.hits.length === 0) {
      return [];
    }

    const results = data.response.hits.map((hit) => {
      const { full_title, song_art_image_url, id, url, artist_names, title } =
        hit.result;
      return {
        id,
        title: full_title,
        songTitle: title,
        artist: artist_names,
        albumArt: song_art_image_url,
        url,
      };
    });

    return results;
  } catch (error) {
    console.error("Error searching songs:", error);
    throw new Error("Failed to search songs");
  }
}
