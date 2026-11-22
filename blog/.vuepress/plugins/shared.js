/**
 * Helpers shared by the local SEO and AI plugins.
 */
const path = require('path')

const HOSTNAME = 'https://rafaelneto.dev'
const DEFAULT_IMAGE = `${HOSTNAME}/images/logo.png`

// Public profile, taken from the "Sobre mí" page (blog/README.md).
const PERSON = {
  '@type': 'Person',
  '@id': `${HOSTNAME}/#person`,
  name: 'Rafael Neto',
  url: `${HOSTNAME}/`,
  image: DEFAULT_IMAGE,
  jobTitle: 'Full Stack Developer',
  knowsAbout: ['Software architecture', '.NET', 'TypeScript', 'JavaScript', 'Angular', 'HTML', 'CSS'],
  sameAs: [
    'https://www.linkedin.com/in/rrneto',
    'https://github.com/rneto',
    'https://x.com/rneto',
    'https://app.pluralsight.com/profile/rneto',
    'https://www.hackerrank.com/rneto',
    'https://stackblitz.com/@rneto'
  ]
}

const POST_PATH = /^\/(en\/)?blog\/(?!page\/)[^/]+\/$/
const ENGLISH_LINK = /\[English\]\((\/en\/blog\/[^)\s]+)\)/
const SPANISH_LINK = /\[Español\]\((\/blog\/[^)\s]+)\)/

const isEnglish = pagePath => pagePath.startsWith('/en/')
const isPost = page => Boolean(page.frontmatter && page.frontmatter.date) && POST_PATH.test(page.path || '')

function parseDate (value) {
  if (!value) return undefined
  if (value instanceof Date) return isNaN(value) ? undefined : value
  const short = String(value).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  const date = short ? new Date(Date.UTC(+short[1], short[2] - 1, +short[3])) : new Date(value)
  return isNaN(date) ? undefined : date
}

function toIso (value) {
  const date = parseDate(value)
  return date && date.toISOString()
}

function modifiedTime (frontmatter) {
  const meta = (frontmatter.meta || []).find(item => item.property === 'article:modified_time')
  return meta ? meta.content : undefined
}

const publishedIso = page => toIso(page.frontmatter.date)
const modifiedIso = page => toIso(modifiedTime(page.frontmatter) || page.frontmatter.date)
// Short text for search results and structured data: `description` if the post has one.
const summaryOf = page => page.frontmatter.description || page.frontmatter.summary || ''
// Longer text for AI indexes and Markdown copies: the post-list `summary` first.
const longSummaryOf = page => page.frontmatter.summary || page.frontmatter.description || ''

// Real path of the translated post, or undefined when the switcher is missing,
// commented out, or points to a page that does not exist.
function counterpartPath (page, pathsByLowerCase) {
  const content = (page._content || '').replace(/<!--[\s\S]*?-->/g, '')
  const match = isEnglish(page.path) ? content.match(SPANISH_LINK) : content.match(ENGLISH_LINK)
  return match ? pathsByLowerCase.get(match[1].toLowerCase()) : undefined
}

const markdownPath = pagePath => pagePath.replace(/\/$/, '.md')

function htmlFile (outDir, pagePath) {
  const decoded = decodeURIComponent(pagePath)
  return decoded.endsWith('/')
    ? path.join(outDir, decoded, 'index.html')
    : path.join(outDir, decoded)
}

const pathIndex = pages => new Map(pages.filter(page => page.path).map(page => [page.path.toLowerCase(), page.path]))

const postsNewestFirst = pages => pages
  .filter(isPost)
  .sort((a, b) => parseDate(b.frontmatter.date) - parseDate(a.frontmatter.date))

module.exports = {
  HOSTNAME,
  DEFAULT_IMAGE,
  PERSON,
  isEnglish,
  isPost,
  parseDate,
  toIso,
  modifiedTime,
  publishedIso,
  modifiedIso,
  summaryOf,
  longSummaryOf,
  counterpartPath,
  markdownPath,
  htmlFile,
  pathIndex,
  postsNewestFirst
}
