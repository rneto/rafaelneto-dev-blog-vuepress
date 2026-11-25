const { shareImage, shareImageAlt } = require('./plugins/shared')

module.exports = {
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#d66056' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/icons/icon-152x152.png' }],
    ['meta', { name: 'msapplication-TileImage', content: '/images/icons/icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#d66056' }],
    ['meta', { property: 'og:site_name', content: 'Rafael Neto' }],
    // Light/dark choice saved by the header switch (theme/components/ThemeToggle.vue), applied before the page paints
    ['script', {}, "try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}"],
    ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-S8PRT356B6' }],
    ['script', {}, [ "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-S8PRT356B6', { 'anonymize_ip': true });" ]]
  ],
  title: 'Rafael Neto',
  description: 'Apuntes de un programador Full Stack, JavaScript, HTML, CSS, .NET',
  base: '/',
  // No `theme` here: VuePress uses the local theme in .vuepress/theme, which extends @vuepress/theme-blog.
  themeConfig: {
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/#modifyblogpluginoptions
     */
    modifyBlogPluginOptions(blogPluginOptions) {
      return blogPluginOptions
    },
    // One tag index per language: /tag/ (Spanish posts) and /en/tag/ (English posts). theme/index.js
    // copies each post's `tags` to `esTags` or `enTags`.
    frontmatters: [
      { id: 'tag', keys: ['esTags'], path: '/tag/', title: 'Tag' },
      { id: 'enTag', keys: ['enTags'], path: '/en/tag/', title: 'Tag' },
    ],
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/config/#directories
     */
    directories: [
      {
        id: "blog",
        dirname: "_posts",
        title: "Blog",
        path: "/blog/",
        itemPermalink: "/blog/:slug"
      },
      {
        id: "en_blog",
        dirname: "_en/_posts",
        title: "Blog",
        path: "/en/blog/",
        itemPermalink: "/en/blog/:slug"
      }
    ],
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/config/#nav
     */
    // Menu of Spanish pages; English pages use localeNav['/en/']. The header adds a first link to
    // the other language (see theme/components/localeNav.js).
    nav: [
      {
        text: 'Blog',
        link: '/blog/',
      },
      {
        text: 'Tags',
        link: '/tag/',
      },
    ],
    localeNav: {
      '/en/': [
        {
          text: 'Blog',
          link: '/en/blog/',
        },
        {
          text: 'Tags',
          link: '/en/tag/',
        },
      ],
    },
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/config/#footer
     */
    // Rendered by theme/components/Footer.vue, which adds the RSS feed of the page's language and
    // links the copyright to the about page in that language
    footer: {
      contact: [
        {
          type: 'x',
          link: 'https://x.com/RNeto',
        },
        {
          type: 'linkedin',
          link: 'https://www.linkedin.com/in/rrneto',
        },
        {
          type: 'github',
          link: 'https://github.com/rneto',
        },
      ],
      copyright: [
        {
          text: `Rafael Neto © ${new Date().getFullYear()}`
        }
      ]
    },
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/config/#summary
     */
    summary: true,
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/config/#summaryLength
     */
    summaryLength: 250,
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/config/#smoothscroll
     */
    smoothScroll: true,
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/config/#dateformat
     */
    dateFormat: 'YYYY-MM-DD',
    NOcomment: {
      service: "vssue",
      prefix: "[Post]",
      owner: "rneto",
      repo: "rafaelneto.dev",
      clientId: "d08327ef8b1457b3432a",
      clientSecret: "b698b4ae39532b21aee0521a9c28af4a83362892"
    },
  },
  locales: {
    '/': {
      lang: 'es-ES',
      title: 'Rafael Neto',
      description: 'Apuntes de un programador Full Stack, JavaScript, HTML, CSS, .NET',
    },
    '/en/': {
      lang: 'en-US',
      title: 'Rafael Neto',
      description: 'Notes from a Full Stack developer, JavaScript, HTML, CSS, .NET'
    }
  },
  plugins: [
    // Must run before 'seo' and 'sitemap': it sets lastUpdated from the frontmatter dates
    [
      require('./plugins/seo-links')
    ],
    // llms.txt, llms-full.txt, Markdown copies of the posts and the English RSS feed
    [
      require('./plugins/ai-content')
    ],
    // Social card image for every post and for the rest of the site (see shareImage in plugins/shared.js)
    [
      require('./plugins/og-images')
    ],
    [
      '@NO-vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: {
          '/': {
            message: "Nuevo contenido disponible.",
            buttonText: "Actualizar"
          }
        }
      }
    ],
    [
      '@NO-vuepress/google-analytics',
      {
        'ga': 'UA-164903805-1'
      }
    ],
    [
      'sitemap',
      {
        hostname: 'https://rafaelneto.dev',
        changefreq: 'weekly',
        // lastUpdated comes from the post frontmatter dates (see plugins/seo-links.js)
        dateFormatter: lastUpdated => new Date(lastUpdated).toISOString()
      }
    ],
    [
      '@vuepress/back-to-top'
    ],
    [
      'vuepress-plugin-nprogress'
    ],
    [
      'reading-progress'
    ],
    [
      'feed',
      {
        canonical_base: 'https://rafaelneto.dev',
        // Only Spanish posts, newest first (the default keeps file order).
        // Runs before permalinks are built, so match the source folder.
        is_feed_page: page => Boolean(page.frontmatter && page.frontmatter.date) && (page.regularPath || '').startsWith('/_posts/'),
        sort: entries => entries.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)),
        feeds: {
          rss2: {
            enable: true,
          },
          atom1: {
            enable: false,
          },
          json1: {
            enable: false,
          },
        },
      }
    ],
    [
      'seo',
      {
        url: (_, $site, path) => 'https://rafaelneto.dev' + path,
        type: (_, $site, path) => /^\/(en\/)?blog\/(?!page\/)[^/]+\/$/.test(path) ? 'article' : 'website',
        // The post's own image, or the card plugins/og-images.js draws for the post or for the site
        // ($page.path is not final yet here: the plugin passes the permalink as `path`)
        image: ($page, $site, path) => shareImage({ path, frontmatter: $page.frontmatter }),
        twitterCard: () => 'summary_large_image',
        author: () => 'Rafael Neto',
        // Posts with an explicit article:modified_time meta already render it
        modifiedAt: $page => (($page.frontmatter.meta || []).some(meta => meta.property === 'article:modified_time')
          ? undefined
          : $page.lastUpdated),
        customMeta: (add, { url, $page }) => {
          const path = url.replace('https://rafaelneto.dev', '')
          const alt = shareImageAlt({ path, title: $page.title, frontmatter: $page.frontmatter })
          add('og:locale', path.startsWith('/en/') ? 'en_US' : 'es_ES')
          add('og:image:alt', alt)
          add('twitter:image:alt', alt)
          // Generated cards are 1200x630; a post's own image may be any size
          if (!$page.frontmatter.image) {
            add('og:image:width', '1200')
            add('og:image:height', '630')
          }
          add('twitter:site', '@rneto')
          add('twitter:creator', '@rneto')
        }
      }
    ],
    [
      '@NO-vssue/vuepress-plugin-vssue',
      {
        platform: 'github-v4',
        owner: 'rneto',
        repo: 'rafaelneto.dev',
        clientId: 'd08327ef8b1457b3432a',
        clientSecret: 'b698b4ae39532b21aee0521a9c28af4a83362892',
      },

    ],
    [
      '@NO-vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          const dayjs = require('dayjs')
          return dayjs(timestamp).locale('lang').format('DD/MM/YYYY')
        }
      }
    ]
  ],
  //evergreen: true,
}
