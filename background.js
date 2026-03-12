// YouTube Focus Mode — Background Service Worker
// Handles YouTube search to avoid CORS in content scripts

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "searchYouTube") {
    fetchYouTubeSearch(request.query, request.maxResults || 8)
      .then((videos) => sendResponse({ success: true, videos }))
      .catch((err) => sendResponse({ success: false, error: err.message, videos: [] }));
    return true;
  }
});

async function fetchYouTubeSearch(query, maxResults) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const resp = await fetch(url);
    const html = await resp.text();

    const match = html.match(/var\s+ytInitialData\s*=\s*(\{.+?\});\s*<\/script>/s);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const contents =
      data?.contents?.twoColumnSearchResultsRenderer?.primaryContents
        ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

    const videos = [];
    for (const item of contents) {
      const vid = item.videoRenderer;
      if (!vid || !vid.videoId) continue;

      // Skip shorts (under 60 seconds) and live streams
      const durText = vid.lengthText?.simpleText || "";
      if (!durText || durText === "LIVE") continue;

      videos.push({
        videoId: vid.videoId,
        title: vid.title?.runs?.map((r) => r.text).join("") || "",
        channel: vid.ownerText?.runs?.map((r) => r.text).join("") || "",
        views: vid.viewCountText?.simpleText || vid.viewCountText?.runs?.map((r) => r.text).join("") || "",
        duration: durText,
        thumbnail: `https://i.ytimg.com/vi/${vid.videoId}/mqdefault.jpg`,
      });

      if (videos.length >= maxResults) break;
    }

    return videos;
  } catch (e) {
    console.error("[YT Focus BG] Search failed:", e);
    return [];
  }
}
