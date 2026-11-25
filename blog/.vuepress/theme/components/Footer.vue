<template>
  <footer class="footer">
    <div class="footer-left-wrap">
      <ul class="contact">
        <li v-for="item in contact" :key="item.type" class="contact-item">
          <a
            class="footer-icon"
            :href="item.link"
            :aria-label="item.label"
            :title="item.label"
            v-bind="item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
          >
            <svg v-if="item.type === 'x'" class="footer-icon__x" viewBox="0 0 300 271" aria-hidden="true">
              <path fill="currentColor" d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z" />
            </svg>
            <component :is="item.icon" v-else aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>

    <div class="footer-right-wrap">
      <ul class="copyright">
        <li v-for="item in copyright" :key="item.text" class="copyright-item">
          <RouterLink :to="homePath">{{ item.text }}</RouterLink>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
/**
 * Site footer: profile links from themeConfig.footer.contact (types x, linkedin, github), then the
 * RSS feed of the page's language, and the copyright, which links to the about page in that language.
 * Icon-only links get an accessible name (aria-label) and a tooltip (title).
 */
import { GithubIcon, LinkedinIcon, RssIcon } from 'vue-feather-icons'
import localeNav from './localeNav'

const NAMES = { x: 'X', linkedin: 'LinkedIn', github: 'GitHub' }
const ICONS = { linkedin: 'LinkedinIcon', github: 'GithubIcon' }

export default {
  name: 'Footer',
  components: { GithubIcon, LinkedinIcon, RssIcon },
  mixins: [localeNav],

  computed: {
    contact() {
      const profiles = ((this.$themeConfig.footer && this.$themeConfig.footer.contact) || [])
        .filter(({ type }) => NAMES[type])
        .map(({ type, link }) => ({
          type,
          link,
          icon: ICONS[type],
          external: true,
          label: this.isEnglishPage ? `Rafael Neto on ${NAMES[type]}` : `Rafael Neto en ${NAMES[type]}`,
        }))

      const rss = {
        type: 'rss',
        link: this.isEnglishPage ? '/en/rss.xml' : '/rss.xml',
        icon: 'RssIcon',
        external: false,
        label: this.isEnglishPage ? 'Subscribe via RSS' : 'Suscríbete por RSS',
      }

      return [...profiles, rss]
    },

    copyright() {
      return (this.$themeConfig.footer && this.$themeConfig.footer.copyright) || []
    },
  },
}
</script>

<style lang="stylus">
// Not scoped, and colors with !important: the light and dark link rules in styles/index.styl
// would otherwise color these links. The footer is dark in both modes (dark mode darkens it more).
.footer
  display flex
  align-items center
  min-height 60px
  box-sizing border-box
  padding 10px 32px
  background-color $footerBgColor

  ul
    list-style none
    margin 0
    padding 0

  .footer-left-wrap,
  .footer-right-wrap
    flex 1
    display flex

  // Room for the back-to-top arrow, fixed 2rem from the right edge
  .footer-right-wrap
    justify-content flex-end
    padding-right 48px

  .contact
    display flex
    gap 0.4rem

  .footer-icon
    display inline-flex
    align-items center
    justify-content center
    width 40px
    height 40px
    color #fff !important
    opacity 0.85
    transition opacity 0.2s, color 0.2s

    &:hover,
    &:focus-visible
      opacity 1
      color #e8786e !important

    svg
      width 22px
      height 22px

    .footer-icon__x
      width 19px
      height 19px

  .copyright a
    color #fff !important
    font-size 14px
    text-decoration none

    &:hover,
    &:focus-visible
      text-decoration underline

@media (max-width: $MQMobile)
  .footer
    flex-direction column
    gap 0.4rem
    padding 12px 16px 16px

    .footer-left-wrap,
    .footer-right-wrap
      justify-content center

    .footer-right-wrap
      padding-right 0
</style>
