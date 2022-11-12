---
date: 2020-5-08
tags:
  - VuePress
  - Vuejs
  - blog
summary: VuePress is a powerful static website generator based on Vue.js. It combines the use of markdown, Vue and webpack ...
permalink: /en/blog/:slug
---

# Create a static blog with VuePress

<social-share class="social-share--header" />

[Español](/blog/crear-blog-estatico-vuepress/) | English

[VuePress](https://vuepress.vuejs.org) is a powerful static website generator based on [Vue.js](https://vuejs.org/). It combines the use of **markdown**, **Vue** and **webpack** to generate pre-rendered static HTML for each page, which is executed as a SPA once Vue takes over after a page loads.

One of the key points for choosing VuePress is the variety of existing plugins, which allow you to add functionality globally. You can find a complete list of the plugins at [Awesome VuePress Plugins](https://github.com/vuepressjs/awesome-vuepress#plugins).

## Quick start

The easiest way to get started with the creation of our blog is to use the npm package (no installation required) [create-vuepress](https://github.com/vuepressjs/create-vuepress), which allows us to create a scaffolding of a VuePress project based on the default blog theme for [VuePress](https://vuepress-theme-blog.ulivz.com).

Step 1. Create the scaffolding of the blog

``` bash
yarn create vuepress [miBlog]

# And we answer the following CLI questions:

# ? Select the boilerplate type blog

# ? What's the name of your project? My blog

# ? What's the description of your project? My blog

# ? What's your email? myblog@gmail.com

# ? What's your name? My Blog

# ? What's the repo of your project. https://github.com/myblog/myblog

cd [myBlog] && yarn
```

> Currently, [create-vuepress](https://github.com/vuepressjs/create-vuepress) does not install the lastest version of `@vuepress/theme-blog`, so you need to update it manually by running `yarn add @vuepress/theme-blog -D`.

Step 2. Run and create

``` bash
# Run localhost
yarn dev
# By default, the VuePress development server will be listening at http://localhost:8080/

# Create the blog
yarn build
# The blog files will have been generated in the `.vuepress/dist` folder.
```

---
<social-share class="social-share--footer" />
