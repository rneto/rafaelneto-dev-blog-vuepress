// Tag pages per language: /tag/<tag>/ lists Spanish posts and /en/tag/<tag>/ English ones
// (see `frontmatters` in config.js and `esTags`/`enTags` in theme/index.js).
export const tagPath = (tag, pagePath) =>
  `${(pagePath || '').startsWith('/en/') ? '/en/tag/' : '/tag/'}${tag}/`
