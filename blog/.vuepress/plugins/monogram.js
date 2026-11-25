/**
 * The "RN" monogram: white initials on the accent color. Used by og-images.js (social cards) and
 * by scripts/make-icons.js, which writes the favicon, header and app icon PNGs into public/images/.
 *
 * Shapes are drawn in a 100x100 box and rendered with the bundled Inter font, so they look the same
 * everywhere (an SVG favicon with <text> would depend on the visitor's fonts).
 */
const path = require('path')

const ACCENT = '#d66056'

const FONT_DIR = path.dirname(require.resolve('@expo-google-fonts/inter/package.json'))
const FONT_FILES = ['400Regular/Inter_400Regular.ttf', '700Bold/Inter_700Bold.ttf', '800ExtraBold/Inter_800ExtraBold.ttf']
  .map(file => path.join(FONT_DIR, file))

const initials = '<text x="50" y="64" text-anchor="middle" font-family="Inter" font-weight="800" font-size="40" letter-spacing="-1" fill="#fff">RN</text>'

// Round version: favicon, header, social cards
const circle = `<circle cx="50" cy="50" r="50" fill="${ACCENT}"/>${initials}`

// Full square version: iOS home screen and app icons, which add their own rounded mask
const square = `<rect width="100" height="100" fill="${ACCENT}"/>${initials}`

// Standalone SVG document of a shape at a given pixel size
const svgDocument = (shape, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">${shape}</svg>`

module.exports = { ACCENT, FONT_FILES, circle, square, svgDocument }
