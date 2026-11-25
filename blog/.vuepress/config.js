const { shareImage, shareImageAlt } = require('./plugins/shared')

module.exports = {
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#d66056' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/icons/icon-152x152.png' }],
    ['meta', { name: 'msapplication-TileImage', content: '/images/icons/icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    ['meta', { property: 'og:site_name', content: 'Rafael Neto' }],
    ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-S8PRT356B6' }],
    ['script', {}, [ "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-S8PRT356B6', { 'anonymize_ip': true });" ]]
  ],
  title: 'Rafael Neto',
  description: 'Apuntes de un programador Full Stack, JavaScript, HTML, CSS, .NET',
  base: '/',
  theme: '@vuepress/theme-blog',
  themeConfig: {
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/#modifyblogpluginoptions
     */
    modifyBlogPluginOptions(blogPluginOptions) {
      return blogPluginOptions
    },
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
    nav: [
      {
        text: 'English',
        link: '/en/blog/',
      },
      {
        text: 'Blog',
        link: '/blog/',
      },
      {
        text: 'Tags',
        link: '/tag/',
      },
    ],
    /**
     * Ref: https://vuepress-theme-blog.billyyyyy3320.com/config/#footer
     */
    footer: {
      contact: [
        {
          type: 'twitter',
          link: 'https://x.com/RNeto',
        },
      ],
      copyright: [
        {
          text: "Rafael Neto © 2025",
          link: "/index.html"
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
      'social-share',
      {
        networks: ['twitter'],
        twitterUser: 'rneto',
        fallbackImage: '/images/logo.png',
        isPlain: false,
        noGlobalSocialShare: true,
      },
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
