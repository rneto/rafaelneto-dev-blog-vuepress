<template>
  <div id="base-list-layout">
    <div class="ui-posts" itemscope itemtype="http://schema.org/Blog">
      <article
        v-for="page in pages"
        :key="page.key"
        class="ui-post"
        itemprop="blogPost"
        itemscope
        itemtype="https://schema.org/BlogPosting"
      >
        <meta itemprop="mainEntityOfPage" :content="page.path" />

        <header class="ui-post-title" itemprop="name headline">
          <NavLink :link="page.path">{{ page.title }}</NavLink>
        </header>

        <client-only v-if="page.excerpt">
          <!-- eslint-disable vue/no-v-html -->
          <p
            class="ui-post-summary"
            itemprop="description"
            v-html="page.excerpt"
          />
          <!-- eslint-enable vue/no-v-html -->
        </client-only>
        <p v-else class="ui-post-summary" itemprop="description">
          {{ page.frontmatter.summary || page.summary }}
        </p>

        <footer>
          <div
            v-if="page.frontmatter.author"
            class="ui-post-meta ui-post-author"
            itemprop="publisher author"
            itemtype="http://schema.org/Person"
            itemscope
          >
            <NavigationIcon />
            <span itemprop="name">{{ page.frontmatter.author }}</span>
            <span v-if="page.frontmatter.location" itemprop="address">
              &nbsp; in {{ page.frontmatter.location }}
            </span>
          </div>

          <div v-if="page.frontmatter.date" class="ui-post-meta ui-post-date">
            <ClockIcon />
            <time
              pubdate
              itemprop="datePublished"
              :datetime="isoDate(page.frontmatter.date)"
            >
              {{ resolvePostDate(page.frontmatter.date, page.path) }}
            </time>
          </div>

          <div v-if="page.readingTime" class="ui-post-meta ui-post-reading-time">
            <ReadingTime :minutes="page.readingTime" :path="page.path" />
          </div>

          <div
            v-if="page.frontmatter.tags"
            class="ui-post-meta ui-post-tag"
            itemprop="keywords"
          >
            <TagIcon />
            <router-link
              v-for="tag in resolvePostTags(page.frontmatter.tags)"
              :key="tag"
              :to="tagPath(tag, page.path)"
            >
              {{ tag }}
            </router-link>
          </div>
        </footer>
      </article>
    </div>

    <component
      :is="paginationComponent"
      v-if="$pagination.length > 1 && paginationComponent"
    ></component>
  </div>
</template>

<script>
// The parent theme's post list (BaseListLayout), plus the reading time of each post and a readable date per language.
import BaseListLayout from '@parent-theme/global-components/BaseListLayout.vue'
import ReadingTime from './ReadingTime.vue'
import { formatDate, isoDate } from './formatDate'
import { tagPath } from './tagPath'

export default {
  extends: BaseListLayout,
  components: { ReadingTime },
  methods: {
    isoDate,
    tagPath,
    resolvePostDate(date, path) {
      return formatDate(date, (path || '').startsWith('/en/'))
    },
  },
}
</script>
