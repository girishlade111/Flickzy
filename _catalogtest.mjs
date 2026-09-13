// Throwaway sanity check for catalog store filter/trending logic.
// Replicates the pure helpers from src/stores/catalog.js against the real
// seed data + genre map to confirm the acceptance criteria behaviour.
import { seedCatalog } from './src/data/seedCatalog.js'
import { genreMap } from './src/data/genres.js'

function itemGenres(item) {
  const values = []
  if (Array.isArray(item.genre)) values.push(...item.genre)
  if (Array.isArray(item.genres)) values.push(...item.genres)
  return values.map(String).map((v) => v.toLowerCase()).filter(Boolean)
}

function matchesGenre(item, genreId) {
  if (!genreId) return true
  const id = String(genreId).toLowerCase()
  const label = genreMap[id] ? genreMap[id].toLowerCase() : ''
  const targets = [id, label].filter(Boolean)
  return itemGenres(item).some((value) => {
    if (value === id) return true
    if (label && value === label) return true
    return targets.some((target) => value.includes(target))
  })
}

function matchesQuery(item, query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return true
  const haystack = [
    item.title,
    item.description,
    item.creator,
    item.creators,
    item.genre,
    item.genres,
    item.sourceId,
    item.identifier,
  ]
    .flat()
    .filter((v) => v != null)
    .map((v) => String(v).toLowerCase())
    .join(' ')
  return haystack.includes(q)
}

function popularityScore(item) {
  const d = Number(item.downloads)
  const downloads = Number.isFinite(d) ? d : 0
  if (downloads > 0) return downloads
  const r = Number(item.rating)
  return Number.isFinite(r) ? r : 0
}

const filtered = (items, query, genre) =>
  items.filter((it) => matchesGenre(it, genre) && matchesQuery(it, query))

const assert = (label, actual, expected) => {
  const ok = actual === expected
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: got=${actual} expected=${expected}`)
  if (!ok) process.exitCode = 1
}

assert('total seed items', seedCatalog.length, 11)
assert('genre=horror', filtered(seedCatalog, '', 'horror').length, 2)
assert('genre=sci-fi', filtered(seedCatalog, '', 'sci-fi').length, 4)
assert('genre=classic', filtered(seedCatalog, '', 'classic').length, 9)
assert('query=metropolis', filtered(seedCatalog, 'metropolis', null).length, 1)
assert('query=planet', filtered(seedCatalog, 'planet', null).length, 1)
assert('query+genre (sci-fi & metropolis)', filtered(seedCatalog, 'metropolis', 'sci-fi').length, 1)
assert('query+genre (classic & metropolis)', filtered(seedCatalog, 'metropolis', 'classic').length, 1)
assert('empty query returns all', filtered(seedCatalog, '', null).length, 11)

const trending = seedCatalog
  .slice()
  .sort((a, b) => popularityScore(b) - popularityScore(a))
  .slice(0, 8)
assert('trending top is Night of the Living Dead', trending[0].id, 'archive:night_of_the_living_dead_1968')
assert('trending length', trending.length, 8)

console.log('--- top-8 trending ---')
for (const t of trending) console.log(t.id, t.downloads, t.rating)