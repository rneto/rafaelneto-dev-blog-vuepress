<template>
  <aside v-if="isFooter" class="share-block" :aria-label="t.aria">
    <p class="share-block__title">{{ t.title }}</p>
    <div class="share-block__buttons">
      <a class="share-btn" :href="linkedinUrl" target="_blank" rel="noopener noreferrer">
        <LinkedinIcon class="share-btn__icon" />
        <span>LinkedIn</span>
      </a>
      <a class="share-btn" :href="xUrl" target="_blank" rel="noopener noreferrer">
        <svg class="share-btn__icon share-btn__icon--x" viewBox="0 0 300 271" aria-hidden="true">
          <path fill="currentColor" d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z" />
        </svg>
        <span>X</span>
      </a>
      <button type="button" class="share-btn share-btn--wide" @click="shareOrCopy">
        <ShareIcon v-if="nativeShare" class="share-btn__icon" />
        <CheckIcon v-else-if="copied" class="share-btn__icon" />
        <LinkIcon v-else class="share-btn__icon" />
        <span>{{ actionLabel }}</span>
      </button>
    </div>
    <span class="share-block__status" aria-live="polite">{{ copied ? t.copied : '' }}</span>
  </aside>
</template>

<script>
/**
 * Share block at the end of each post, used in the post Markdown as
 * `<social-share class="social-share--footer" />`. The `--header` variant used at the top of older
 * posts renders nothing (sharing belongs after reading).
 *
 * LinkedIn and X are plain links (they work without JavaScript). The third button copies the post
 * URL; on touch devices with the Web Share API it opens the phone's share menu instead.
 */
import { LinkedinIcon, LinkIcon, CheckIcon, ShareIcon } from 'vue-feather-icons'

const HOSTNAME = 'https://rafaelneto.dev'

const TEXTS = {
  es: {
    title: '¿Te ha resultado útil? Compártelo:',
    aria: 'Compartir este artículo',
    copy: 'Copiar enlace',
    copied: '¡Copiado!',
    share: 'Compartir…',
  },
  en: {
    title: 'Found it useful? Share it:',
    aria: 'Share this post',
    copy: 'Copy link',
    copied: 'Copied!',
    share: 'Share…',
  },
}

export default {
  name: 'SocialShare',
  components: { LinkedinIcon, LinkIcon, CheckIcon, ShareIcon },

  data() {
    return { nativeShare: false, copied: false }
  },

  computed: {
    isFooter() {
      const classes = (this.$vnode && this.$vnode.data && this.$vnode.data.staticClass) || ''
      return classes.includes('social-share--footer')
    },
    t() {
      return (this.$page.path || '').startsWith('/en/') ? TEXTS.en : TEXTS.es
    },
    url() {
      return `${HOSTNAME}${this.$page.path}`
    },
    linkedinUrl() {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.url)}`
    },
    xUrl() {
      const params = `text=${encodeURIComponent(this.$page.title)}&url=${encodeURIComponent(this.url)}&via=rneto`
      return `https://x.com/intent/tweet?${params}`
    },
    actionLabel() {
      if (this.nativeShare) return this.t.share
      return this.copied ? this.t.copied : this.t.copy
    },
  },

  mounted() {
    // Phones and tablets: the system share menu (WhatsApp, Telegram, email, copy...)
    this.nativeShare = typeof navigator.share === 'function'
      && window.matchMedia('(pointer: coarse)').matches
  },

  beforeDestroy() {
    clearTimeout(this.copiedTimer)
  },

  methods: {
    async shareOrCopy() {
      if (this.nativeShare) {
        try {
          await navigator.share({ title: this.$page.title, url: this.url })
        } catch (e) {
          // Closed by the reader: nothing to do
        }
        return
      }
      await this.copy(this.url)
      this.copied = true
      clearTimeout(this.copiedTimer)
      this.copiedTimer = setTimeout(() => { this.copied = false }, 2000)
    },

    async copy(text) {
      try {
        await navigator.clipboard.writeText(text)
      } catch (e) {
        // Older browsers or no clipboard permission
        const input = document.createElement('textarea')
        input.value = text
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
    },
  },
}
</script>
