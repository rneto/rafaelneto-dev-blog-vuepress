<template>
  <nav v-if="previous || next" class="post-nav" :aria-label="t.aria">
    <RouterLink v-if="previous" :to="previous.path" rel="prev" class="post-nav__link post-nav__link--previous">
      <span class="post-nav__label">← {{ t.previous }}</span>
      <span class="post-nav__title">{{ previous.title }}</span>
    </RouterLink>
    <RouterLink v-if="next" :to="next.path" rel="next" class="post-nav__link post-nav__link--next">
      <span class="post-nav__label">{{ t.next }} →</span>
      <span class="post-nav__title">{{ next.title }}</span>
    </RouterLink>
  </nav>
</template>

<script>
/**
 * Links to the previous (older) and next (newer) post in the same language, at the end of each post
 * (layouts/Post.vue). The first and last posts show only one link.
 */
import { isoDate } from './formatDate'

const POST_PATH = /^\/(en\/)?blog\/(?!page\/)[^/]+\/$/

const TEXTS = {
  es: { aria: 'Más artículos', previous: 'Anterior', next: 'Siguiente' },
  en: { aria: 'More posts', previous: 'Previous', next: 'Next' },
}

export default {
  name: 'PostNav',

  computed: {
    english() {
      return this.$page.path.startsWith('/en/')
    },

    t() {
      return TEXTS[this.english ? 'en' : 'es']
    },

    // Posts of this language, oldest first (same-day posts in path order, so the order is stable)
    posts() {
      const key = page => `${isoDate(page.frontmatter.date)} ${page.path}`
      return this.$site.pages
        .filter(page => page.frontmatter.date && POST_PATH.test(page.path))
        .filter(page => page.path.startsWith('/en/') === this.english)
        .sort((a, b) => (key(a) < key(b) ? -1 : 1))
    },

    index() {
      return this.posts.findIndex(page => page.path === this.$page.path)
    },

    previous() {
      return this.index > 0 ? this.posts[this.index - 1] : null
    },

    next() {
      return this.index >= 0 && this.index < this.posts.length - 1 ? this.posts[this.index + 1] : null
    },
  },
}
</script>
