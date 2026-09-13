/**
 * @typedef {Object} Genre
 * @property {string} id - Unique genre identifier (lowercase, hyphenated)
 * @property {string} label - Human-readable genre name
 */

/**
 * Static list of genre categories for the catalog.
 * @type {Genre[]}
 */
export const genres = [
  { id: 'action', label: 'Action' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'animation', label: 'Animation' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'crime', label: 'Crime' },
  { id: 'documentary', label: 'Documentary' },
  { id: 'drama', label: 'Drama' },
  { id: 'family', label: 'Family' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'history', label: 'History' },
  { id: 'horror', label: 'Horror' },
  { id: 'music', label: 'Music' },
  { id: 'mystery', label: 'Mystery' },
  { id: 'romance', label: 'Romance' },
  { id: 'sci-fi', label: 'Sci-Fi' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'war', label: 'War' },
  { id: 'western', label: 'Western' },
  { id: 'classic', label: 'Classic' }
];

/**
 * Map of genre ID to label for quick lookups.
 * @type {Record<string, string>}
 */
export const genreMap = Object.fromEntries(genres.map(g => [g.id, g.label]));

/**
 * Get genre label by ID.
 * @param {string} id
 * @returns {string | undefined}
 */
export function getGenreLabel(id) {
  return genreMap[id];
}

/**
 * Get all genre labels for an array of IDs.
 * @param {string[]} ids
 * @returns {string[]}
 */
export function getGenreLabels(ids) {
  return ids.map(id => genreMap[id]).filter(Boolean);
}

/**
 * Validate that all genre IDs exist in the catalog.
 * @param {string[]} ids
 * @returns {boolean}
 */
export function validateGenreIds(ids) {
  return ids.every(id => id in genreMap);
}