<template>
  <section id="header-wrapper">
    <header id="header">
      <div class="header-wrapper">
        <div class="title">
          <NavLink :link="homePath" class="home-link"><img class="site-avatar" src="/images/monogram-80.png" alt="" width="36" height="36" />{{ $site.title }} </NavLink>
        </div>
        <div class="header-right-wrap">
          <ul class="nav">
            <li
              v-for="item in navItems"
              :key="item.text"
              class="nav-item"
            >
              <NavLink :link="item.link">{{ item.text }}</NavLink>
            </li>
          </ul>
          <SearchBox ref="search" />
          <ThemeToggle />
          <Feed />
        </div>
      </div>
    </header>
  </section>
</template>

<script>
// The parent theme's header, plus the light/dark switch, the language-aware menu (localeNav.js)
// and the search box placeholder and label in the page language.
import Header from '@parent-theme/components/Header.vue'
import ThemeToggle from './ThemeToggle.vue'
import localeNav from './localeNav'

export default {
  extends: Header,
  mixins: [localeNav],
  components: { ThemeToggle },
  watch: {
    '$page.path'() {
      this.labelSearch()
    },
  },
  mounted() {
    this.labelSearch()
  },
  methods: {
    // The search plugin reads one global placeholder when it mounts, so set it here on every page.
    labelSearch() {
      const search = this.$refs.search
      if (!search) return
      const text = this.isEnglishPage ? 'Search…' : 'Buscar…'
      search.placeholder = text
      const input = search.$el && search.$el.querySelector('input')
      if (input) input.setAttribute('aria-label', text.replace('…', ''))
    },
  },
}
</script>
