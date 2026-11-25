<template>
  <div id="mobile-header">
    <div class="mobile-header-bar">
      <div class="mobile-header-title">
        <NavLink :link="homePath" class="mobile-home-link"><img class="site-avatar" src="/images/monogram-80.png" alt="" width="36" height="36" />{{ $site.title }} </NavLink>
        <ThemeToggle />
        <component
          :is="isOpen ? 'XIcon' : 'MenuIcon'"
          @click="$emit('toggle-sidebar')"
        />
      </div>
      <div class="mobile-menu-wrapper" :class="{ open: isOpen }">
        <hr class="menu-divider" />
        <ul class="mobile-nav">
          <li
            v-for="item in navItems"
            :key="item.text"
            class="mobile-nav-item"
          >
            <NavLink :link="item.link">{{ item.text }}</NavLink>
          </li>
          <li class="mobile-nav-item">
            <Feed />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// The parent theme's mobile header, plus the light/dark switch and the language-aware menu (localeNav.js) next to the menu button.
import MobileHeader from '@parent-theme/components/MobileHeader.vue'
import ThemeToggle from './ThemeToggle.vue'
import localeNav from './localeNav'

export default {
  extends: MobileHeader,
  mixins: [localeNav],
  components: { ThemeToggle },
}
</script>
