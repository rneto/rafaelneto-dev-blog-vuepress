---
date: 2026-11-21
tags:
  - Angular
  - AngularElements
  - WebComponents
  - PatronDeDiseño
summary: Angular Elements es una funcionalidad de Angular que nos permite crear componentes web reutilizables que pueden ser integrados en cualquier aplicación web sin depender de Angular. Veamos cómo navegar entre sus vistas con el patrón Mediator ...
description: "Cómo navegar entre las vistas de un componente creado con Angular Elements usando el patrón Mediator, sin depender del Router de Angular."
permalink: /blog/:slug
---

# Navegación entre componentes con Angular Elements y el patrón Mediator

<social-share class="social-share--header" />

Español | [English](/en/blog/component-navigation-angular-elements-mediator/)

Angular Elements es una funcionalidad de Angular que nos permite crear componentes web reutilizables que pueden ser integrados en cualquier aplicación web sin depender de Angular. Dada su flexibilidad, podemos usarlo para definir componentes sencillos y reutilizables en otros proyectos, pero también podemos usarlo para agregar nuevas funcionalidades complejas y completas en otros proyectos sin apenas tener que modificarlos. Todo esto se consigue gracias al uso de Componentes Web, que son un conjunto de tecnologías que nos permiten crear elementos HTML reutilizables y que encapsulan su propia funcionalidad.

> Para profundizar un poco más en Angular Elements y Web Components, te recomiendo que le eches un vistazo a este otro artículo que he creado sobre [Introducción a Angular Elements y Web Components](/blog/introduccion-angular-elements-web-components/).

Siguiendo con el escenario donde debemos crear un proyecto con una funcionalidad compleja usando Angular Elements, puede darse el caso donde debamos navegar visualmente entre diferentes módulos o componentes e inclusive soportar el intercambio de información durante dicha navegación. En ese contexto es donde he visto muy práctico el uso del patrón Mediator. El patrón Mediator es un patrón de diseño que nos permite comunicar objetos entre sí de manera indirecta, a través de un objeto mediador, en lugar de comunicarlos directamente. En el contexto de una aplicación web con Angular Elements, podemos usar el patrón Mediator para navegar entre componentes sin tener que acoplar directamente los componentes entre sí.

## ¿Por qué no usar el Router de Angular?

La primera idea que nos puede venir a la cabeza es usar el [Router de Angular](https://angular.dev/guide/routing). El problema es que nuestro elemento personalizado no es el dueño de la página. Vive incrustado dentro de una aplicación anfitriona que puede tener su propio sistema de enrutado, o que simplemente no espera que nadie modifique su URL.

El _Router_ de Angular trabaja sobre la URL y el historial del navegador, por lo que si lo usamos dentro de un Web Component:

- Competiremos con el enrutado de la aplicación anfitriona por el control de la URL.
- Si incluimos dos instancias del mismo elemento en la página, ambas intentarán reaccionar a la misma URL.
- El botón "atrás" del navegador dejará de comportarse como el usuario espera en la aplicación anfitriona.

Lo que necesitamos realmente es una navegación **interna** al componente, que no salga de sus límites. Y aquí es donde encaja el patrón _Mediator_.

## El patrón Mediator aplicado a la navegación

En el patrón _Mediator_ identificamos tres piezas, que en nuestro caso serán:

- **El mediador** (_NavigationMediator_): un servicio que conoce las vistas disponibles, mantiene el historial de navegación y decide qué vista se muestra en cada momento.
- **Los _colleagues_** (las vistas): componentes que solicitan una navegación al mediador indicando a qué vista quieren ir y con qué datos, sin conocer ni importar el componente de destino.
- **El visor** (_ShellComponent_): el componente que exponemos como elemento personalizado, que escucha al mediador y pinta en pantalla la vista actual.

De esta forma ningún componente conoce a otro. Todos hablan únicamente con el mediador.

## Definiendo las vistas y sus datos

En primer lugar, definiremos un contrato con las vistas de nuestro componente y los datos que necesita cada una de ellas. Gracias a TypeScript, este contrato nos permitirá detectar en tiempo de compilación cualquier navegación con datos incorrectos:

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

Al usar `Record<ViewKey, Type<unknown>>`, el compilador nos obligará a registrar un componente por cada una de las vistas que declaremos en _ViewData_.

## Creando el mediador

El mediador mantiene el historial de navegación en un [_signal_](https://angular.dev/guide/signals), de modo que la vista actual y la posibilidad de volver atrás se calculan automáticamente a partir de él:

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

Fijémonos en que el servicio **no** usa `providedIn: 'root'`. Lo proveeremos a nivel del visor para que cada instancia de nuestro elemento personalizado tenga su propio mediador y, por tanto, su propio historial.

## Preparando el visor de componentes

A continuación definiremos el contenedor donde visualizaremos nuestros componentes. Para ello haremos uso de la clase [ViewContainerRef](https://angular.dev/api/core/ViewContainerRef) que nos permite definir un espacio capaz de contener las vistas de las instancias de nuestros componentes.

``` ts
import { Component, effect, inject, untracked, viewChild, ViewContainerRef } from '@angular/core';
import { NavigationMediator } from './navigation/navigation-mediator';

@Component({
  selector: 'app-shell',
  providers: [NavigationMediator],
  template: `
    <nav>
      @if (mediator.canGoBack()) {
        <button type="button" (click)="mediator.back()">← Volver</button>
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

Cada vez que cambia la vista actual del mediador, el _effect_:

1. Vacía el contenedor, destruyendo la vista anterior.
1. Crea la instancia del componente registrado para la nueva vista.
1. Asigna los datos de la navegación a los _inputs_ del componente mediante `setInput`.

Envolvemos la creación del componente con `untracked` para que los _signals_ que pueda leer el nuevo componente durante su construcción no se conviertan en dependencias de nuestro _effect_.

Además, como los componentes se crean dentro del _ViewContainerRef_ del visor, heredan su _injector_. Es decir, todas las vistas recibirán la misma instancia del mediador que el visor sin necesidad de hacer nada más.

## Navegando desde los componentes

Para el ejemplo usaremos un pequeño almacén de clientes:

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

El listado de clientes solicita al mediador la navegación hacia el detalle, indicando el identificador del cliente seleccionado. Fijémonos en que no importa ni conoce el componente de detalle:

``` ts
import { Component, inject } from '@angular/core';
import { NavigationMediator } from '../navigation/navigation-mediator';
import { CustomerStore } from './customer.store';

@Component({
  selector: 'app-customer-list',
  template: `
    <h2>Clientes</h2>
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

Por su parte, el detalle simplemente declara un _input_ con el mismo nombre que la propiedad que recibe en los datos de la navegación:

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
      <p>Cliente no encontrado.</p>
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

Si intentamos navegar con datos que no cumplen el contrato, por ejemplo `navigate('customer-detail', { id: 1 })`, el compilador nos avisará del error.

## Registrando el elemento personalizado

Por último, en el _entry point_ de la aplicación creamos la aplicación Angular sin arrancar ningún componente, registramos las vistas en el mediador y definimos nuestro elemento personalizado:

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

El fichero _main.ts_ es el único lugar de la aplicación que conoce todas las vistas. El resto de componentes solo conocen al mediador.

## Usando el componente en cualquier página

Tras generar el proyecto con `ng build --output-hashing none`, ya podemos usar nuestro nuevo elemento en cualquier página, independientemente de la tecnología con la que esté hecha:

``` html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Gestor de clientes</title>
    <link rel="stylesheet" href="customer-manager/styles.css" />
  </head>
  <body>
    <customer-manager></customer-manager>

    <script src="customer-manager/main.js" type="module"></script>
  </body>
</html>
```
_index.html_

> El _application builder_ actual de Angular genera _ES Modules_, así que debemos cargar el _script_ con `type="module"`. Si necesitas empaquetar el resultado en un único fichero, en el [artículo de introducción a Angular Elements](/blog/introduccion-angular-elements-web-components/) explico cómo hacerlo.

## Añadir una nueva vista

Una de las ventajas de este enfoque es lo sencillo que resulta crecer. Para añadir, por ejemplo, una vista de edición de clientes solo necesitamos:

1. Añadir la vista y sus datos al contrato _ViewData_: `'customer-edit': { customerId: number };`
1. Crear el componente _CustomerEditComponent_ con el _input_ `customerId`.
1. Registrarlo en _main.ts_. Si lo olvidamos, el compilador nos lo recordará.
1. Navegar hacia él desde cualquier vista con `this.mediator.navigate('customer-edit', { customerId })`.

Ningún componente existente necesita conocer al nuevo.

## Ventajas de este enfoque

- **Desacoplamiento**: las vistas no se importan entre sí, solo dependen del mediador.
- **Navegación encapsulada**: no tocamos la URL ni el historial del navegador, por lo que no interferimos con la aplicación anfitriona.
- **Instancias independientes**: al proveer el mediador en el visor, podemos tener varios elementos `<customer-manager>` en la misma página, cada uno con su propia navegación.
- **Tipado _end-to-end_**: el contrato _ViewData_ garantiza que cada navegación envía los datos que espera la vista de destino.
- **Historial incluido**: como guardamos los datos de cada navegación, volver atrás recrea la vista anterior con su mismo contexto.

## Conclusión

Cuando usamos Angular Elements para incrustar funcionalidades complejas en otras aplicaciones, el _Router_ de Angular deja de ser la herramienta adecuada para navegar entre nuestras vistas. El patrón _Mediator_, apoyado en _ViewContainerRef_ y en los _signals_ de Angular, nos permite construir una navegación interna, tipada y totalmente desacoplada con muy poco código, manteniendo nuestro Web Component como una caja negra que no interfiere con la página que lo aloja.

---
<social-share class="social-share--footer" />
