<template>
  <div class="not-found">
    <template v-if="ready">
      <h1>{{ t.title }}</h1>
      <p>{{ t.text }}</p>
      <p class="not-found__actions">
        <RouterLink :to="english ? '/en/blog/' : '/blog/'" class="not-found__button">{{ t.blog }}</RouterLink>
        <RouterLink :to="english ? '/en/' : '/'" class="not-found__button not-found__button--secondary">{{ t.about }}</RouterLink>
      </p>
      <h2>{{ t.latest }}</h2>
      <latest-posts :lang="english ? 'en' : 'es'" :count="5" />
      <p class="not-found__other" :lang="english ? 'es' : 'en'">
        {{ t.other }} <RouterLink :to="english ? '/blog/' : '/en/blog/'">{{ t.otherLink }}</RouterLink>
      </p>
    </template>
  </div>
</template>

<script>
/**
 * Page shown for any missing URL (GitHub Pages serves 404.html). The language comes from the URL
 * (/en/... is English), so the content is rendered in the browser only: the prerendered 404.html
 * cannot know it.
 *
 * Before showing anything, /tag/<tag>/ goes to /en/tag/<tag>/ when the tag only exists in English
 * (tags are split by language; old links pointed to /tag/ for both). Old links with other letter
 * case are handled by the router guard in enhanceApp.js.
 */
const TEXTS = {
  es: {
    title: 'Página no encontrada',
    text: 'La página que buscas no existe o ha cambiado de dirección. Prueba con el buscador o empieza por aquí:',
    blog: 'Ir al blog',
    about: 'Sobre mí',
    latest: 'Últimos artículos',
    other: 'Looking for the English version?',
    otherLink: 'Go to the English blog',
  },
  en: {
    title: 'Page not found',
    text: "The page you're looking for doesn't exist or has moved. Try the search box or start here:",
    blog: 'Go to the blog',
    about: 'About me',
    latest: 'Latest posts',
    other: '¿Buscas la versión en español?',
    otherLink: 'Ir al blog en español',
  },
}

function decode (path) {
  try {
    return decodeURIComponent(path)
  } catch (e) {
    return path
  }
}

export default {
  name: 'NotFound',

  data() {
    return { ready: false }
  },

  computed: {
    english() {
      return this.$route.path.startsWith('/en/')
    },

    t() {
      return TEXTS[this.english ? 'en' : 'es']
    },
  },

  mounted() {
    const target = this.redirectTarget()
    if (target) {
      this.$router.replace(target + window.location.hash)
      return
    }
    this.ready = true
    document.title = `${this.t.title} | ${this.$site.title}`
  },

  methods: {
    redirectTarget() {
      const tag = decode(this.$route.path).match(/^\/tag\/([^/]+)\/?$/)
      if (!tag) return null
      const english = `/en/tag/${tag[1]}/`.toLowerCase()
      const page = this.$site.pages.find(p => decode(p.path).toLowerCase() === english)
      return page ? page.path : null
    },
  },
}
</script>
