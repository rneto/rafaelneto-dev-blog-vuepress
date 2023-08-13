---
date: 2020-12-19
tags:
  - Angular
summary: In this article, you will find the proposal for a possible evolution of architecture concepts in an Angular application, which can be derived from the official Angular Style Guide.
permalink: /en/blog/:slug
canonicalUrl: https://rafaelneto.dev/blog/arquitectura-buenas-practicas-angular/
---

# Architecture and best practices for an Angular application

<social-share class="social-share--header" />
<last-updated custom-value="22/10/2021" />

[Español](/blog/arquitectura-buenas-practicas-angular/) | English

In this article, you will find the proposal for a possible evolution of architecture concepts in an Angular application, which can be derived from the [official Angular Style Guide](https://angular.io/guide/styleguide). For this purpose, I have defined a series of guidelines and best practices for planning and structuring our application with the goal of making it scalable.

> Scalability in an Angular application involves supporting the increase in data size loaded in the application, which increases project complexity and size and is generally followed by longer loading times.

## Application Structure

We will follow a module-oriented project structure. With this officially recommended approach, modules are clearly visible in the folder tree as separate directories, and each module contains all the files related to that specific module.

```
app/
|- core/
   |- core.module.ts
   |- services/
      |- auth.service.ts
   |- core-routing.module.ts
   |- core.module.ts
   |- index.ts
|- feature1/
   |- components/
      |- component1/
         |- ...
         |- component1.component.ts
      |- component2/
         |- ...
      |- shared/
         |- ...
   |- models/
      |- ...
   |- services/
      |- ...
   |- feature1-routing.module.ts
   |- feature1.module.ts
   |- index.ts
|- feature2/
   |- ...
|- feature3/
   |- ...
|- shared/
   |- components/
      |- component1/
         |- ...
         |- component1.component.ts
      |- component2/
         |- ...
   |- models/
   |- pipes/
      |- pipe1.pipe.ts
   |- index.ts
   |- shared.module.ts
|- app-component.ts
|- app.module.ts
```

As we can see, there are threee main modules in the project:

- AppModule_: is the main module of the application, responsible for its startup and the combination of other modules.
- CoreModule_: includes the basic functionalities of the application, mostly global services, which will be used throughout the application globally. It must not be imported by the application functionality modules.
- _SharedModule_: is normally a set of components or services that will be reused in other modules of the application, but that are not applied globally in the application. It can be imported by the functionality modules.

The third of these modules is included in the so-called [application functionality modules](https://angular.io/guide/feature-modules). These modules will be isolated from each other and will be located in specific directories under the root directory of the application.

Functionality modules are classified into [six types](https://angular.io/guide/module-types) with the objective of separating responsibilities into:
- _Domain_: provides a user experience dedicated to a particular application domain, such as editing a customer or placing an order.
- _Router_: is the domain module that acts as the main component of the functionality and whose purpose is to route the user's navigation through the functionality. By definition, all lazy loading modules are routed functionality modules.
- _Routing_: provides routing configuration for another module and separates routing concerns from its complementary module.
- _Service_: provides utility services such as data access and messaging.
- _Complement_: makes components, directives and other widgets available to external modules. Many third-party _UI_ component libraries are plug-in modules (_widgets_).
- _Shared_: allows reusing application parts such as directives, transformers (_pipes_) and components. It is the module that we commonly call _SharedModule_.

This structure allows the separation of responsibilities in a clear way, besides being the starting point for the implementation of the deferred loading of the application contents, a fundamental step for the preparation of a scalable architecture.

### AppModule

- This module occupies the root of the application folder and should contain only the most elementary.
- Its function is simply to start the Angular application and provide the output of the root path (_router-outlet_). **This approach also leaves open the possibility of running multiple independent Angular applications through the same base URL.**
- It will import the _CoreModule_ and _SharedModule_ modules.

### CoreModule

- Its purpose is to collect all the services that have to have a single instance in the application (_singleton_ services) in a single module. This is the case for example of the authentication service or the user service.
- The _CoreModule_ will be imported only in the _AppModule_ module in order to reduce the complexity of this module and emphasize its role as a simple application orchestrator.

> How to make sure that _CoreModule_ is only imported from the _AppModule_? By controlling it through its constructor.

``` js
  constructor (@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
```
_core.module.ts_

- Since Angular 6, the preferred way to create a _singleton_ service is by indicating in the service itself, that it should be provided in the root of the application. To do this, the _providedIn_ property must be set to _root_ in the _@Injectable_ decorator of the service. In this way, it is not necessary to explicitly indicate in the _providers_ property of the _NgModule_ decorator of _CoreModule_ our _singleton_ services.

``` js
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
}
```
_auth.service.ts_

> **TIP ·** We can enhance the reusability of _CoreModule_ services and functionalities in other applications by creating a new _core_ directory in the root of the application and moving each _CoreModule_ functionality to a new module.

### SharedModule

- All shared components, services and _pipelines_ must be implemented in this module.
- You will not import or inject services or other features from the _CoreModule_ or other features into your constructors.
- You may define services that should not be persistent.
- Your components must receive all data through attributes in the model of the component that uses them. All this is summarized in the fact that _SharedModule_ has no dependency on the rest of our application.
- It is the module in which for example we should import and re-export the Angular Material components and the _CommonModule_, _FormsModule_ and _FlexLayoutModule_ modules.

> **TIP ·** We can enhance the reuse of _SharedModule_ interface components in other applications by creating a new _ui_ directory in the root of the application and moving each group of _SharedModule_ components to a new module.

### Feature modules

- We will create multiple feature modules for each independent feature of our application.
- Feature modules should only import services from _CoreModule_ or _SharedModule_, so if the _feature1_ feature module needs to import a service from the _feature2_ module, it will be necessary to move that service to the _CoreModule_.
- They may contain their own artifacts (services, interfaces or models among others) as long as they are unique to the module itself.
- It will allow us to make sure that changes in a feature cannot affect or interrupt the rest of our application.

## Routing

Angular's router (_[Router](https://angular.io/guide/router)_) allows navigation from one view to the next. In our case, we are not going to add routes to the root component (_AppComponent_), but when the application starts, the _CoreRoutingModule_ (declared in _app/core/core-routing.module.ts_) will be activated and load the necessary components.

> _CoreModule_ handles the root routing of the application, so in theory, we should be able to import a new _Core2Module_ into _AppModule_ which could represent a new version of the application and the implementation of this application would have no impact on the application running through _CoreModule_.

In _CoreRotingModule_ the input paths to the functionality modules will be configured, within which the paths declared in the module itself will be used to navigate and display the content within the URL of the module itself.

> Functionality modules are modules with their own routing and are created to separate and organize the different areas of the application. That is why they are loaded only once, either from the root routing or through deferred loading.

When the user navigates to a protected area of the application, the _AuthGuardService_ of the _CoreModule_ will check the _canActivate_ conditions and will only load the module deferred if the user is authenticated.

``` js
const routes: Routes = [
  {
    path: 'feature1',
    loadChildren: () => import('./feature1/feature1.module').then(m => m.Feature1Module),
    canActivate: [AuthGuardService]
  },
  {
    path: 'feature2',
    loadChildren: () => import('./feature2/feature2.module').then(m => m.Feature2Module),
    pathMatch: 'full'
  },
 ...
```
_core-routing.module.ts_

### Lazy loading

To avoid possible performance problems when loading the application, we will make use of the _lazy loading_ pattern (_[Lazy-Loading](https://angular.io/guide/lazy-loading-ngmodules)_), a capability built into Angular that allows postponing the loading of a particular part of the application until it is really needed.

It is enough to correctly define the module paths, so that it points to a module file that will be loaded only when it is really needed.

``` js
const routes: Routes = [
  {
    ...
    loadChildren: () => import('./feature1/feature1.module').then(m => m.Feature1Module),
    ...
  },
 ...
```
_core-routing.module.ts_

Thanks to the defined module structure, our functionality modules can be loaded in a deferred way once the application is initialized, which will greatly reduce the application startup time. In addition, when the application grows and more modules are added, the core package of the application and therefore its startup time will remain the same.

## Data flow and component types

In Angular, the preferred data flow is unidirectional where data flows from _top to bottom_, much easier to maintain and follow than bidirectional linking. Data flows from the primary parent component to the secondary child component and from the child component to the template.

> The separation of component responsibilities into levels facilitates reuse, maintenance and validation (unit testing).

When it is necessary to structure components by levels, the following guidelines should be followed.

- **_N-level components_**
  - They define the parts of the application that contain part of the logic, communication with services and cause side effects (such as service calls or status updates). It is the one that injects the service and uses it to obtain the data.
  - They are the containers of the components to which the data will be transferred through their attributes.
  - From the routing point of view, we could consider them as the input components of the routes of the module itself, so each component would be associated to a route of the module.
  - Care should be taken to keep the number of components of this type as small as possible.
- **_Level N+1 components_**
  - They are components with little or no logic.
  - All the input data they need is passed through their _@Input_ parameters.
  - If the component wants to communicate outward, it must emit an event through the _@Output_ attribute.
  - The more components we have of this type the simpler the data flow will be and the easier it will be to work with.
  - The change detection strategy for these components can be set to [_onPush_](https://blog.mgechev.com/2017/11/11/faster-angular-applications-onpush-change-detection-immutable-part-1/), which will trigger the change detection process for the component only when the input properties have been modified. This is an easy to implement and very efficient method for optimizing Angular applications.

> If we manage to strike a balance between the right number of components and the single responsibility principle, the simpler the data flow will be and the easier it will be to work with.

## Administración de estado

As a general rule, the state of the application is shared transversely throughout its architecture and its information affects multiple components and even screens at the same time. This is why state operations are often complex in an Angular application, where they can also be performed frequently.

One of the ways to address these problems is to take advantage of application-wide unidirectional data flow. The Angular community has widely adopted the _[Redux](https://github.com/ngrx/platform)_ architecture pattern, originally created for _React_ applications.

The idea behind _[Redux_ is that all application state is stored in a single _[store](https://ngrx.io/guide/store)_, the object that represents the current state of the application. A _store_ is immutable, it cannot be modified, every time a state needs to be changed, a new object has to be created.

A single reference point for all the state of the application simplifies the problem of synchronization between different parts of the application. You don't have to look for a certain information in different modules or components, everything is available in the _store_.

> If you want to have a centralized, simple and inexpensive storage solution, I also recommend you take a look at this other article I created about [Managing the state of an Angular application using RxJs BehaviorSubject for observable data services](/en/blog/manage-state-angular-rxjs-behaviorsubject-observables-data-services/).

## Aliases for the application and environment

Using an alias for our application's folders and environments will allow us to perform imports in a cleaner and more consistent way throughout the evolution of our application.

The use of an alias would allow us to simplify the way we perform our imports:

``` js
import { AuthService } from '../../../.../core/services/auth.service';

[vs]

import { AuthService } from '@app/core';
```

**IMPORTANT:** The following technique should be used with extreme caution. I have encountered execution errors in some complex application by abusing it, due to the order of the artifact exports in the _index.ts_ files (which we will see later), as well as by the inclusion in them of files that caused circular dependencies (such as some modules).

First we must configure the _baseUrl_ and _paths_ properties in our _tsconfig.json_ file as follows (you will see that we are creating an alias for the whole application and another one for the _environments_):

``` js
{
  ...
  "compilerOptions": {
    ...
    "baseUrl": "src",
    "paths": {
      "@app/*": ["app/*"],
      "@env/*": ["environments/*"]
    }
  }
}
```
_tsconfig.json_

Next, we must add an _index.ts_ file for each package (it will be named after the physical folder that contains it) that we want to import and within which we will export all the public entities that we want to include in that package.

``` js
export * from './core.module';
export * from './services/auth-guard.service';
export * from './services/auth.service';
```
_app/core/index.ts_

This file could be further simplified if we extrapolate the creation of _index.ts_ files in the rest of our artifact folders.

``` js
export * from './auth-guard.service';
export * from './auth.service';
```
_app/core/services/index.ts_

``` js
export * from './core.module';
export * from './services';
```
_app/core/index.ts_

> In case VSCode does not recognize our aliases when using them in the _import_, we must restart our TypeScript server. To do this in VSCode press _Cmd/Ctrl + Shift + P_, type _Typescript: Restart TS Server_ and press _Enter_.

## Optimization through package analysis

An additional strategy to those already mentioned to increase the optimization of our Angular application is to perform the [npm packages analysis with webpack](/en/blog/optimize-angular-analyzing-npm-packages-webpack/).

## Sass

I am in favor of setting _[Sass](https://sass-lang.com/)_ as the CSS styling preprocessor to use. In addition to the advantages of Sass, it allows us to integrate in a more effective way the official component library of Angular Material as well as its extensive customization capabilities.

To do this, we must indicate it in the creation of the project:

```
ng new scss-project --style=scss
```

Or set it in the default styles of an existing project:

```
ng config schematics.@schematics/angular:component.styleext scss
```

_@schematics/angular is the default schema for Angular CLI_
_It will also be necessary to rename the extension of all css stylesheets to scss._

## Manual compilation for production

Given the production compilation limitations offered by default by _Angular CLI_ in the _package.json_ file, we must make a small customization in this file to be able to compile the application with specific options for production integration.

``` js
{
  ...
  "scripts": {
    ...
    "build:prod": "ng build --prod --build-optimizer",
    ...
  }
  ...
}
```
_package.json_

_[ng build](https://angular.io/cli/build)_

## Commits and changelog

To get a quick overview of what are the new features and bug fixes of the project, we should make use of the _CHANGELOG.md_ file.

As adding the changes manually to the file would be a tedious task, it is best to automate the process. In our case we are going to use the [**standard-version**] tool (https://github.com/conventional-changelog/standard-version).

This tool automatically generates and updates the _CHANGELOG.md_ file based on the [Conventional Commits](https://conventionalcommits.org/) specification (based in turn on the [Angular convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#commit)), which indicates how to standardize the commits of all the modifications of our application and which correctly determines the new version of our project.

_Conventional Commits_ defines the `type` (mandatory), the `scope` (optional), followed by the `confirmation message`. It is also possible to add `body` and `footer` (optional), both separated by a blank line.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```
_format_

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```
_example_

```
refactor!: drop support for Node 6
```
_example_

```
docs: correct spelling of CHANGELOG
```
_example_

```
feat(lang): add Spanish language
```
_example_

```
fix: correct minor typos in code

see the issue for details

on typos fixed.

Reviewed-by: Z
Refs #133
```
_example_

**Summary of types**
- _build_: Change affecting system compilation or external dependencies
- _ci_: CI configuration changes
- _docs_: Changes only in the documentation
- _feat_: A new feature
- _fix_: A bug fix
- _perf_: A code change that improves performance
- _refactor_: A code change that neither fixes a bug nor adds a feature
- _style_: Changes that do not affect the meaning of the code (whitespace, formatting, a missing semicolon, etc.)
- _test_: Adding missing tests or correcting existing tests

## Angular Material

[Angular Material](https://material.angular.io/) is a web component library based on Material Design and created by the Angular team itself. Here I explain [Why use Angular and Material Design](/en/blog/why-use-angular-material-design/).

### Sidenav

The _sidenav_ component is used to add content to the sides of a full screen application.

The basic structure of the component usage is as follows:

``` html
<mat-sidenav-container>
  <mat-sidenav>Sidenav content</mat-sidenav>
  <mat-sidenav-content>Main content</mat-sidenav-content>
</mat-sidenav-container>
```

#### Detection of _scroll_ event

In case we want to detect the _scroll_ event on the content of _mat-sidenav-content_, we should not add that node to the template since it will be generated automatically with the _cdkScrollable_ directive already added to it. If you use _mat-sidenav-content_ in your template, the _scrollable_ object will be _undefined_.

You also need to use the _AfterViewInit_ event instead of _OnInit_ to prevent the _scrollable_ object from being _undefined_.

``` js
import { Component, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { MatSidenavContainer } from '@angular/material';

export class SidenavComponent implements AfterViewInit {

  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;
  scrolledContent: boolean = false;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled().subscribe(() =>
      {
        this.onSidenavContainerScroll();
      });
  }

  private onSidenavContainerScroll() {
    const scrollTop = this.sidenavContainer.scrollable.getElementRef().nativeElement.scrollTop || 0;
    if (scrollTop > 10 && this.scrolledContent === false) {
      this.ngZone.run( () => { this.scrolledContent = true; });
    } else if (scrollTop <= 10 && this.scrolledContent === true) {
      this.ngZone.run( () => { this.scrolledContent = false; });
    }
  }

}
```
_sidevav.component.ts_

> [NgZone](https://angular.io/api/core/NgZone) allows us to run our work in the Angular zone. In the _sidevav.component.ts_ example we use it so that a child component is notified that the _scrolledContent_ variable has changed.

---
<social-share class="social-share--footer" />
