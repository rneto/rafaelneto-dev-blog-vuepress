/**
 * Generates a 1200x630 social card (Open Graph / X / LinkedIn image) for every post after the build:
 * the post title, the logos of its tags, the "RN" monogram (monogram.js) and the reading time.
 * Also two site cards (Spanish and English) for the pages that are not posts: the blog tagline and
 * the logos of its main topics.
 *
 * - Output: /images/og/<post path>.png (see `ogImagePath` in shared.js) and the SITE_CARDS paths,
 *   referenced by the `seo` plugin options and the JSON-LD data.
 * - Posts with their own `image` in the frontmatter keep it and get no card.
 * - Logos come from Simple Icons (CC0); TAG_ICONS maps post tags to their slugs. Tags without a
 *   logo (Microsoft products were removed from Simple Icons) are just left out.
 * - Fonts are bundled (Inter, from @expo-google-fonts/inter), so the cards look the same on Windows
 *   and on the Linux CI runner.
 */
const fs = require('fs')
const path = require('path')
const { Resvg } = require('@resvg/resvg-js')
const { SITE_CARDS, isEnglish, ogImagePath, postsNewestFirst } = require('./shared')
const { FONT_FILES, circle: monogram } = require('./monogram')

const WIDTH = 1200
const HEIGHT = 630
const MARGIN = 80
const MAX_LOGOS = 5

// Main topics of the blog, shown on the site cards
const SITE_ICONS = ['dotnet', 'angular', 'typescript', 'javascript', 'html5', 'css']

const COLORS = {
  background: '#16181d',
  accent: '#d66056',
  title: '#f0f1f3',
  text: '#d4d6db',
  muted: '#9a9ea8'
}

// Post tag -> Simple Icons slug (node_modules/simple-icons/icons/<slug>.svg)
const TAG_ICONS = {
  Angular: 'angular',
  AngularElements: 'angular',
  AngularMaterial: 'angular',
  MaterialDesign: 'materialdesign',
  ASPNETCore: 'dotnet',
  ASPNET: 'dotnet',
  dotNET: 'dotnet',
  TypeScript: 'typescript',
  JavaScript: 'javascript',
  ES2015: 'javascript',
  Nodejs: 'nodedotjs',
  npm: 'npm',
  nvm: 'nvm',
  webpack: 'webpack',
  CSS: 'css',
  HTML: 'html5',
  Sass: 'sass',
  TailwindCSS: 'tailwindcss',
  RxJs: 'reactivex',
  BehaviourSubject: 'reactivex',
  Observable: 'reactivex',
  WebComponents: 'webcomponentsdotorg',
  Vuejs: 'vuedotjs',
  VuePress: 'vuedotjs',
  Git: 'git',
  GitHubActions: 'githubactions',
  JWT: 'jsonwebtokens',
  OIDC: 'openid',
  PWA: 'pwa',
  Linux: 'linux',
  Nginx: 'nginx',
  MySQL: 'mysql'
}

const ICONS_DIR = path.dirname(require.resolve('simple-icons/icons/angular.svg'))

const escapeXml = value => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

// Approximate width of a string in Inter Bold, in em: good enough to wrap the title.
function textWidth (text) {
  let width = 0
  for (const char of text) {
    if (char === ' ') width += 0.26
    else if (/[iljI.,:;'!|()\[\]]/.test(char)) width += 0.28
    else if (/[ftr]/.test(char)) width += 0.38
    else if (/[mwMW]/.test(char)) width += 0.86
    else if (/[A-ZÁÉÍÓÚÑ]/.test(char)) width += 0.68
    else if (/[0-9]/.test(char)) width += 0.6
    else width += 0.57
  }
  return width
}

function wrap (text, fontSize, maxWidth) {
  const lines = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (line && textWidth(candidate) * fontSize > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

// Largest font size that fits the title in 4 lines; long titles end with an ellipsis at the smallest size.
function layoutTitle (title) {
  const maxWidth = WIDTH - MARGIN * 2
  for (const fontSize of [72, 64, 56, 50, 44]) {
    const lines = wrap(title, fontSize, maxWidth)
    if (lines.length <= 4) return { fontSize, lines }
  }
  const lines = wrap(title, 44, maxWidth).slice(0, 4)
  lines[3] = `${lines[3].replace(/[\s,.:;]+\S*$/, '')}…`
  return { fontSize: 44, lines }
}

const iconCache = new Map()
function iconPaths (slug) {
  if (!iconCache.has(slug)) {
    const file = path.join(ICONS_DIR, `${slug}.svg`)
    const svg = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    iconCache.set(slug, [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map(match => match[1]))
  }
  return iconCache.get(slug)
}

function logos (tags) {
  const slugs = [...new Set((tags || []).map(tag => TAG_ICONS[tag]).filter(Boolean))]
  return slugs.map(iconPaths).filter(paths => paths.length).slice(0, MAX_LOGOS)
}

function postCardSvg (page) {
  const english = isEnglish(page.path)
  return cardSvg({
    title: page.title,
    icons: logos(page.frontmatter.tags),
    tags: page.frontmatter.tags,
    note: page.readingTime ? `${page.readingTime} ${english ? 'min read' : 'min de lectura'}` : ''
  })
}

const siteCardSvg = card => cardSvg({ title: card.tagline, icons: SITE_ICONS.map(iconPaths) })

// Shared layout: logos (or tag names) on top, the title, and the author row with an optional note
function cardSvg ({ title, icons, tags, note }) {
  const { fontSize, lines } = layoutTitle(title)
  const lineHeight = Math.round(fontSize * 1.2)

  // Title block centered vertically between the logo row and the author row
  const top = 200
  const bottom = 470
  const blockHeight = lineHeight * lines.length
  const firstBaseline = top + Math.max(0, (bottom - top - blockHeight) / 2) + fontSize * 0.9

  const titleSvg = lines.map((line, index) =>
    `<text x="${MARGIN}" y="${Math.round(firstBaseline + index * lineHeight)}" font-family="Inter" font-weight="700" font-size="${fontSize}" fill="${COLORS.title}">${escapeXml(line)}</text>`
  ).join('')

  const iconSize = 64
  const iconsSvg = icons.map((paths, index) =>
    `<svg x="${MARGIN + index * (iconSize + 28)}" y="88" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24">${paths.map(d => `<path d="${d}" fill="${COLORS.text}"/>`).join('')}</svg>`
  ).join('')

  // No logos: the tag names fill the top row instead
  const tagsSvg = icons.length ? '' : `<text x="${MARGIN}" y="132" font-family="Inter" font-weight="700" font-size="30" fill="${COLORS.accent}">${
    escapeXml((tags || []).slice(0, 4).map(tag => `#${tag}`).join('   '))
  }</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.background}"/>
  <rect width="${WIDTH}" height="10" fill="${COLORS.accent}"/>
  ${iconsSvg}
  ${tagsSvg}
  ${titleSvg}
  <svg x="${MARGIN}" y="${HEIGHT - 140}" width="76" height="76" viewBox="0 0 100 100">${monogram}</svg>
  <text x="${MARGIN + 96}" y="${HEIGHT - 107}" font-family="Inter" font-weight="700" font-size="30" fill="${COLORS.title}">Rafael Neto</text>
  <text x="${MARGIN + 96}" y="${HEIGHT - 72}" font-family="Inter" font-weight="400" font-size="24" fill="${COLORS.accent}">rafaelneto.dev</text>
  <text x="${WIDTH - MARGIN}" y="${HEIGHT - 72}" text-anchor="end" font-family="Inter" font-weight="400" font-size="24" fill="${COLORS.muted}">${escapeXml(note)}</text>
</svg>`
}

module.exports = (options, context) => ({
  name: 'og-images',

  async generated () {
    const write = (imagePath, svg) => {
      const png = new Resvg(svg, {
        fitTo: { mode: 'width', value: WIDTH },
        font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Inter' }
      }).render().asPng()

      const file = path.join(context.outDir, imagePath)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, png)
    }

    for (const page of postsNewestFirst(context.pages).filter(page => !page.frontmatter.image)) {
      write(ogImagePath(page), postCardSvg(page))
    }
    for (const card of Object.values(SITE_CARDS)) {
      write(card.path, siteCardSvg(card))
    }
  }
})
