/**
 * SEO helpers that VuePress 1 and its plugins do not cover:
 *
 * - <link rel="canonical"> for every page that does not set `canonicalUrl` in its frontmatter.
 * - <link rel="alternate" hreflang> between Spanish and English versions of the same post,
 *   detected from the language switcher line of each post
 *   (`Español | [English](/en/blog/...)` or `[Español](/blog/...) | English`).
 * - <link rel="alternate" type="text/markdown"> to the Markdown copy of each post (see ai-content.js).
 * - <link rel="alternate" type="application/rss+xml"> to the English feed on English pages.
 * - JSON-LD: `BlogPosting` for posts, `WebSite` + `Person` for the home and blog index pages.
 * - `lastUpdated` from the frontmatter dates, so the sitemap gets a real <lastmod>.
 * - Pagination pages (`/page/N/`) excluded from the sitemap.
 */
const fs = require('fs')
const matter = require('gray-matter')
const {
  HOSTNAME, DEFAULT_IMAGE, PERSON,
  isEnglish, isPost, modifiedIso, publishedIso, summaryOf,
  counterpartPath, markdownPath, htmlFile, pathIndex
} = require('./shared')

const PAGINATION_PATH = /\/page\/\d+\/$/
const INDEX_PAGES = ['/', '/blog/', '/en/blog/']

function alternateLinks (page, pathsByLowerCase) {
  let spanish
  let english
  if (page.path === '/blog/' || page.path === '/en/blog/') {
    spanish = '/blog/'
    english = '/en/blog/'
  } else if (isPost(page)) {
    const other = counterpartPath(page, pathsByLowerCase)
    if (!other) return []
    spanish = isEnglish(page.path) ? other : page.path
    english = isEnglish(page.path) ? page.path : other
  } else {
    return []
  }
  return [
    `<link rel="alternate" hreflang="es" href="${HOSTNAME}${spanish}">`,
    `<link rel="alternate" hreflang="en" href="${HOSTNAME}${english}">`,
    `<link rel="alternate" hreflang="x-default" href="${HOSTNAME}${spanish}">`
  ]
}

function jsonLd (data) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

function blogPosting (page) {
  const { frontmatter } = page
  const url = `${HOSTNAME}${page.path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.title,
    description: summaryOf(page),
    inLanguage: isEnglish(page.path) ? 'en-US' : 'es-ES',
    datePublished: publishedIso(page),
    dateModified: modifiedIso(page),
    author: { '@id': PERSON['@id'], '@type': 'Person', name: PERSON.name, url: PERSON.url },
    publisher: { '@id': PERSON['@id'] },
    image: frontmatter.image ? `${HOSTNAME}${frontmatter.image}` : DEFAULT_IMAGE,
    keywords: (frontmatter.tags || []).join(', '),
    url,
    mainEntityOfPage: url,
    isPartOf: { '@id': `${HOSTNAME}/#website` }
  }
}

function website (siteConfig) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${HOSTNAME}/#website`,
        url: `${HOSTNAME}/`,
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: ['es-ES', 'en-US'],
        author: { '@id': PERSON['@id'] },
        publisher: { '@id': PERSON['@id'] }
      },
      PERSON
    ]
  }
}

module.exports = (options, context) => ({
  name: 'seo-links',

  extendPageData ($page) {
    const { frontmatter } = $page

    // @vuepress/theme-blog overwrites `description` with `summary`. Restore the post's own
    // `description` (if it has one) so the meta, Open Graph, Twitter and JSON-LD tags use it.
    const ownDescription = $page._content && matter($page._content).data.description
    if (ownDescription) {
      frontmatter.description = ownDescription
    }

    if (PAGINATION_PATH.test($page.path || '')) {
      frontmatter.sitemap = Object.assign({}, frontmatter.sitemap, { exclude: true })
    }
    const lastUpdated = modifiedIso($page)
    if (lastUpdated) {
      $page.lastUpdated = lastUpdated
    }
  },

  async generated () {
    const pathsByLowerCase = pathIndex(context.pages)

    for (const page of context.pages) {
      if (!page.path || page.path === '/404.html') continue

      const file = htmlFile(context.outDir, page.path)
      if (!fs.existsSync(file)) continue

      let html = fs.readFileSync(file, 'utf8')
      const tags = []

      if (!/rel="canonical"/.test(html)) {
        tags.push(`<link rel="canonical" href="${HOSTNAME}${page.path}">`)
      }
      tags.push(...alternateLinks(page, pathsByLowerCase))
      if (isEnglish(page.path)) {
        tags.push(`<link rel="alternate" type="application/rss+xml" href="${HOSTNAME}/en/rss.xml" title="Rafael Neto (English) RSS Feed">`)
      }
      if (isPost(page)) {
        tags.push(`<link rel="alternate" type="text/markdown" href="${HOSTNAME}${markdownPath(page.path)}">`)
        tags.push(jsonLd(blogPosting(page)))
      } else if (INDEX_PAGES.includes(page.path)) {
        tags.push(jsonLd(website(context.siteConfig)))
      }

      if (tags.length) {
        html = html.replace('</head>', `${tags.join('\n    ')}\n  </head>`)
        fs.writeFileSync(file, html)
      }
    }
  }
})
