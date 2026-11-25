<template>
  <div class="post-meta">
    <div
      v-if="author"
      class="post-meta-author"
      itemprop="publisher author"
      itemtype="http://schema.org/Person"
      itemscope
    >
      <NavigationIcon />
      <span itemprop="name">{{ author }}</span>
      <span v-if="location" itemprop="address"> &nbsp; in {{ location }}</span>
    </div>
    <div v-if="date" class="post-meta-date">
      <ClockIcon />
      <time pubdate itemprop="datePublished" :datetime="isoDate">
        {{ resolvedDate }}
      </time>
    </div>
    <div v-if="$page.readingTime" class="post-meta-reading-time">
      <ReadingTime :minutes="$page.readingTime" :path="$page.path" />
    </div>
    <ul v-if="tags" class="post-meta-tags" itemprop="keywords">
      <PostTag v-for="tag in resolvedTags" :key="tag" :tag="tag" />
    </ul>
  </div>
</template>

<script>
// The parent theme's post header, plus the reading time and a readable date per language.
import PostMeta from '@parent-theme/components/PostMeta.vue'
import ReadingTime from './ReadingTime.vue'
import { formatDate, isoDate } from './formatDate'

export default {
  extends: PostMeta,
  components: { ReadingTime },
  computed: {
    resolvedDate() {
      return formatDate(this.date, (this.$page.path || '').startsWith('/en/'))
    },
    isoDate() {
      return isoDate(this.date)
    },
  },
}
</script>
