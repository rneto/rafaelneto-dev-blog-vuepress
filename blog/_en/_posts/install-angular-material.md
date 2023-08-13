---
date: 2021-10-3
tags:
  - Angular
  - AngularMaterial
summary: The installation of Angular Material is fully guided throuth Angular CLI, so when we run the command `ng add @angular/material` in our application, we will be able to install everithing that is needed.
permalink: /en/blog/:slug
---

# Install Angular Material

<social-share class="social-share--header" />

[Español](/blog/instalar-angular-material/) | English

The installation of [Angular Material](https://material.angular.io/) is fully guided throuth Angular CLI, so when we run the command `ng add @angular/material` in our application, we will be able to install everithing that is needed.

One of the most important parts of the installation is when we are asked about the theme we want to use in our application. For that, the installer gives us the option to select one of the predefined themes (_Indigo/Pink_, _Deep Purple/Amber_, _Pink/Blue Grey_ or _Purple/Green_) or our own custom theme.

> If you're interested in learning how to create a custom theme, I recommend cheking out this other article on [how to create a theme for Angular Material](/en/blog/create-theme-angular-material/).

In addition to the theme, we will also be asked if we want to apply Angular Material typography to the entire application and if we need to enable animations for Angular Material.

Once the instalation is complete, the following changes will have been made to our project:

- All the necessary dependencies will have been added to the _package.json_ file.
- If a predefined theme was selected, the _angular.json_ file will be modified to include the corresponding style sheet (e.g., _"./node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css"_) in the styles lists under the _architect.build.options.styles_ and _architect.test.options.styles_ sections.
- If a custom theme was selected, the _styles.scss_ file will be modified to include an example custom theme based on the _Indigo/Pink_ theme. This allows us to make the necessary changes for our theme.
- Basic styles for the _html_ and _body_ elements will be added to the _styles.scss_ file.
- The necessary references to Google fonts will be added to the _index.html_ file.
- If applying Angular Material typography to the entire application was selected, the _mat-typography_ class will be added to the _body_ element in the _index.html_ file.
- If enabling Angular Material animations was selected, the _BrowserAnimationsModule_ module will be added to the imports in the _app.module.ts_ file. Otherwise, the _NoopAnimationsModule_ module will be added.

Once we have everything set up, we can start using Angular Material by importing the modules of the components we want to include in our application:

``` ts
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
…
const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSliderModule
];

@NgModule ({....
  imports: [...,
  ...materialModules
  ]
})
```
_app.module.ts (or any other module)_

And thus, we can start integrating them into our components:

``` html
<mat-slider min="1" max="100" step="1" value="1"></mat-slider>

<button mat-button>Botón</button>

<mat-card>
  <mat-calendar></mat-calendar>
</mat-card>
```
_app.component.html_

---
<social-share class="social-share--footer" />
