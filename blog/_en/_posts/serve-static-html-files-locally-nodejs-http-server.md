---
date: 2020-5-10
tags:
  - Nodejs
  - npm
  - HTTPServer
summary: Often we need to serve static HTML files locally, without having to install and configure an HTTP server for such simple content.
permalink: /en/blog/:slug
---

# Serve static HTML files locally with Node.js and http-server

<social-share class="social-share--header" />

[Español](/blog/servir-archivos-html-estaticos-localmente-nodejs-http-server/) | English

Often we need to serve static HTML files locally, without having to install and configure an HTTP server for such simple content.

Some quick alternatives could be to directly open the HTML file in our favorite web browser, make use of the [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) extension from Google Chrome or use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension from Visual Studio Code, however, if we want to take steps towards [Node.js](https://nodejs.org/en/) and take advantage of its potential, one of the easiest ways to locally serve the content of a directory is using the **[http-server](https://www.npmjs.com/package/http-server)** package which offers us a simple, powerful and zero effort HTTP **server with zero initial configuration**.

The first thing you need to do is install the package. You can do this globally if you want to serve the contents of any directory.

``` bash
npm install http-server -g
```

Or install it as its own dependency inside the project/directory to use it exclusively in it.

``` bash
npm install http-server
```

Once installed, we locate ourselves in the directory where we have our static content and we start the http server.

``` bash
http-server
```

From this moment on, we will be able to access the content of our directory through port 8080 by default through some of the IPs offered.

``` bash
Starting up http-server, serving ./
Available on:
  http://192.168.56.1:8080
  http://10.8.0.10:8080
  http://192.168.1.39:8080
  http://127.0.0.1:8080
Hit CTRL-C to stop the server
```

## Open browser automatically after http-server startup

Whether we add the http-server package as a dependency within our project/directory or if we add it globally, it is possible to make our default browser automatically open with our _index.html_ page once the server is started.

To do this we must make use of the _package.json_ that we must have in our directory.

> A simple way to create a _package.json_ file is to execute the command ```npm init```` in the directory where we want to create it and answer the questions of the questionnaire (we can simply press _intro_ to leave them all with the default answer).

We must add a new script to the _package.json_ file (in the following example _start_) to start the server and in turn open the browser with the default page _index.html_ (http-server defaults to that file for any directory request).

``` bash
{
  ...
  "scripts": {
    ...,
    "start": "http-server -o"
  },
  ...
}
```

Now, when we run the ```npm start`` command in our directory, the server will start and in turn our default web browser will open with the _index.html_ page of our directory.

---
<social-share class="social-share--footer" />
