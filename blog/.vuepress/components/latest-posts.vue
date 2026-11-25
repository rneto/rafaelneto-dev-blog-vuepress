<template>
  <ul class="latest-posts">
    <li v-for="page in posts" :key="page.key" class="latest-posts__item">
      <router-link :to="page.path" class="latest-posts__title">{{ page.title }}</router-link>
      <div class="latest-posts__meta">
        <time :datetime="isoDate(page.frontmatter.date)">{{ formatDate(page.frontmatter.date, english) }}</time>
        <span v-if="page.readingTime"> · {{ page.readingTime }} {{ english ? 'min read' : 'min de lectura' }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
// Newest posts of one language, for the home page: <latest-posts /> or <latest-posts lang="en" :count="5" />
import { dateParts, formatDate, isoDate } from '../theme/components/formatDate'

const POST_PATH = /^\/(en\/)?blog\/(?!page\/)[^/]+\/$/

export default {
  props: {
    lang: { type: String, default: 'es' },
    count: { type: Number, default: 3 },
  },
  computed: {
    english() {
      return this.lang === 'en'
    },
    posts() {
      const time = page => {
        const [year, month, day] = dateParts(page.frontmatter.date)
        return Date.UTC(year, month - 1, day)
      }
      return this.$site.pages
        .filter(page => page.frontmatter.date && POST_PATH.test(page.path))
        .filter(page => page.path.startsWith('/en/') === this.english)
        .sort((a, b) => time(b) - time(a))
        .slice(0, this.count)
    },
  },
  methods: {
    formatDate,
    isoDate,
  },
}
</script>

<style lang="stylus">
.latest-posts
  list-style none
  padding 0

  &__item
    margin-bottom 1.2rem

  &__title
    font-size 1.15rem
    font-weight 600

  &__meta
    font-size 14px
    color rgba(0, 0, 0, 0.7)
    margin-top 0.2rem
</style>
