<template>
  <div>
    <PostList v-if="$pagination" />
    <Content v-else />
  </div>
</template>

<script>
// Same as the parent theme's Layout, with the post list that shows the reading time.
import PostList from '@theme/components/PostList.vue'

export default {
  components: { PostList },
}
</script>
