/**
 * Generates machine-readable content for AI assistants, AI search engines and feed readers:
 *
 * - A clean Markdown copy of every post at its URL with `.md` instead of the trailing slash
 *   (e.g. /blog/my-post/ -> /blog/my-post.md).
 * - /llms.txt: an index of the site following https://llmstxt.org/.
 * - /llms-full.txt: the full text of every post in one file.
 * - /en/rss.xml: an RSS feed for the English posts (the feed plugin only handles Spanish).
 */
const fs = require('fs')
const path = require('path')
const {
  HOSTNAME, PERSON,
  isEnglish, parseDate, publishedIso, modifiedIso, summaryOf, longSummaryOf,
  counterpartPath, markdownPath, pathIndex, postsNewestFirst
} = require('./shared')

const SWITCHER_LINE = /^\s*(Español \| \[English\]\([^)]*\)|\[Español\]\([^)]*\) \| English)\s*$/gm
const FEED_SIZE = 20

const day = iso => (iso || '').slice(0, 10)

function cleanBody (page) {
  return (page._strippedContent || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/^\s*<social-share[^>]*\/>\s*$/gm, '')
    .replace(SWITCHER_LINE, '')
    .replace(/^#\s+.*$/m, '') // the H1, rendered again in the header
    .replace(/\]\((\/[^)\s]*)\)/g, `](${HOSTNAME}$1)`) // absolute internal links and images
    .replace(/\n-{3,}\s*$/, '') // separator left before the removed footer share buttons
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function postMarkdown (page, translation) {
  const { frontmatter } = page
  const published = day(publishedIso(page))
  const updated = day(modifiedIso(page))
  const lines = [
    `# ${page.title}`,
    '',
    `> ${longSummaryOf(page)}`,
    '',
    `- URL: ${HOSTNAME}${page.path}`,
    `- Author: ${PERSON.name} (${PERSON.url})`,
    `- Published: ${published}`
  ]
  if (updated && updated !== published) lines.push(`- Updated: ${updated}`)
  lines.push(`- Language: ${isEnglish(page.path) ? 'English (en-US)' : 'Spanish (es-ES)'}`)
  if ((frontmatter.tags || []).length) lines.push(`- Tags: ${frontmatter.tags.join(', ')}`)
  if (translation) {
    lines.push(`- ${isEnglish(page.path) ? 'Spanish' : 'English'} version: ${HOSTNAME}${translation}`)
  }
  return `${lines.join('\n')}\n\n${cleanBody(page)}\n`
}

function llmsIndex (siteConfig, spanish, english) {
  const item = page => `- [${page.title}](${HOSTNAME}${markdownPath(page.path)}): ${longSummaryOf(page)} (${day(publishedIso(page))})`
  return [
    `# ${siteConfig.title}`,
    '',
    `> Blog técnico de ${PERSON.name}, programador Full Stack: arquitectura de software, .NET, ASP.NET Core, Angular, TypeScript, JavaScript, HTML y CSS. Technical blog by ${PERSON.name}, Full Stack developer, about software architecture, .NET, ASP.NET Core, Angular, TypeScript, JavaScript, HTML and CSS.`,
    '',
    'Posts are written in Spanish first and many have an English translation. Every post is available as clean Markdown: replace the trailing slash of its URL with `.md`. Each Markdown copy lists its author, dates, tags and the URL of its translation.',
    '',
    `The full text of every post is in [llms-full.txt](${HOSTNAME}/llms-full.txt).`,
    '',
    '## Blog posts (English)',
    '',
    ...english.map(item),
    '',
    '## Artículos del blog (Español)',
    '',
    ...spanish.map(item),
    '',
    '## Optional',
    '',
    `- [About me](${HOSTNAME}/en/): ${PERSON.name}, ${PERSON.jobTitle}. Profiles: ${PERSON.sameAs.join(', ')}`,
    `- [Sobre mí](${HOSTNAME}/): the same page in Spanish`,
    `- [RSS feed (Español)](${HOSTNAME}/rss.xml)`,
    `- [RSS feed (English)](${HOSTNAME}/en/rss.xml)`,
    `- [Sitemap](${HOSTNAME}/sitemap.xml)`,
    ''
  ].join('\n')
}

function llmsFull (siteConfig, posts, markdownByPath) {
  const header = [
    `# ${siteConfig.title}: full text of all posts`,
    '',
    `> Every post of ${HOSTNAME} by ${PERSON.name}, newest first. Index: ${HOSTNAME}/llms.txt`,
    ''
  ].join('\n')
  return `${header}\n${posts.map(page => markdownByPath.get(page.path)).join('\n---\n\n')}`
}

const escapeXml = value => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

function englishFeed (siteConfig, english) {
  const locale = (siteConfig.locales && siteConfig.locales['/en/']) || {}
  const items = english.slice(0, FEED_SIZE)
  const lastBuild = items.length ? parseDate(modifiedIso(items[0])) : new Date()
  const itemXml = page => {
    const url = `${HOSTNAME}${page.path}`
    const categories = (page.frontmatter.tags || []).map(tag => `<category>${escapeXml(tag)}</category>`).join('')
    return [
      '<item>',
      `<title>${escapeXml(page.title)}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<pubDate>${parseDate(page.frontmatter.date).toUTCString()}</pubDate>`,
      `<description>${escapeXml(longSummaryOf(page))}</description>`,
      categories,
      '</item>'
    ].join('')
  }
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(locale.title || siteConfig.title)}</title>`,
    `<link>${HOSTNAME}/en/blog/</link>`,
    `<description>${escapeXml(locale.description || siteConfig.description)}</description>`,
    '<language>en-US</language>',
    `<lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>`,
    `<atom:link href="${HOSTNAME}/en/rss.xml" rel="self" type="application/rss+xml"/>`,
    ...items.map(itemXml),
    '</channel>',
    '</rss>',
    ''
  ].join('\n')
}

function write (outDir, relativePath, content) {
  const file = path.join(outDir, relativePath)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

module.exports = (options, context) => ({
  name: 'ai-content',

  async generated () {
    const { outDir, siteConfig } = context
    const pathsByLowerCase = pathIndex(context.pages)
    const posts = postsNewestFirst(context.pages)
    const spanish = posts.filter(page => !isEnglish(page.path))
    const english = posts.filter(page => isEnglish(page.path))

    const markdownByPath = new Map()
    for (const page of posts) {
      const markdown = postMarkdown(page, counterpartPath(page, pathsByLowerCase))
      markdownByPath.set(page.path, markdown)
      write(outDir, markdownPath(page.path), markdown)
    }

    write(outDir, 'llms.txt', llmsIndex(siteConfig, spanish, english))
    write(outDir, 'llms-full.txt', llmsFull(siteConfig, posts, markdownByPath))
    write(outDir, 'en/rss.xml', englishFeed(siteConfig, english))
  }
})
