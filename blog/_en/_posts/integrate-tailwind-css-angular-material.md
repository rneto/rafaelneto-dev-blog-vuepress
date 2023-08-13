---
date: 2021-03-08
tags:
  - Angular
  - AngularMaterial
  - MaterialDesign
  - TailwindCSS
summary: If you are not familiar with Tailwind CSS, Material Design or Angular Material yet, I recommend you ...
permalink: /en/blog/:slug
---

# Integrate Tailwind CSS into Angular and combine it with Material

<social-share class="social-share--header" />

[Español](/blog/integrar-tailwind-css-angular-material/) | English

If you are not familiar with Tailwind CSS yet, I recommend you taking a look at my article on [What is Tailwind CSS?](/en/blog/tailwind-css/).

If you're not familiar with Material Design or Angular Material, I also suggest taking a look at this other article on [Why Use Angular and Material Design?](/en/blog/why-use-angular-material-design/), where I discuss some of the advantages of using them.

We could make use of Tailwind CSS or Angular Material separately, but I believe that in this case, they complement each other perfectly. By using Angular Material, we gain access to a set of advanced components, while also benefiting from a comprehensive toolkit provided by Tailwind CSS. This combination allows us to leverage the advanced components offered by Angular Material alongside the extensive set of additional tools provided by Tailwind CSS.

If you haven't installed Angular Material in your application yet, I suggest following this brief guide on [installing Angular Material](/en/blog/install-angular-material/).

## Installing Tailwind CSS in Angular

From version 11.2 of Angular, **native support for Tailwind CSS is now available**, making it very easy to start enjoying its benefits in our applications:
1. First, we need to make sure we are using Angular version 11.2 or higher. We can update by running `ng update` or following the [Angular update guide](https://update.angular.io/).
   - If we run the `ng update` command, we may receive alerts indicating that we need to separately update Angular CLI with `ng update @angular/cli` and Angular Core with `ng update @angular/core`.

        > Let's keep in mind that starting from version 7 of Angular, the major versions of Angular Core and CLI are aligned, meaning that both need to be the same if we want to use Angular CLI for developing our application.

   - If we simply want the latest minor version of Angular 11, we should run `ng update @angular/cli@11` and `ng update @angular/core@11`, or equivalently `ng update @angular/core@11 @angular/cli@11`. This will update both Angular CLI and Angular Core to the latest version within the Angular 11.x series.

        > Let's remember that minor versions are fully compatible with previous minor versions, so we shouldn't have any issues when transitioning, for example, from version 11.0.0 to 11.2.4.

1. Next, we install Tailwind CSS using the command `npm install -D tailwindcss`.
1. We create the Tailwind CSS configuration file, _tailwind.config.js_, in the root folder of our application using the command `npx tailwindcss init`.
1. We configure Tailwind CSS to remove unused styles in our application:
      ``` js
      module.exports = {
        purge: {
          enabled: true,
          content: ['./src/**/*.{html,ts}'],
        },
        ...
      }
      ```
      _tailwind.config.js_
1. Finally, we import the base styles into our _styles.scss_ file:
    ``` scss
    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';
    ```

From that point onward, we can start using Tailwind CSS in our application.

``` html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>
```
_app.component.html_

## Incompatibilities between Tailwind CSS and Angular Material

Once we have both design systems in the same application, we may encounter situations where certain styles from both systems affect each other.

In the case where we want to prioritize Tailwind CSS styles, we have the option to establish that the properties of its classes take precedence by making the following adjustment in the _tailwind.config.js_ file created in the root folder of our application:

``` js
module.exports = {
  important: true,
  ...
}
```
_tailwind.config.js_

On the contrary, if we want to prioritize Angular Material classes, we should rewrite the styles of Tailwind CSS that we don't want to be affected or even use their own classes to _protect_ the styles of Angular Material components.

This can happen, for example, with buttons, where the base class of Tailwind CSS always adds an outline to them when they receive focus:

``` css
button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}
```

So, we can rewrite that style in our _styles.scss_ file by setting the desired value:

``` scss
button:focus {
  outline: 0;
}
```
_styles.scss_

Or even using a pre-defined class from Tailwind:

``` scss
button:focus {
  @apply outline-none;
}
```
_styles.scss_

There is also the possibility of using a custom Tailwind CSS class in our control to avoid that effect on our Angular Material button:

``` html
<button mat-button class="focus:outline-none">Basic</button>
```

And finally, perhaps the most interesting approach to avoid compatibility issues between both systems (and likely the most suitable for existing projects or those where we want to control the base classes) is to completely disable the _preflight_ styles (which are the styles created to normalize inconsistencies across browsers) of Tailwind CSS with the following modification in the _tailwind.config.js_ file:

``` js
module.exports = {
  corePlugins: {
    preflight: false,
  },
  ...
}
```
_tailwind.config.js_

---
<social-share class="social-share--footer" />
