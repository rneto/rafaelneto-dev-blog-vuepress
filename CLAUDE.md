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
- `blog/README.md` — the "about me" home page (`/`), and `blog/_en/README.md` its English version (`/en/`, via `permalink`). Keep both in sync; they pair through the same language switcher line as posts.
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
2. `<social-share class="social-share--header" />` (renders nothing now; kept in existing posts, optional in new ones)
3. A language switcher line linking to the counterpart post:
   - Spanish: `Español | [English](/en/blog/<english-slug>/)`
   - English: `[Español](/blog/<spanish-slug>/) | English`
4. Post content.
5. Ends with `---` followed by `<social-share class="social-share--footer" />`, which renders the share block (`blog/.vuepress/components/social-share.vue`: LinkedIn, X and copy link, or the phone's share menu on touch devices).

When adding or editing a post that exists in both languages, update both files and keep the cross-links, dates, and tags in sync. Spanish is the primary language; English posts are translations.

The language switcher line is also what pairs translations for SEO: `plugins/seo-links.js` reads it to emit `hreflang` alternates, so keep its link exact. Slugs are lowercased in the built site and GitHub Pages is case-sensitive, so internal links must use the lowercase slug. Comment the switcher out (`<!-- ... -->`) while a translation does not exist yet. Never point an English post's `canonicalUrl` at the Spanish version; that de-indexes the English page.

## Site configuration

- `blog/.vuepress/config.js` holds everything: head tags (GA4 gtag is injected directly here), locales, nav, footer, and plugins.
- Plugins are disabled by renaming them with a `NO` prefix (e.g. `'@NO-vuepress/pwa'`, `'@NO-vssue/...'`) or a theme key (e.g. `NOcomment`). Comments (Vssue), PWA, the legacy UA analytics plugin, and last-updated are currently off this way.
- `blog/.vuepress/plugins/seo-links.js` is a local plugin, registered first in `plugins`. It sets `lastUpdated` from frontmatter dates (used by the `seo` and `sitemap` plugins), excludes `/page/N/` pagination from the sitemap, and after the build injects a self canonical link (when the frontmatter has none), `hreflang` alternates, and JSON-LD `BlogPosting` data into the generated HTML.
- `blog/.vuepress/plugins/ai-content.js` writes AI-oriented files after the build: a clean Markdown copy of every post at its URL with `.md` instead of the trailing slash, `/llms.txt` (index per https://llmstxt.org/), `/llms-full.txt` (full text of all posts), and `/en/rss.xml` (English feed). `blog/.vuepress/plugins/og-images.js` draws a 1200x630 social card for every post after the build (`/images/og/<post path>.png`: title, logos of its tags from Simple Icons, the "RN" monogram, reading time), used as `og:image`/`twitter:image` and in JSON-LD unless the post sets its own `image` in the frontmatter; it also draws the site card shared by every other page (`SITE_CARDS` in `shared.js`: `/images/og/site.png` and `site-en.png`). Map new tags to Simple Icons slugs in its `TAG_ICONS`; Microsoft products have no logo there. All three plugins share helpers and the author profile (`PERSON`, used in JSON-LD) in `plugins/shared.js`.
- After deploying, the workflow runs `.github/scripts/indexnow.js`, which submits URLs modified in the last 7 days (per the sitemap) to IndexNow (Bing, Yandex...). Its key is public by design and is served from `blog/.vuepress/public/<key>.txt`; the two must match. `node .github/scripts/indexnow.js 4000` after a local build submits every URL.
- The `seo` plugin options give absolute `og:url`, `og:type=article` for posts, the site card as share image of pages that are not posts, and `og:locale`. `PERSON.image` is Rafael's profile photo (`/images/rafael-neto.jpg`). The `feed` plugin only includes Spanish posts, newest first.
- `blog/.vuepress/theme/` is a local theme that extends `@vuepress/theme-blog` (VuePress uses it because it exists, so `config.js` sets no `theme`). It adds two things: the reading time of each post (computed in `theme/index.js`, shown by `components/PostMeta.vue` in the post header and `components/PostList.vue` in post lists), a light/dark switch (`components/ThemeToggle.vue`, placed by `Header.vue` and `MobileHeader.vue`), and a language-aware header (`components/localeNav.js`): the site name links to `/` or `/en/`, the menu is `themeConfig.nav` (Spanish) or `themeConfig.localeNav['/en/']`, and a first "English"/"Español" link goes to the page's translation (`$page.translationPath`, read from its switcher line in `theme/index.js`) or to the other language's post list. Tags are split by language: `theme/index.js` copies each post's `tags` to `esTags` or `enTags`, and `themeConfig.frontmatters` builds `/tag/` (Spanish posts) and `/en/tag/` (English posts) from them; tag links come from `components/tagPath.js` (used by `PostTag.vue`, registered in `PostMeta.vue`, and `PostList.vue`), and same-name tags in both languages get hreflang pairs. `layouts/Post.vue` is the parent's post layout plus `components/PostNav.vue` after the post: links to the previous (older) and next (newer) post in the same language, by frontmatter date. `components/Footer.vue` replaces the theme footer: icon links to the `themeConfig.footer.contact` profiles (types `x`, `linkedin`, `github`), the RSS feed of the page's language (`/rss.xml` or `/en/rss.xml`), and the copyright linking to `/` or `/en/`. The other overriding components `extends` the parent component and replace only its template; anything else comes from the parent theme. The switch saves the choice in `localStorage('theme')` and sets `<html data-theme>`; an inline script in the `head` of `config.js` applies it before the page paints.
- `theme/layouts/NotFound.vue` is the 404 page (GitHub Pages serves `404.html` for any missing URL): Spanish or English from the requested URL, rendered in the browser only, with links to the blog and the latest posts. A missing `/tag/<tag>/` goes to `/en/tag/<tag>/` when that tag exists in English.
- The site font is Inter, self-hosted from the `@fontsource-variable/inter` package (imported in `enhanceApp.js`, used by the `font-family` rule at the top of `styles/index.styl`); no Google Fonts.
- `blog/.vuepress/enhanceApp.js` is the VuePress app hook: the font imports and a router guard that reloads URLs with the wrong letter case at the real page address (old external links; GitHub Pages is case-sensitive but the router is not).
- `blog/.vuepress/components/` holds globally registered Vue components usable in Markdown (`last-updated.vue`; `latest-posts.vue`, used on the home pages; `social-share.vue`, the share block at the end of posts; the others are VuePress scaffolding).
- Styles are Stylus: `styles/index.styl` (custom overrides of the blog theme, including dark mode: the `dark-mode()` mixin, applied by `html[data-theme="dark"]` or by the system dark setting when the visitor has not chosen light), `styles/palette.styl` (theme variables). The theme's colors are Stylus variables fixed at build time, so dark mode overrides them with `!important` rules; new colored elements need a dark rule there too.
- The site's mark is an "RN" monogram (white initials on the accent `#d66056`), defined once in `plugins/monogram.js`. `node blog/.vuepress/scripts/make-icons.js` writes the favicon, the header monogram and the app icons in `public/images/icons/`; commit the PNGs it writes.
- Rafael's profile photo (the same as on LinkedIn) is a square head-and-shoulders crop in two sizes: `public/images/rafael-neto.jpg` (512 px, used in the JSON-LD `Person`) and `about-photo-240.jpg` (the about pages, shown round at 120 px). Replace both together, as JPEGs without camera metadata.
- Static assets live in `blog/.vuepress/public/` and are referenced from posts with absolute paths like `/images/foo.png`.
