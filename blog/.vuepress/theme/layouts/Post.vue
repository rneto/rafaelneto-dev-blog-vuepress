<template>
  <div id="vuepress-theme-blog__post-layout">
    <article
      class="vuepress-blog-theme-content"
      itemscope
      itemtype="https://schema.org/BlogPosting"
    >
      <header>
        <h1 class="post-title" itemprop="name headline">
          {{ $frontmatter.title }}
        </h1>
        <PostMeta
          :tags="$frontmatter.tags"
          :author="$frontmatter.author"
          :date="$frontmatter.date"
          :location="$frontmatter.location"
        />
      </header>
      <Content itemprop="articleBody" />
      <footer>
        <Newsletter v-if="$service.email.enabled" />
        <PostNav />
        <Comment />
      </footer>
    </article>
    <Toc />
  </div>
</template>

<script>
// The parent theme's post layout, with links to the previous and next post (components/PostNav.vue)
// after the post and its share block. The parent's <hr /> before the (disabled) comments is gone:
// posts already end with `---` before the share block.
import Post from '@parent-theme/layouts/Post.vue'
import PostNav from '@theme/components/PostNav.vue'

export default {
  extends: Post,
  components: { PostNav },
}
</script>
