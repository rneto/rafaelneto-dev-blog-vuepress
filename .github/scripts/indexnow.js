// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver...) which URLs changed.
// Bing feeds Copilot and ChatGPT search. Google does not use IndexNow; it reads the sitemap.
// Usage: node .github/scripts/indexnow.js [days]   (default: URLs modified in the last 7 days)
const fs = require('fs')

const HOST = 'rafaelneto.dev'
const KEY = '1c1b2eeb7ae65fa52a6bb61fb60f9929' // public by design, served at https://rafaelneto.dev/1c1b2eeb7ae65fa52a6bb61fb60f9929.txt
const ALWAYS = ['/', '/en/', '/blog/', '/en/blog/', '/llms.txt', '/llms-full.txt']

const days = Number(process.argv[2] || 7)
const since = Date.now() - days * 24 * 60 * 60 * 1000
const sitemap = fs.readFileSync('blog/.vuepress/dist/sitemap.xml', 'utf8')

const changed = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:[^<]|<(?!\/url>))*?<lastmod>([^<]+)<\/lastmod>/g)]
  .filter(([, , lastmod]) => new Date(lastmod).getTime() >= since)
  .map(([, loc]) => loc)
const urlList = [...new Set([...ALWAYS.map(path => `https://${HOST}${path}`), ...changed])]

console.log(`Submitting ${urlList.length} URLs to IndexNow:`)
urlList.forEach(url => console.log(`  ${url}`))

fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList })
})
  .then(response => console.log(`IndexNow answered ${response.status} ${response.statusText}`))
  .catch(error => console.log(`IndexNow request failed: ${error.message}`))
