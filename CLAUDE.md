# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal bilingual (Spanish/English) blog published at https://rafaelneto.dev, built with **VuePress 1.x** and `@vuepress/theme-blog`. Almost all work here is writing or editing Markdown posts; there is no application code, linter, or test suite.

## Commands

```bash
yarn install   # install dependencies
yarn dev       # local dev server (vuepress dev blog)
yarn build     # static build into blog/.vuepress/dist/
```

`yarn build` is the only verification available; run it after config or component changes to catch broken frontmatter or Vue template errors in posts.

VuePress 1 uses webpack 4, which fails on Node 17+ with `error:0308010C:digital envelope routines::unsupported`. Set `NODE_OPTIONS=--openssl-legacy-provider` for `yarn dev` and `yarn build` on any modern Node.

## Deployment

Every push to `master` triggers `.github/workflows/vuepress-deploy.yml`. It installs with `yarn install --frozen-lockfile` on Node 24, builds with the legacy OpenSSL option, and force-pushes `blog/.vuepress/dist/` as a single commit to the `master` branch of the separate `rneto/rafaelneto.dev` repo (GitHub Pages, CNAME `rafaelneto.dev`) using the `ACCESS_TOKEN` secret. Pushing to `master` here publishes the site; other branches do not deploy.

## Content structure

- `blog/_posts/` — Spanish posts, served at `/blog/:slug` (default locale `/`, `es-ES`).
- `blog/_en/_posts/` — English posts, served at `/en/blog/:slug` (locale `/en/`, `en-US`).
- `blog/README.md` — the "about me" home page.
- Files ending in `.md.NOPE` (and prefixed with `_`) are unpublished drafts that VuePress ignores. Keep them out of commits unless asked.

Both directories are registered as separate blog "directories" in `themeConfig.directories` in `blog/.vuepress/config.js`. The slug comes from the filename, so Spanish and English versions of the same post have different, localized filenames (e.g. `ia-desarrolladores-estrategias-aumentar-productividad.md` ↔ `ai-developers-strategies-boost-productivity.md`).

## Post conventions

Frontmatter used by every post:

```yaml
---
date: 2025-4-12          # YYYY-M-D, no zero padding
tags:
  - Angular
summary: One- or two-sentence teaser, often the opening paragraph truncated with "..."
description: "Search snippet, 120-155 chars"   # quoted; used for meta/OG/Twitter/JSON-LD when the summary is over ~160 chars
permalink: /blog/:slug   # /en/blog/:slug for English posts
canonicalUrl: https://rafaelneto.dev/blog/<own-slug>/   # optional, must be the page's own URL
meta:                    # optional, used on updated posts
  - property: article:modified_time
    content: 2021-10-22T00:00:00.000Z
---
```

Body layout, mirrored in both languages:

1. `# Title` (H1).
2. `<social-share class="social-share--header" />`
3. A language switcher line linking to the counterpart post:
   - Spanish: `Español | [English](/en/blog/<english-slug>/)`
   - English: `[Español](/blog/<spanish-slug>/) | English`
4. Post content.
5. Ends with `---` followed by `<social-share class="social-share--footer" />`.

When adding or editing a post that exists in both languages, update both files and keep the cross-links, dates, and tags in sync. Spanish is the primary language; English posts are translations.

The language switcher line is also what pairs translations for SEO: `plugins/seo-links.js` reads it to emit `hreflang` alternates, so keep its link exact. Slugs are lowercased in the built site and GitHub Pages is case-sensitive, so internal links must use the lowercase slug. Comment the switcher out (`<!-- ... -->`) while a translation does not exist yet. Never point an English post's `canonicalUrl` at the Spanish version; that de-indexes the English page.

## Site configuration

- `blog/.vuepress/config.js` holds everything: head tags (GA4 gtag is injected directly here), locales, nav, footer, and plugins.
- Plugins are disabled by renaming them with a `NO` prefix (e.g. `'@NO-vuepress/pwa'`, `'@NO-vssue/...'`) or a theme key (e.g. `NOcomment`). Comments (Vssue), PWA, the legacy UA analytics plugin, and last-updated are currently off this way.
- `blog/.vuepress/plugins/seo-links.js` is a local plugin, registered first in `plugins`. It sets `lastUpdated` from frontmatter dates (used by the `seo` and `sitemap` plugins), excludes `/page/N/` pagination from the sitemap, and after the build injects a self canonical link (when the frontmatter has none), `hreflang` alternates, and JSON-LD `BlogPosting` data into the generated HTML.
- `blog/.vuepress/plugins/ai-content.js` writes AI-oriented files after the build: a clean Markdown copy of every post at its URL with `.md` instead of the trailing slash, `/llms.txt` (index per https://llmstxt.org/), `/llms-full.txt` (full text of all posts), and `/en/rss.xml` (English feed). Both plugins share helpers and the author profile (`PERSON`, used in JSON-LD) in `plugins/shared.js`.
- After deploying, the workflow runs `.github/scripts/indexnow.js`, which submits URLs modified in the last 7 days (per the sitemap) to IndexNow (Bing, Yandex...). Its key is public by design and is served from `blog/.vuepress/public/<key>.txt`; the two must match. `node .github/scripts/indexnow.js 4000` after a local build submits every URL.
- The `seo` plugin options give absolute `og:url`, `og:type=article` for posts, the logo as fallback share image, and `og:locale`. The `feed` plugin only includes Spanish posts, newest first.
- `blog/.vuepress/enhanceApp.js` relabels the social-share Twitter button as "Share on X" at runtime.
- `blog/.vuepress/components/` holds globally registered Vue components usable in Markdown (`last-updated.vue` is the only real one; the others are VuePress scaffolding).
- Styles are Stylus: `styles/index.styl` (custom overrides of the blog theme), `styles/palette.styl` (theme variables).
- Static assets live in `blog/.vuepress/public/` and are referenced from posts with absolute paths like `/images/foo.png`.
