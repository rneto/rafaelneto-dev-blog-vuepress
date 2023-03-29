---
date: 2021-6-17
tags:
  - Nodejs
  - npm
permalink: /en/blog/:slug
canonicalUrl: https://rafaelneto.dev/blog/configurar-variables-entorno-package-json-windows/
---

# Configuring the use of environment variables in package.json for Windows

<social-share class="social-share--header" />

[Español](/blog/configurar-variables-entorno-package-json-windows/) | English

For those of us who are Windows users and at the same time developers of applications with _Node.js_, it is common that we encounter problems that Linux/MAC users are happily unaware of (others have for sure...).

One such problem is related to the use of environment variables defined in the configured scripts of our _package.json_ files:

``` bash
{
  ...,
  "scripts": {
    ...,
    "generate-es-v1": "LANGUAGE=ES VERSION=1 npx nuxt generate",
    "generate-es-v2": "LANGUAGE=ES VERSION=2 npx nuxt generate",
    "generate-en-v1": "LANGUAGE=EN VERSION=1 npx nuxt generate",
    "generate-en-v2": "LANGUAGE=EN VERSION=2 npx nuxt generate",
    ...
  },
  ...,
}
```
_package.json_

In this case, when we run the `npm run generate-en-v1` command from the Windows console, we will get the error _'LANGUAGE' is not recognized as an internal or external command, operable program or batch file_.

## _cross-env_ to the rescue

One way to solve this problem is to make our scripts _multiplatform_ by adding the [cross-env]( https://github.com/kentcdodds/cross-env) package as an additional development dependency to our project. This package will take care of adding our environment variables before our script is executed.

1. Install the package with `npm install --save-dev cross-env`.
1. Add a new `cross-env` command at the beginning of our scripts:
    ``` bash
    {
      ...,
      "scripts: { ..., {
        ...,
        "generate-en-v1": "cross-env LANGUAGE=EN VERSION=1 npx nuxt generate",
        "generate-en-v2": "cross-env LANGUAGE=EN VERSION=2 npx nuxt generate",
        "generate-en-v1": "cross-env LANGUAGE=EN VERSION=1 npx nuxt generate",
        "generate-en-v2": "cross-env LANGUAGE=EN VERSION=2 npx nuxt generate",
        ...
      },
      ...,
    }
    ```
And finally run our script as we had planned `npm run generate-en-v1`.

It is true that the _cross-env_ project was put into maintenance mode at the end of 2020 so no new features will be added, however, it is still completely valid as they will continue to fix bugs and update for future versions of Node.js.

In any case, we will always have the option of using the [Windows subsystem for Linux]( https://docs.microsoft.com/en-us/windows/wsl/about), do you dare?

---
<social-share class="social-share--footer" />
