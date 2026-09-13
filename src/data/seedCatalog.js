/**
 * Flickzy — curated seed catalog.
 *
 * A small, offline-friendly starting collection of well-known public-domain
 * films (Archive.org) plus a couple of YouTube trailers. This gives the app a
 * browsable catalog on first run, before any live Archive.org search results
 * have been fetched and cached.
 *
 * Items follow the unified content-model shape from `src/models/content.js`
 * (`genre` holds genre IDs from `src/data/genres.js`) so they play nicely with
 * the catalog store's genre filtering and search matching.
 */

/**
 * @typedef {Object} SeedCatalogItem
 * @property {string} id             Unique id, e.g. `archive:identifier`
 * @property {'archive'|'youtube'} source  Content source
 * @property {string} sourceId       Source-specific id / identifier
 * @property {string} title          Display title
 * @property {string} description    Short synopsis
 * @property {string[]} genre        Genre IDs (from genres.js)
 * @property {number} releaseYear    Year of release
 * @property {number} duration       Duration in seconds
 * @property {string} fileUrl        Direct playable URL (archive) — optional for youtube
 * @property {string} embedUrl       YouTube embed URL (youtube) — optional for archive
 * @property {string} thumbnailUrl   Poster / thumbnail URL
 * @property {number} downloads      Popularity proxy (archive items)
 * @property {number} rating         0–10 score
 * @property {string} creator        Creator / director
 */

/** @type {SeedCatalogItem[]} */
export const seedCatalog = [
  {
    id: 'archive:man_with_the_movie_camera',
    source: 'archive',
    sourceId: 'man_with_the_movie_camera',
    title: 'Man with a Movie Camera',
    description:
      "Dziga Vertov's landmark 1929 Soviet silent documentary showcasing a day in the life of a city through pioneering camera tricks and editing.",
    genre: ['documentary', 'classic'],
    releaseYear: 1929,
    duration: 4080,
    fileUrl:
      'https://archive.org/download/man_with_the_movie_camera/man_with_the_movie_camera.mp4',
    thumbnailUrl: 'https://archive.org/services/img/man_with_the_movie_camera',
    downloads: 1284000,
    rating: 8.3,
    creator: 'Dziga Vertov',
  },
  {
    id: 'archive:night_of_the_living_dead_1968',
    source: 'archive',
    sourceId: 'night_of_the_living_dead_1968',
    title: 'Night of the Living Dead',
    description:
      "George A. Romero's low-budget horror masterwork that redefined the zombie genre and left an enduring mark on cinema.",
    genre: ['horror', 'thriller', 'classic'],
    releaseYear: 1968,
    duration: 5760,
    fileUrl:
      'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968.mp4',
    thumbnailUrl: 'https://archive.org/services/img/night_of_the_living_dead_1968',
    downloads: 2100000,
    rating: 7.9,
    creator: 'George A. Romero',
  },
  {
    id: 'archive:forbiddenplanet',
    source: 'archive',
    sourceId: 'forbiddenplanet',
    title: 'Forbidden Planet',
    description:
      'A 1956 sci-fi classic in which a starship crew investigates the disappearance of a colony on a mysterious planet.',
    genre: ['sci-fi', 'adventure', 'classic'],
    releaseYear: 1956,
    duration: 5880,
    fileUrl: 'https://archive.org/download/forbiddenplanet/forbiddenplanet.mp4',
    thumbnailUrl: 'https://archive.org/services/img/forbiddenplanet',
    downloads: 968000,
    rating: 7.5,
    creator: 'Fred M. Wilcox',
  },
  {
    id: 'archive:plan_9_from_outer_space',
    source: 'archive',
    sourceId: 'plan_9_from_outer_space',
    title: 'Plan 9 from Outer Space',
    description:
      "Ed Wood's famously quirky 1959 B-movie about aliens resurrecting the dead — a cult classic of unintentional comedy.",
    genre: ['sci-fi', 'comedy', 'classic'],
    releaseYear: 1959,
    duration: 4740,
    fileUrl: 'https://archive.org/download/plan_9_from_outer_space/plan_9_from_outer_space.mp4',
    thumbnailUrl: 'https://archive.org/services/img/plan_9_from_outer_space',
    downloads: 712000,
    rating: 4.1,
    creator: 'Ed Wood',
  },
  {
    id: 'archive:nosferatu',
    source: 'archive',
    sourceId: 'nosferatu',
    title: 'Nosferatu',
    description:
      "F. W. Murnau's 1922 expressionist vampire silent film, a cornerstone of early horror cinema.",
    genre: ['horror', 'classic'],
    releaseYear: 1922,
    duration: 5640,
    fileUrl: 'https://archive.org/download/nosferatu/nosferatu.mp4',
    thumbnailUrl: 'https://archive.org/services/img/nosferatu',
    downloads: 1560000,
    rating: 7.9,
    creator: 'F. W. Murnau',
  },
  {
    id: 'archive:metropolis',
    source: 'archive',
    sourceId: 'metropolis',
    title: 'Metropolis',
    description:
      "Fritz Lang's towering 1927 German expressionist science-fiction epic about a dystopian future city divided between workers and rulers.",
    genre: ['sci-fi', 'drama', 'classic'],
    releaseYear: 1927,
    duration: 9180,
    fileUrl: 'https://archive.org/download/metropolis/metropolis.mp4',
    thumbnailUrl: 'https://archive.org/services/img/metropolis',
    downloads: 1840000,
    rating: 8.3,
    creator: 'Fritz Lang',
  },
  {
    id: 'archive:the_general',
    source: 'archive',
    sourceId: 'the_general',
    title: 'The General',
    description:
      "Buster Keaton's 1926 silent comedy set during the American Civil War, widely hailed as one of the greatest films ever made.",
    genre: ['action', 'comedy', 'classic'],
    releaseYear: 1926,
    duration: 4500,
    fileUrl: 'https://archive.org/download/the_general/the_general.mp4',
    thumbnailUrl: 'https://archive.org/services/img/the_general',
    downloads: 1120000,
    rating: 8.1,
    creator: 'Buster Keaton',
  },
  {
    id: 'archive:the_great_train_robbery',
    source: 'archive',
    sourceId: 'the_great_train_robbery',
    title: 'The Great Train Robbery',
    description:
      'A 1903 American silent short that is widely regarded as a milestone in early film editing and Western storytelling.',
    genre: ['western', 'action', 'classic'],
    releaseYear: 1903,
    duration: 720,
    fileUrl: 'https://archive.org/download/the_great_train_robbery/the_great_train_robbery.mp4',
    thumbnailUrl: 'https://archive.org/services/img/the_great_train_robbery',
    downloads: 540000,
    rating: 7.2,
    creator: 'Edwin S. Porter',
  },
  {
    id: 'archive:gertie_the_dinosaur',
    source: 'archive',
    sourceId: 'gertie_the_dinosaur',
    title: 'Gertie the Dinosaur',
    description:
      "Winsor McCay's 1914 animated short featuring Gertie, a playful dinosaur — a groundbreaking early work of animation.",
    genre: ['animation', 'family', 'classic'],
    releaseYear: 1914,
    duration: 720,
    fileUrl: 'https://archive.org/download/gertie_the_dinosaur/gertie_the_dinosaur.mp4',
    thumbnailUrl: 'https://archive.org/services/img/gertie_the_dinosaur',
    downloads: 388000,
    rating: 7.0,
    creator: 'Winsor McCay',
  },
  {
    id: 'youtube:the_treasure_of_golden_isle',
    source: 'youtube',
    sourceId: 'the_treasure_of_golden_isle',
    title: 'The Treasure of Golden Isle',
    description:
      'A curated family adventure trailer exploring a swashbuckling hunt for a long-lost island treasure.',
    genre: ['adventure', 'family', 'comedy'],
    releaseYear: 2023,
    duration: 156,
    embedUrl: 'https://www.youtube.com/embed/the_treasure_of_golden_isle',
    thumbnailUrl: 'https://img.youtube.com/vi/the_treasure_of_golden_isle/maxresdefault.jpg',
    rating: 6.8,
    creator: 'Flickzy Originals',
  },
  {
    id: 'youtube:stars_above_the_valley',
    source: 'youtube',
    sourceId: 'stars_above_the_valley',
    title: 'Stars Above the Valley',
    description:
      'A moody sci-fi short-film trailer about a lone signals officer making first contact far from Earth.',
    genre: ['sci-fi', 'drama', 'mystery'],
    releaseYear: 2024,
    duration: 174,
    embedUrl: 'https://www.youtube.com/embed/stars_above_the_valley',
    thumbnailUrl: 'https://img.youtube.com/vi/stars_above_the_valley/maxresdefault.jpg',
    rating: 7.4,
    creator: 'Flickzy Originals',
  },
]