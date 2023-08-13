---
date: 2021-9-16
tags:
  - Angular
  - Nodejs
  - npm
  - webpack
summary: Beyond the optimization of an Angular application through for example the deferred loading of modules or by using a change detection strategy based on OnPush, we must also take into account ...
permalink: /en/blog/:slug
---

# Optimizing Angular by analyzing npm packages with webpack

<social-share class="social-share--header" />

[Español](/blog/optimizar-angular-analisis-paquetes-npm-webpack/) | English

Beyond the optimization of an Angular application through for example the [deferred loading of modules](/en/blog/architecture-best-practices-angular/#lazy-loading) or by using a change detection strategy based on _OnPush_, we must also take into account the fact that the third-party packages that we include, will also affect the loading time of the application, either by their own size or even by their initialization time. That is why optimizing Angular by analyzing npm packages should also be one of our goals before putting the application into production.

At the speed at which our work environment moves, we are sure that we can think of packages that we have stopped using (in my case for example I have replaced _ng-zorro_ by [Tailwind CSS with Angular Material](/en/blog/integrate-tailwind-css-angular-material/)) and that may in some cases have remained as an imported dependency in the code without us realizing it. There are also packages that covered needs that the language already supports (such as using _lodash_ instead of [high-level JavaScript methods like map,_filter,_reduce,_some, every o_forEach](/en/blog/optimizing-javaScript-loops/)), but whose dependency was not removed during the refactoring iterations. And let's not forget those third-party package dependencies that serve to cover simple functionalities that we could implement ourselves with little effort if we knew how much such a package increases the size of our application.

## How to analyze the packages of our Angular application?

[Webpack](/en/blog/using-webpack-4-transform-package-web-application-resources/) has a feature that consists in generating a visual map of the webpack package composition and since this is the default tool for Angular CLI module packaging, why not take advantage of it?

### Installation

First of all, we will add the necessary package to our development dependencies:

``` bash
npm install --save-dev webpack-bundle-analyzer
```

### Configuración de scripts

Next we will modify the _package.json_ file of our application to simplify the process of generating the package analysis:

``` js
...,
  "scripts": {
    ...,
    "stats": "ng build --stats-json & webpack-bundle-analyzer dist/my-app/stats.json"
  },
...,
```
_package.json_

### Package analysis

From this point on, we have automated the analysis and visualization of our package map by means of the following command:

``` bash
npm run-script stats
```

And this will be the result that we will see in our browser:

![Interactive map of packages with webpack](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)
_Interactive map of packages with webpack_.

With this information we can now know what is inside the packages, which modules occupy more space and which modules should not be there, so go ahead with the optimization.

---
<social-share class="social-share--footer" />
