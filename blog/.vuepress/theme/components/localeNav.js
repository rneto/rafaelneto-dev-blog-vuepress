// Language-aware navigation for Header.vue and MobileHeader.vue:
// - homePath: the "about me" page in the language of the current page (/ or /en/).
// - navItems: a link to the other language, then the menu of the current language
//   (themeConfig.nav for Spanish, themeConfig.localeNav['/en/'] for English).
//
// The language link goes to the translation of the current page (read at build time from its
// language switcher line, see theme/index.js), or to the other language's post list. On tag pages it
// goes to the same tag in the other language (/tag/<tag>/ <-> /en/tag/<tag>/) or to its tag index.
export default {
  computed: {
    isEnglishPage() {
      // Missing pages (layouts/NotFound.vue) have no $page.path: use the requested URL
      return (this.$page.path || this.$route.path || '').startsWith('/en/')
    },

    homePath() {
      return this.isEnglishPage ? '/en/' : '/'
    },

    translationLink() {
      const exists = target => this.$site.pages.some(page => (page.path || '').toLowerCase() === target.toLowerCase())

      // Tag pages: the same tag in the other language, or its tag index
      const tag = (this.$page.path || '').match(/^\/(?:en\/)?tag\/(.*)$/)
      if (tag) {
        const index = this.isEnglishPage ? '/tag/' : '/en/tag/'
        const sameTag = index + tag[1].replace(/page\/\d+\/$/, '')
        return tag[1] && exists(sameTag) ? sameTag : index
      }

      const target = this.$page.translationPath
      if (target && exists(target)) return target
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
