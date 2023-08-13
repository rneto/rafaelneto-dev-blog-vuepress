---
date: 2020-5-14
tags:
  - Nodejs
  - npm
  - webpack
summary: Webpack is one of the most widely used JavaScript technologies for years to transform and package all kinds of web resources, such as JavaScript, HTML, CSS or images.
permalink: /en/blog/:slug
---

# Using Webpack 4 to transform and package web application resources

<social-share class="social-share--header" />

[Español](/blog/usar-webpack-4-transformar-empaquetar-recursos-aplicacion-web/) | English

[Webpack](https://webpack.js.org/) is one of the most widely used JavaScript technologies for years to transform and package all kinds of web resources, such as JavaScript, HTML, CSS or images.

Its system is based on the chained execution of [loaders](https://webpack.js.org/concepts/loaders/) and [plugins](https://webpack.js.org/concepts/plugins/) that transform and package our files and their dependencies, resulting in new static resources (known as _bundles_) that we will use in our application.

With Webpack we can for example convert ES2015+ to ES5, TypeScript, CoffeeScript, Elm to JavaScript, import images, CSS, JSON or XML styles directly into our JavaScript file, transform our Markdown, Pug, Jade, Twig templates to HTML, convert SCSS, SASS, Stylus, LESS, PostCSS files to CSS and much more.

Starting for example from JavaScript files:

``` javascript
// index.js
const user = require('./user');
console.log(`Hi ${user.getName()}!`);
```

``` javascript
// user.js
const getName = () => {
  return 'Rafael';
};

exports.getName = getName;
```

Webpack would take as input file our _index.js_, parse its dependencies (_user.js_) and generate a new single resource _main.js_ with all the necessary code.

## Installing Webpack globally

In order to install Webpack it is necessary to have previously installed [Node.js](https://nodejs.org/es/).

Installing it globally allows us to access it from anywhere on the terminal.

``` bash
npm install webpack webpack-cli -g
```

This way we will have installed the package, as well as the necessary commands to be able to perform the Webpack operations.

## Installing Webpack locally

If we have not done it yet, we must start npm in the folder of our project to be able to save the dependencies that are installed.

``` bash
npm init
```

We will indicate what is necessary in the questions that the system will ask us or we will press _enter_ to leave the pre-determined values in the new _package.json_ file that will be created.

Then we can install Webpack as a dependency package for development (using the _--save-dev_ or _-D_ option), since it is a package that we will only use during the creation (_build_) of our application.

``` bash
npm i --save-dev webpack webpack-cli
```

## Configuring and packaging with Webpack

It is possible to use Webpack from the command line with all the options we need to be able to transform and package our resources, but in practice, it is best to generate a configuration file _webpack.config.js_ in the root directory of our project.

For our previous example of two JavaScript files _index.js_ and _user.js_, it would be enough to generate the following content in the configuration file.

``` javascript
// webpack.config.js
module.exports = {
  entry: './index.js'
};
```
We would also take the opportunity to add a new script to the _package.json_ file to simplify Webpack execution.

``` bash
{
  ...
  "scripts": {
    ...,
    "build": "webpack"
  },
  ...
}
```

Now, when we run the ```npm run build``` command in our directory, it will package our files by default in _./build/main.js_.

You can check all the code of the previous example in [GitHub](https://github.com/rneto/webpack-4-basic-js-build-test).

---
<social-share class="social-share--footer" />
