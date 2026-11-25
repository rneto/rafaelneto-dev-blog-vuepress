<template>
  <span class="reading-time">
    <BookOpenIcon />
    {{ minutes }} {{ isEnglish ? 'min read' : 'min de lectura' }}
  </span>
</template>

<script>
import { BookOpenIcon } from 'vue-feather-icons'

export default {
  name: 'ReadingTime',
  components: { BookOpenIcon },
  props: {
    minutes: { type: Number, required: true },
    path: { type: String, default: '' },
  },
  computed: {
    isEnglish() {
      return this.path.startsWith('/en/')
    },
  },
}
</script>

<style lang="stylus">
.reading-time
  display inline-flex
  align-items center

  svg
    margin-right 5px
    width 14px
    height 14px
</style>
