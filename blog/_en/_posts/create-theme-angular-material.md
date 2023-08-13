---
date: 2021-10-3
tags:
  - Angular
  - AngularMaterial
  - Sass
summary: Angular Material provides a theming system that allows you to customize the color and typography aspects of its components. This system offers different configuration options based on _Sass_ features, which we will explore below.
permalink: /en/blog/:slug
---

# Creating a Theme for Angular Material

<social-share class="social-share--header" />

[Español](/blog/crear-tema-angular-material/) | English

Angular Material provides a theming system that allows you to customize the color and typography aspects of its components. This system offers different configuration options based on _Sass_ features, which we will explore below.

> It's important to note that I have based this article on the recommendations of Angular Material for version 12, with the latest available revision at the time of writing being 12.2.8.

If you're not yet convinced about using Angular Material, I recommend checking out my article on [Why Use Angular and Material Design?](/en/blog/why-use-angular-material-design/)

And if you're already convinced but don't know where to start, I can help you learn [how to install Angular Material](/en/blog/install-angular-material/).

## What is Sass?

Sass (Syntactically Awesome Style Sheets) is a CSS extension that allows us to define and use variables, nested rules, reusable style functions (_mixins_), and imports, among other features. Once processed, Sass files are compiled into CSS files that are published as part of our application. We can think of Sass as what TypeScript is to JavaScript.

## Color Palette in Angular Material

A color palette in Angular Material is defined as a collection of colors (called hues) that represent a scale of shades. This scale is complemented by an additional collection of contrast colors used in texts when a hue is used as a background. A palette is defined by creating Sass maps with the following structure and usage:

``` scss
$custom-primary-map: (
    50 : #e8eaf6,
    100 : #c5cbe9,
    200 : #9fa8da,
    300 : #7985cb,
    400 : #5c6bc0,
    500 : #3f51b5,
    600 : #394aae,
    700 : #3140a5,
    800 : #29379d,
    900 : #1b278d,
    contrast: (
        50 : #000000,
        100 : #000000,
        200 : #000000,
        300 : #000000,
        400 : #ffffff,
        500 : #ffffff,
        600 : #ffffff,
        700 : #ffffff,
        800 : #ffffff,
        900 : #ffffff,
    )
);

$primary-palette: mat.define-palette($custom-primary-map);
```

_styles.scss_

In the hue map, we can see the range of colors from the lightest (50) to the darkest (900).

In some palettes, you may come across hues labeled as A100, A200, A400, and A700, but Angular Material doesn't require them, so we'll omit them in this case.

> If we want to simplify the process of creating color maps for our palettes, we can use the [Material Design Color Generator](https://github.com/mbitson/mcg) repository. Once we access the tool, we should use the export option called _Angular JS 2 (Material 2)_ since it allows exporting palettes in different formats.

Similarly to generating custom palettes, we can also use any of the [Material Design palettes](https://material.io/archive/guidelines/style/color.html#color-color-palette) included in the package. To do this, we simply include them in our file as follows:

```scss
@use '~@angular/material' as mat;

$primary-palette: mat.define-palette(mat.$teal-palette);
$accent-palette: mat.define-palette(mat.$lime-palette);
$warn-palette: mat.define-palette(mat.$deep-orange-palette);
```

_styles.scss_

Another option is to generate a derived palette from a hue of a Material Design palette:

```scss
@use '~@angular/material' as mat;

$primary-palette: mat.define-palette(mat.$teal-palette, 200);
$accent-palette: mat.define-palette(mat.$lime-palette, 200);
$warn-palette: mat.define-palette(mat.$deep-orange-palette, 200);
```

_styles.scss_

## Custom Themes in Angular Material

The first thing we need to define for creating a theme is the set of three color palettes it will be composed of. These palettes are as follows (if we exclude the third one -_warn_-, red will be used automatically, so we could have only two):

- **primary**: This palette represents the most common color used in the application.
- **accent**: This palette is used to highlight specific parts of the application.
- **warn**: This palette is used for warnings and errors in the application.

How do we use the created palettes?

```scss
@use '~@angular/material' as mat;

// Include Angular Material's common styles
@include mat.core();

// Define custom color maps
$custom-primary-map: (
    50 : #e8eaf6,
    ...,
    contrast: (
        50 : #000000,
        ...,
    )
);

$custom-accent-map: (
    50 : #f9fbe7,
    ...,
    contrast: (
        50 : #000000,
        ...,
    )
);

$custom-warm-map: (
    50 : #f6e7e7,
    ...,
    contrast: (
        50 : #000000,
        ...,
    )
);

// Define palettes based on the custom color maps
$primary-palette: mat.define-palette($custom-primary-map);
$accent-palette: mat.define-palette($custom-accent-map);
$warm-palette: mat.define-palette($custom-warm-map);

// Create the custom light theme object (we could create another for the dark mode)
$custom-theme: mat.define-light-theme((
  color: (
    primary: $primary-palette,
    accent: $accent-palette,
    warn: $warn-palette
  )
));

// Finally, include the theme styles in all our components
@include mat.all-component-themes($custom-theme);

// We could also apply the theme exclusively to specific components
// @include mat.button-theme($custom-theme);
```

_styles.scss_

In addition to color configuration, we can also customize the typography of our theme. To do this, we need to use the Sass function `define-typography-config` to create the configuration, which we pass to the `core` _mixin_ at the beginning of our Sass file:

```scss
@use '~@angular/material' as mat;

// Custom typography
$custom-typography: mat.define-typography-config(
  $font-family:   'Roboto, sans-serif',
  $display-4:     mat.define-typography-level(112px, 112px, 300, $letter-spacing: -0.05em),
  $display-3:     mat.define-typography-level(56px, 56px, 400, $letter-spacing: -0.02em),
  $display-2:     mat.define-typography-level(45px, 48px, 400, $letter-spacing: -0.005em),
  $display-1:     mat.define-typography-level(34px, 40px, 400),
  $headline

:      mat.define-typography-level(34px, 32px, 400),
  $title:         mat.define-typography-level(24px, 32px, 500),
  $subheading-2:  mat.define-typography-level(20px, 28px, 400),
  $subheading-1:  mat.define-typography-level(15px, 24px, 400),
  $body-2:        mat.define-typography-level(16px, 28px, 500),
  $body-1:        mat.define-typography-level(16px, 28px, 400),
  $caption:       mat.define-typography-level(14px, 20px, 400),
  $button:        mat.define-typography-level(16px, 16px, 400),
  $input:         mat.define-typography-level(inherit, 1.125, 400)
);

@include mat.core($custom-typography);

// You should also add the rest of the theme configuration in terms of colors
```

> Don't forget to include the font you use, either as a link in the _index.html_ file or as an import in the Sass file.

## Predefined Themes in Angular Material

Angular Material also provides a set of predefined themes that we can use directly in our application.

Theme | Palettes (primary, accent, warn)
--------|----------------------------
deeppurple-amber.css | deep-purple, amber, red
indigo-pink.css | indigo, pink, red
pink-bluegray.css | pink, bluegray, red
purple-green.css | purple, green, red

To use them, simply include a reference to the corresponding CSS file of the theme you want to use in your _angular.json_ file, both in the _architect.build.options.styles_ and _architect.test.options.styles_ sections:

```json
...,
"architect": {
  "build": {
    ...,
    "options": {
      ...,
      "styles": [
        "./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css",
        "src/styles.scss"
      ],
      ...
    },
    ...
  },
  ...,
  "test": {
    ...,
    "options": {
      ...,
      "styles": [
        "./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css",
        "src/styles.scss"
      ],
      ...
    }
  },
...,
```

## Applying Angular Material Typography to the Application

If you want to apply Angular Material typography to the entire application (beyond Angular Material components), you need to add the _mat-typography_ class to the _body_ element in the _index.html_ file of your application.

---
<social-share class="social-share--footer" />
