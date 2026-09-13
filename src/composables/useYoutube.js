/**
 * Extracts YouTube video ID from various URL formats or returns the ID if already bare.
 * @param {string} input - YouTube URL or video ID
 * @returns {string | null} Normalized video ID or null if invalid
 */
function extractVideoId(input) {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();

  // Already a bare video ID (11 chars, alphanumeric + hyphen/underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // youtube.com/v/VIDEO_ID (legacy)
  const vMatch = trimmed.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
  if (vMatch) return vMatch[1];

  return null;
}

/**
 * Fetches YouTube video metadata via oEmbed endpoint.
 * @param {string} videoIdOrUrl - YouTube video ID or full URL
 * @returns {Promise<{ title: string, thumbnailUrl: string, embedUrl: string, sourceId: string } | null>}
 */
export async function getYoutubeOEmbedData(videoIdOrUrl) {
  const videoId = extractVideoId(videoIdOrUrl);

  if (!videoId) {
    console.warn('[useYoutube] Invalid YouTube video ID or URL:', videoIdOrUrl);
    return null;
  }

  const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;

  try {
    const response = await fetch(oEmbedUrl);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`[useYoutube] Video not found or private: ${videoId}`);
      } else {
        console.warn(`[useYoutube] oEmbed request failed (${response.status}): ${videoId}`);
      }
      return null;
    }

    const data = await response.json();

    // oEmbed returns: title, author_name, author_url, type, height, width, version, provider_name, provider_url, thumbnail_url, thumbnail_width, thumbnail_height
    return {
      title: data.title || 'Untitled',
      thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      sourceId: videoId
    };
  } catch (error) {
    console.warn(`[useYoutube] Failed to fetch oEmbed data for ${videoId}:`, error.message);
    return null;
  }
}

/**
 * Creates a complete YouTube content item by enriching oEmbed data with manual fields.
 * @param {string} videoIdOrUrl - YouTube video ID or full URL
 * @param {Object} manualFields - Fields not available from oEmbed
 * @param {string[]} manualFields.genre - Required: array of genre IDs
 * @param {number} manualFields.releaseYear - Required: year of release
 * @param {number} manualFields.duration - Required: duration in seconds
 * @param {string} [manualFields.description] - Optional: description/synopsis
 * @param {number} [manualFields.rating] - Optional: 0-10 rating
 * @param {string} [manualFields.language] - Optional: language code
 * @param {string[]} [manualFields.subtitles] - Optional: subtitle languages
 * @param {boolean} [manualFields.isSeries] - Optional: is TV series
 * @param {number} [manualFields.seasonCount] - Optional: season count
 * @param {number} [manualFields.episodeCount] - Optional: episode count
 * @param {string} [manualFields.channelName] - Optional: channel name
 * @returns {Promise<import('../models/content.js').ContentItem | null>} Complete content item or null if oEmbed failed
 */
export async function createYoutubeContentItem(videoIdOrUrl, manualFields) {
  const oEmbedData = await getYoutubeOEmbedData(videoIdOrUrl);

  if (!oEmbedData) return null;

  const { createYouTubeContent } = await import('../models/content.js');

  return createYouTubeContent({
    id: oEmbedData.sourceId,
    title: oEmbedData.title,
    description: manualFields.description || `Watch "${oEmbedData.title}" on YouTube`,
    thumbnailUrl: oEmbedData.thumbnailUrl,
    genre: manualFields.genre,
    releaseYear: manualFields.releaseYear,
    duration: manualFields.duration,
    sourceId: oEmbedData.sourceId,
    embedUrl: oEmbedData.embedUrl,
    channelName: manualFields.channelName,
    rating: manualFields.rating,
    language: manualFields.language || 'en',
    subtitles: manualFields.subtitles || [],
    isSeries: manualFields.isSeries || false,
    seasonCount: manualFields.seasonCount,
    episodeCount: manualFields.episodeCount
  });
}