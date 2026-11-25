// Language-aware navigation for Header.vue and MobileHeader.vue:
// - homePath: the "about me" page in the language of the current page (/ or /en/).
// - navItems: a link to the other language, then the menu of the current language
//   (themeConfig.nav for Spanish, themeConfig.localeNav['/en/'] for English).
//
// The language link goes to the translation of the current page (read at build time from its
// language switcher line, see theme/index.js), or to the other language's post list.
export default {
  computed: {
    isEnglishPage() {
      return (this.$page.path || '').startsWith('/en/')
    },

    homePath() {
      return this.isEnglishPage ? '/en/' : '/'
    },

    translationLink() {
      const target = this.$page.translationPath
      const exists = target && this.$site.pages.some(page => (page.path || '').toLowerCase() === target)
      if (exists) return target
      return this.isEnglishPage ? '/blog/' : '/en/blog/'
    },

    navItems() {
      const { nav = [], localeNav = {} } = this.$themeConfig
      const items = this.isEnglishPage ? (localeNav['/en/'] || nav) : nav
      const language = this.isEnglishPage
        ? { text: 'Español', link: this.translationLink }
        : { text: 'English', link: this.translationLink }
      return [language, ...items]
    },
  },
}
