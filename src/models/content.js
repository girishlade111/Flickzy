/**
 * @typedef {Object} ContentItem
 * @property {string} id - Unique identifier for this content item (UUID or source-specific ID)
 * @property {string} title - Display title of the movie/show
 * @property {string} description - Synopsis or description text
 * @property {string} thumbnailUrl - URL to poster/thumbnail image
 * @property {string[]} genre - Array of genre IDs (referencing genres.js)
 * @property {number} releaseYear - Year of release (e.g., 2024)
 * @property {number} duration - Duration in seconds (for movies) or per-episode average (for series)
 * @property {'youtube' | 'archive'} source - Content source discriminator; determines playback strategy
 * @property {string} sourceId - Original ID from the source platform (YouTube video ID or Archive.org identifier)
 * @property {string} [embedUrl] - YouTube embed URL (https://www.youtube.com/embed/{videoId}) - REQUIRED when source === 'youtube'
 * @property {string} [fileUrl] - Direct media file URL from Archive.org - REQUIRED when source === 'archive'
 * @property {string} [channelName] - YouTube channel name (for YouTube content)
 * @property {string} [creator] - Archive.org creator/uploader (for Archive content)
 * @property {number} [viewCount] - View count from source platform
 * @property {number} [rating] - Average rating (0-10 scale)
 * @property {string} [language] - Primary language code (e.g., 'en', 'es')
 * @property {string[]} [subtitles] - Available subtitle language codes
 * @property {boolean} [isSeries] - Whether this is a TV series vs movie
 * @property {number} [seasonCount] - Number of seasons (if series)
 * @property {number} [episodeCount] - Total episode count (if series)
 * @property {Date} [addedAt] - When this item was added to catalog
 */

/**
 * Validates that an object matches the required ContentItem shape.
 * @param {unknown} item - Item to validate
 * @returns {item is ContentItem} True if valid
 */
export function isValidContentItem(item) {
  if (!item || typeof item !== 'object') return false;

  const requiredFields = [
    'id',
    'title',
    'description',
    'thumbnailUrl',
    'genre',
    'releaseYear',
    'duration',
    'source',
    'sourceId'
  ];

  for (const field of requiredFields) {
    if (!(field in item) || item[field] === undefined || item[field] === null) {
      return false;
    }
  }

  if (typeof item.id !== 'string' || item.id.trim() === '') return false;
  if (typeof item.title !== 'string' || item.title.trim() === '') return false;
  if (typeof item.description !== 'string') return false;
  if (typeof item.thumbnailUrl !== 'string' || item.thumbnailUrl.trim() === '') return false;
  if (!Array.isArray(item.genre) || item.genre.length === 0) return false;
  if (!Number.isInteger(item.releaseYear) || item.releaseYear < 1888 || item.releaseYear > new Date().getFullYear() + 2) return false;
  if (!Number.isInteger(item.duration) || item.duration <= 0) return false;
  if (item.source !== 'youtube' && item.source !== 'archive') return false;
  if (typeof item.sourceId !== 'string' || item.sourceId.trim() === '') return false;

  if (item.source === 'youtube') {
    if (!item.embedUrl || typeof item.embedUrl !== 'string' || !item.embedUrl.includes('youtube.com/embed/')) {
      return false;
    }
  } else if (item.source === 'archive') {
    if (!item.fileUrl || typeof item.fileUrl !== 'string' || item.fileUrl.trim() === '') {
      return false;
    }
  }

  if (item.rating !== undefined && (typeof item.rating !== 'number' || item.rating < 0 || item.rating > 10)) {
    return false;
  }

  return true;
}

/**
 * Creates a ContentItem for YouTube content.
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.thumbnailUrl
 * @param {string[]} params.genre
 * @param {number} params.releaseYear
 * @param {number} params.duration
 * @param {string} params.sourceId - YouTube video ID
 * @param {string} params.embedUrl - Full YouTube embed URL
 * @param {string} [params.channelName]
 * @param {number} [params.viewCount]
 * @param {number} [params.rating]
 * @param {string} [params.language]
 * @param {string[]} [params.subtitles]
 * @param {boolean} [params.isSeries]
 * @param {number} [params.seasonCount]
 * @param {number} [params.episodeCount]
 * @returns {ContentItem}
 */
export function createYouTubeContent(params) {
  const item = {
    id: params.id,
    title: params.title,
    description: params.description,
    thumbnailUrl: params.thumbnailUrl,
    genre: params.genre,
    releaseYear: params.releaseYear,
    duration: params.duration,
    source: 'youtube' /** @type {const} */,
    sourceId: params.sourceId,
    embedUrl: params.embedUrl,
    channelName: params.channelName,
    viewCount: params.viewCount,
    rating: params.rating,
    language: params.language || 'en',
    subtitles: params.subtitles || [],
    isSeries: params.isSeries || false,
    seasonCount: params.seasonCount,
    episodeCount: params.episodeCount,
    addedAt: new Date()
  };

  if (!isValidContentItem(item)) {
    throw new Error('Invalid YouTube content item');
  }

  return item;
}

/**
 * Creates a ContentItem for Archive.org content.
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.thumbnailUrl
 * @param {string[]} params.genre
 * @param {number} params.releaseYear
 * @param {number} params.duration
 * @param {string} params.sourceId - Archive.org identifier
 * @param {string} params.fileUrl - Direct media file URL
 * @param {string} [params.creator]
 * @param {number} [params.viewCount]
 * @param {number} [params.rating]
 * @param {string} [params.language]
 * @param {string[]} [params.subtitles]
 * @param {boolean} [params.isSeries]
 * @param {number} [params.seasonCount]
 * @param {number} [params.episodeCount]
 * @returns {ContentItem}
 */
export function createArchiveContent(params) {
  const item = {
    id: params.id,
    title: params.title,
    description: params.description,
    thumbnailUrl: params.thumbnailUrl,
    genre: params.genre,
    releaseYear: params.releaseYear,
    duration: params.duration,
    source: 'archive' /** @type {const} */,
    sourceId: params.sourceId,
    fileUrl: params.fileUrl,
    creator: params.creator,
    viewCount: params.viewCount,
    rating: params.rating,
    language: params.language || 'en',
    subtitles: params.subtitles || [],
    isSeries: params.isSeries || false,
    seasonCount: params.seasonCount,
    episodeCount: params.episodeCount,
    addedAt: new Date()
  };

  if (!isValidContentItem(item)) {
    throw new Error('Invalid Archive.org content item');
  }

  return item;
}