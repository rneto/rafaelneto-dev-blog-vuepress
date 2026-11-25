/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

function decode (path) {
  try {
    return decodeURIComponent(path)
  } catch (e) {
    return path
  }
}

export default ({
  router, // the router instance for the app
  siteData, // site metadata
  isServer,
}) => {
  if (isServer) return

  // Old links with other letter case (/tag/angular/, /blog/My-Post/). GitHub Pages is case-sensitive
  // and serves 404.html, but the router matches routes ignoring case and would render the page without
  // its data (an empty tag list, a blank post). Load the real address instead: a full page load, since
  // switching routes while the app starts on top of 404.html leaves the page empty. Only links from
  // outside the site have the wrong case, so this only happens on the first page load.
  router.beforeEach((to, from, next) => {
    const path = decode(to.path)
    if (siteData.pages.some(page => decode(page.path) === path)) return next()
    const page = siteData.pages.find(page => decode(page.path).toLowerCase() === path.toLowerCase())
    if (page) {
      window.location.replace(page.path + window.location.search + window.location.hash)
      return next(false)
    }
    next()
  })
}
