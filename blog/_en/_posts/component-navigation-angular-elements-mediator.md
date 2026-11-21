---
date: 2026-11-21
tags:
  - Angular
  - AngularElements
  - WebComponents
  - DesignPattern
summary: Angular Elements is an Angular feature that allows us to create reusable web components that can be integrated into any web application without depending on Angular. Let's see how to navigate between its views with the Mediator pattern ...
permalink: /en/blog/:slug
---

# Navigation between components with Angular Elements and the Mediator pattern

<social-share class="social-share--header" />

[Español](/blog/navegacion-componentes-angular-elements-mediator/) | English

Angular Elements is an Angular feature that allows us to create reusable web components that can be integrated into any web application without depending on Angular. Given its flexibility, we can use it to define simple components that are reusable in other projects, but we can also use it to add new complex and complete features to other projects with hardly any changes to them. All of this is achieved thanks to Web Components, a set of technologies that allow us to create reusable HTML elements that encapsulate their own functionality.

> To dig a little deeper into Angular Elements and Web Components, I recommend you take a look at this other article I wrote (in Spanish) on [Introduction to Angular Elements and Web Components](/blog/introduccion-angular-elements-web-components/).

Continuing with the scenario where we must build a project with a complex feature using Angular Elements, we may need to navigate visually between different modules or components and even support the exchange of information during that navigation. In that context is where I have found the Mediator pattern very practical. The Mediator pattern is a design pattern that allows objects to communicate with each other indirectly, through a mediator object, instead of communicating directly. In the context of a web application with Angular Elements, we can use the Mediator pattern to navigate between components without having to couple the components directly to each other.

## Why not use the Angular Router?

The first idea that may come to mind is to use the [Angular Router](https://angular.dev/guide/routing). The problem is that our custom element does not own the page. It lives embedded inside a host application that may have its own routing system, or that simply does not expect anyone to modify its URL.

The Angular _Router_ works on the browser's URL and history, so if we use it inside a Web Component:

- We will compete with the host application's routing for control of the URL.
- If we include two instances of the same element on the page, both will try to react to the same URL.
- The browser's "back" button will stop behaving the way the user expects in the host application.

What we really need is navigation **internal** to the component, which does not go beyond its boundaries. And this is where the _Mediator_ pattern fits in.

## The Mediator pattern applied to navigation

In the _Mediator_ pattern we identify three pieces, which in our case will be:

- **The mediator** (_NavigationMediator_): a service that knows the available views, keeps the navigation history and decides which view is shown at any given time.
- **The _colleagues_** (the views): components that request a navigation from the mediator, indicating which view they want to go to and with what data, without knowing or importing the target component.
- **The viewer** (_ShellComponent_): the component we expose as a custom element, which listens to the mediator and renders the current view on screen.

This way no component knows about any other. They all talk only to the mediator.

## Defining the views and their data

First of all, we will define a contract with the views of our component and the data each of them needs. Thanks to TypeScript, this contract will allow us to detect at compile time any navigation with incorrect data:

``` ts
import { InjectionToken, Provider, Type } from '@angular/core';

export interface ViewData {
  'customer-list': undefined;
  'customer-detail': { customerId: number };
}

export type ViewKey = keyof ViewData;

export interface NavigationConfig {
  initialView: ViewKey;
  views: Record<ViewKey, Type<unknown>>;
}

export const NAVIGATION_CONFIG = new InjectionToken<NavigationConfig>('NAVIGATION_CONFIG');

export function provideNavigation(config: NavigationConfig): Provider {
  return { provide: NAVIGATION_CONFIG, useValue: config };
}
```
_navigation.config.ts_

By using `Record<ViewKey, Type<unknown>>`, the compiler will force us to register a component for each of the views we declare in _ViewData_.

## Creating the mediator

The mediator keeps the navigation history in a [_signal_](https://angular.dev/guide/signals), so the current view and the ability to go back are calculated automatically from it:

``` ts
import { computed, inject, Injectable, signal, Type } from '@angular/core';
import { NAVIGATION_CONFIG, ViewData, ViewKey } from './navigation.config';

export interface NavigationEntry {
  view: ViewKey;
  data?: object;
}

@Injectable()
export class NavigationMediator {
  private readonly config = inject(NAVIGATION_CONFIG);
  private readonly history = signal<NavigationEntry[]>([{ view: this.config.initialView }]);

  readonly current = computed(() => this.history().at(-1)!);
  readonly canGoBack = computed(() => this.history().length > 1);

  navigate<K extends ViewKey>(view: K, data?: ViewData[K]): void {
    this.history.update((history) => [...history, { view, data }]);
  }

  back(): void {
    if (this.canGoBack()) {
      this.history.update((history) => history.slice(0, -1));
    }
  }

  resolve(view: ViewKey): Type<unknown> {
    return this.config.views[view];
  }
}
```
_navigation-mediator.ts_

Note that the service does **not** use `providedIn: 'root'`. We will provide it at the viewer level so that each instance of our custom element has its own mediator and, therefore, its own history.

## Preparing the component viewer

Next, we will define the container where we will display our components. To do this, we will use the [ViewContainerRef](https://angular.dev/api/core/ViewContainerRef) class, which allows us to define a space capable of holding the views of our component instances.

``` ts
import { Component, effect, inject, untracked, viewChild, ViewContainerRef } from '@angular/core';
import { NavigationMediator } from './navigation/navigation-mediator';

@Component({
  selector: 'app-shell',
  providers: [NavigationMediator],
  template: `
    <nav>
      @if (mediator.canGoBack()) {
        <button type="button" (click)="mediator.back()">← Back</button>
      }
    </nav>
    <ng-container #outlet />
  `,
})
export class ShellComponent {
  protected readonly mediator = inject(NavigationMediator);
  private readonly outlet = viewChild('outlet', { read: ViewContainerRef });

  constructor() {
    effect(() => {
      const entry = this.mediator.current();
      const outlet = this.outlet();
      if (!outlet) {
        return;
      }

      untracked(() => {
        outlet.clear();
        const componentRef = outlet.createComponent(this.mediator.resolve(entry.view));
        for (const [name, value] of Object.entries(entry.data ?? {})) {
          componentRef.setInput(name, value);
        }
      });
    });
  }
}
```
_shell.component.ts_

Every time the mediator's current view changes, the _effect_:

1. Clears the container, destroying the previous view.
1. Creates the instance of the component registered for the new view.
1. Assigns the navigation data to the component's _inputs_ using `setInput`.

We wrap the component creation with `untracked` so that the _signals_ the new component may read during its construction do not become dependencies of our _effect_.

In addition, since the components are created inside the viewer's _ViewContainerRef_, they inherit its _injector_. In other words, all the views will receive the same mediator instance as the viewer without having to do anything else.

## Navigating from the components

For the example we will use a small customer store:

``` ts
import { Injectable } from '@angular/core';

export interface Customer {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerStore {
  readonly customers: Customer[] = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
    { id: 2, name: 'Alan Turing', email: 'alan@example.com' },
    { id: 3, name: 'Grace Hopper', email: 'grace@example.com' },
  ];

  find(id: number): Customer | undefined {
    return this.customers.find((customer) => customer.id === id);
  }
}
```
_customer.store.ts_

The customer list asks the mediator to navigate to the detail view, passing the identifier of the selected customer. Note that it neither imports nor knows about the detail component:

``` ts
import { Component, inject } from '@angular/core';
import { NavigationMediator } from '../navigation/navigation-mediator';
import { CustomerStore } from './customer.store';

@Component({
  selector: 'app-customer-list',
  template: `
    <h2>Customers</h2>
    <ul>
      @for (customer of store.customers; track customer.id) {
        <li>
          <button type="button" (click)="open(customer.id)">{{ customer.name }}</button>
        </li>
      }
    </ul>
  `,
})
export class CustomerListComponent {
  protected readonly store = inject(CustomerStore);
  private readonly mediator = inject(NavigationMediator);

  open(customerId: number): void {
    this.mediator.navigate('customer-detail', { customerId });
  }
}
```
_customer-list.component.ts_

For its part, the detail simply declares an _input_ with the same name as the property it receives in the navigation data:

``` ts
import { Component, computed, inject, input } from '@angular/core';
import { CustomerStore } from './customer.store';

@Component({
  selector: 'app-customer-detail',
  template: `
    @if (customer(); as customer) {
      <h2>{{ customer.name }}</h2>
      <p>{{ customer.email }}</p>
    } @else {
      <p>Customer not found.</p>
    }
  `,
})
export class CustomerDetailComponent {
  readonly customerId = input.required<number>();
  private readonly store = inject(CustomerStore);
  protected readonly customer = computed(() => this.store.find(this.customerId()));
}
```
_customer-detail.component.ts_

If we try to navigate with data that does not meet the contract, for example `navigate('customer-detail', { id: 1 })`, the compiler will warn us about the error.

## Registering the custom element

Finally, in the application's _entry point_ we create the Angular application without bootstrapping any component, register the views in the mediator and define our custom element:

``` ts
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { CustomerDetailComponent } from './app/customers/customer-detail.component';
import { CustomerListComponent } from './app/customers/customer-list.component';
import { provideNavigation } from './app/navigation/navigation.config';
import { ShellComponent } from './app/shell.component';

createApplication({
  providers: [
    provideNavigation({
      initialView: 'customer-list',
      views: {
        'customer-list': CustomerListComponent,
        'customer-detail': CustomerDetailComponent,
      },
    }),
  ],
})
  .then((app) => {
    const element = createCustomElement(ShellComponent, { injector: app.injector });
    customElements.define('customer-manager', element);
  })
  .catch((error) => console.error(error));
```
_main.ts_

The _main.ts_ file is the only place in the application that knows all the views. The rest of the components only know the mediator.

## Using the component on any page

After building the project with `ng build --output-hashing none`, we can now use our new element on any page, regardless of the technology it is built with:

``` html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Customer manager</title>
    <link rel="stylesheet" href="customer-manager/styles.css" />
  </head>
  <body>
    <customer-manager></customer-manager>

    <script src="customer-manager/main.js" type="module"></script>
  </body>
</html>
```
_index.html_

> The current Angular _application builder_ generates _ES Modules_, so we must load the _script_ with `type="module"`. If you need to bundle the output into a single file, I explain how to do it in the [introduction to Angular Elements article](/blog/introduccion-angular-elements-web-components/) (in Spanish).

## Adding a new view

One of the advantages of this approach is how easy it is to grow. To add, for example, a customer edit view, we only need to:

1. Add the view and its data to the _ViewData_ contract: `'customer-edit': { customerId: number };`
1. Create the _CustomerEditComponent_ component with the `customerId` _input_.
1. Register it in _main.ts_. If we forget, the compiler will remind us.
1. Navigate to it from any view with `this.mediator.navigate('customer-edit', { customerId })`.

No existing component needs to know about the new one.

## Advantages of this approach

- **Decoupling**: the views do not import each other, they only depend on the mediator.
- **Encapsulated navigation**: we do not touch the browser's URL or history, so we do not interfere with the host application.
- **Independent instances**: by providing the mediator in the viewer, we can have several `<customer-manager>` elements on the same page, each with its own navigation.
- **End-to-end typing**: the _ViewData_ contract ensures that each navigation sends the data the target view expects.
- **Built-in history**: since we store the data of each navigation, going back recreates the previous view with the same context.

## Conclusion

When we use Angular Elements to embed complex features in other applications, the Angular _Router_ is no longer the right tool to navigate between our views. The _Mediator_ pattern, backed by _ViewContainerRef_ and Angular _signals_, allows us to build internal, typed and fully decoupled navigation with very little code, keeping our Web Component as a black box that does not interfere with the page hosting it.

---
<social-share class="social-share--footer" />
