/**
 * Local theme: @vuepress/theme-blog plus the reading time of each post, a light/dark switch and a
 * language-aware header menu.
 *
 * Only the files in this folder override the parent theme (see
 * https://v1.vuepress.vuejs.org/theme/inheritance.html):
 * - components/PostMeta.vue: post header (date, reading time, tags).
 * - components/PostList.vue: post lists (blog, tags, pagination), used by layouts/Layout.vue.
 * - components/PostTag.vue: tag chips under the post title, linking to the tag page of its language.
 */
const { switcherLink } = require('../plugins/shared')

const WORDS_PER_MINUTE = 200

// Prose only: code blocks are skimmed, not read word by word.
function readingTime (content) {
  const prose = (content || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
  const words = (prose.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) || []).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

module.exports = {
  extend: '@vuepress/theme-blog',

  extendPageData ($page) {
    if ($page.frontmatter && $page.frontmatter.date) {
      $page.readingTime = readingTime($page._strippedContent)
    }
    // Tags per language: the blog plugin builds /tag/ from `esTags` and /en/tag/ from `enTags`
    // (`frontmatters` in config.js), so each tag page lists posts of one language only
    const { tags } = $page.frontmatter
    if (tags && $page.frontmatter.date) {
      const english = ($page.regularPath || '').startsWith('/_en/')
      $page.frontmatter[english ? 'enTags' : 'esTags'] = [].concat(tags)
    }
    // Target of the language switcher line, for the header's language link (components/localeNav.js)
    const translation = switcherLink($page)
    if (translation) {
      $page.translationPath = translation
    }
  }
}
