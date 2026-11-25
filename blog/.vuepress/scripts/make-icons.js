/**
 * Writes the site icons from the "RN" monogram (plugins/monogram.js).
 * Run it after changing the monogram, and commit the PNGs:
 *
 *   node blog/.vuepress/scripts/make-icons.js
 *
 * - images/favicon-32.png        browser tab (round)
 * - images/monogram-80.png       header, shown at 30-36 px (round)
 * - images/icons/icon-*.png      phone home screen and web manifest (square, the OS rounds it)
 */
const fs = require('fs')
const path = require('path')
const { Resvg } = require('@resvg/resvg-js')
const { FONT_FILES, circle, square, svgDocument } = require('../plugins/monogram')

const IMAGES = path.join(__dirname, '../public/images')

function render (svg, size) {
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Inter' }
  }).render().asPng()
}

function write (relativePath, png) {
  fs.writeFileSync(path.join(IMAGES, relativePath), png)
  console.log(`${relativePath}  ${png.length} bytes`)
}

write('favicon-32.png', render(svgDocument(circle, 32), 32))
write('monogram-80.png', render(svgDocument(circle, 80), 80))
for (const size of [128, 144, 152, 192, 256, 512]) {
  write(`icons/icon-${size}x${size}.png`, render(svgDocument(square, size), size))
}
