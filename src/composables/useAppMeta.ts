/**
 * Small composable that describes the app brand.
 * Imported in App.vue via the `@` alias to demonstrate path resolution.
 */
export function useAppMeta() {
  const title = 'Flickzy'
  const tagline = 'Your premium movie & trailer discovery app'

  return { title, tagline }
}
