<template>
  <button
    type="button"
    class="theme-toggle"
    :title="label"
    :aria-label="label"
    @click="toggle"
  >
    <SunIcon v-if="dark" />
    <MoonIcon v-else />
  </button>
</template>

<script>
// Light/dark switch. Without a choice the site follows the system setting; a choice is saved in
// localStorage('theme') and applied as <html data-theme="..."> (also by the inline script in
// config.js `head`, before the page paints).
import { SunIcon, MoonIcon } from 'vue-feather-icons'

const STORAGE_KEY = 'theme'

export default {
  name: 'ThemeToggle',
  components: { SunIcon, MoonIcon },
  data() {
    return { dark: false }
  },
  computed: {
    label() {
      const english = (this.$page.path || '').startsWith('/en/')
      if (this.dark) return english ? 'Switch to light mode' : 'Cambiar a modo claro'
      return english ? 'Switch to dark mode' : 'Cambiar a modo oscuro'
    },
  },
  mounted() {
    this.dark = this.isDark()
    this.media = window.matchMedia('(prefers-color-scheme: dark)')
    this.onSystemChange = () => { this.dark = this.isDark() }
    if (this.media.addEventListener) this.media.addEventListener('change', this.onSystemChange)
  },
  beforeDestroy() {
    if (this.media && this.media.removeEventListener) this.media.removeEventListener('change', this.onSystemChange)
  },
  methods: {
    isDark() {
      const chosen = document.documentElement.getAttribute('data-theme')
      if (chosen) return chosen === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    },
    toggle() {
      const theme = this.isDark() ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', theme)
      try {
        localStorage.setItem(STORAGE_KEY, theme)
      } catch (e) {
        // Storage blocked (private mode...): the choice lasts until the page is reloaded
      }
      this.dark = theme === 'dark'
    },
  },
}
</script>
