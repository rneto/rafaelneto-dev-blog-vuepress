---
date: 2023-3-20
tags:
  - Angular
  - RxJs
  - BehaviourSubject
  - Observable
  - PatronDeDiseño
summary: Los observables son una herramienta poderosa en Angular para manejar flujos de datos asíncronos. Los BehaviourSubject son una variante especial de los observables que mantienen un estado actual y emiten ese estado a cualquier nuevo suscriptor.
permalink: /blog/:slug
---

# Desuscribir de un observable RxJs BehaviorSubject en Angular

<social-share class="social-share--header" />

Español | [English](/en/blog/unsubscribing-behaviorsubject-observable-angular/)

Los observables son una herramienta poderosa en Angular para manejar flujos de datos asíncronos. Los BehaviourSubject son una variante especial de los observables que mantienen un estado actual y emiten ese estado a cualquier nuevo suscriptor. Esto lo hace muy útil por ejemplo para compartir información entre componentes en una aplicación Angular. Sin embargo, una vez que te suscribes a un BehaviourSubject, necesitas tener una forma de desuscribirte cuando ya no necesites recibir actualizaciones para evitar fugas de memoria.

> Si quieres saber más sobre las ventajas de usar RxJs BehaviorSubject, te recomiendo que le eches un vistazo a este otro artículo que he creado sobre [Gestionar el estado de una aplicación Angular usando RxJs BehaviorSubject para servicios de datos observables](/blog/gestionar-estado-angular-rxjs-behaviorsubject-servicios-datos-observables/).

A continuación, te presento seis formas de cómo desuscribirte de un observable en Angular.

## 1. Usando la variable Subscription
La forma más común de desuscribirte de un BehaviourSubject es usar la variable Subscription que se devuelve cuando te suscribes. Puedes guardar esta variable en una propiedad de tu componente y luego llamar al método _unsubscribe()_ en el _ngOnDestroy()_ del componente para liberar la suscripción.

``` ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-my-component',
  template: `{{ value }}`,
})
export class MyComponent implements OnInit, OnDestroy {
  value: any;
  subscription: Subscription;

  constructor(private myService: MyService) {}

  ngOnInit() {
    this.subscription = this.myService.myBehaviorSubject.subscribe(value => {
      this.value = value;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

## 2. Usando el operador takeUntil()
Otra forma de desuscribirte de un BehaviourSubject es usar el operador _takeUntil()_. Este operador toma un observable que emite un valor y completa el observable original cuando se emite un valor en el observable secundario. Puedes crear un observable que emita en el _ngOnDestroy()_ y pasar ese observable al operador _takeUntil()_.

``` ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-component',
  template: `{{ value }}`,
})
export class MyComponent implements OnInit, OnDestroy {
  value: any;
  onDestroy$: Subject<void> = new Subject();

  constructor(private myService: MyService) {}

  ngOnInit() {
    this.myService.myBehaviorSubject
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.value = value;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
```

## 3. Usando el operador take()
Si solo necesitas recibir un número limitado de valores del BehaviourSubject, puedes usar el operador _take()_ en lugar de _unsubscribe()_. Este operador toma un número n y completa el observable después de recibir n valores.

``` ts
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-my-component',
  template: `{{ value }}`,
})
export class MyComponent implements OnInit {
  value: any;

  constructor(private myService: MyService) {}

  ngOnInit() {
    this.myService.myBehaviorSubject
      .pipe(take(1))
      .subscribe(value => {
        this.value = value;
      });
  }
}
```

## 4. Usando el método first()
El método _first()_ de los observables es una forma de emitir el primer valor que se emita en el flujo del observable y luego se completa automáticamente. Si se suscribe a este método, sólo recibirá el primer valor que se emita en el observable y luego se dará de baja automáticamente. Esto es útil si sólo se necesita escuchar el primer valor que se emita y no se requiere escuchar los cambios posteriores, como por ejemplo con métodos _CUD_ (create, update, delete) que realizan una operación y devuelven un observable.

Para utilizar este método con un BehaviorSubject, puede suscribirse al observable y llamar al método _first()_:

``` ts
const behaviorSubject$ = new BehaviorSubject('Valor inicial');

behaviorSubject$.pipe(
  first()
).subscribe(
  (valor) => console.log('El valor inicial del BehaviorSubject es:', valor)
);
```

En este ejemplo, el observable se suscribe al método _first()_, lo que significa que sólo se recibirá el primer valor que emita el BehaviorSubject. El flujo se completará automáticamente después de emitir el primer valor.

## 5. Usando el método firstValueFrom()

Al igual que en el caso del método _first()_, el método _firstValueFrom()_ también se usa para obtener el primer valor emitido por un observable, sin embargo hay una diferencia importante en cómo se manejan las suscripciones y la emisión de valores. En el caso de _firstValueFrom()_, en lugar de recibir un observable como resultado, obtenemos una promesa que se resuelve tras recibirse el primer valor del observable. Esto significa que _firstValueFrom()_ espera a que se emita el primer valor y luego resuelve la promesa con ese valor. Además, _firstValueFrom()_ completa automáticamente la suscripción una vez que se obtiene el primer valor, por lo que no se procesan más valores emitidos.

Dado la conversión del observable en _promesa_ tenemos la ventaja de hacer uso de _async/await_ a la hora de recuperar el valor del observable.

``` ts
import { firstValueFrom, interval } from 'rxjs';

async function example() {
  const source = interval(1000); // Emite un valor cada segundo
  const firstValue = await firstValueFrom(source);
  console.log(`El primer valor emitido es: ${firstValue}`);
}

example();
```

Al usar _await_ con _firstValueFrom()_, nos aseguramos de que el código espera a que se emita el primer valor antes de continuar.

## 6. Usando el patrón decorador para desuscribir de todos los observables del componente

La idea detrás de usar un patrón decorador para desuscribir observables en un componente de Angular es encapsular la lógica de suscripción y desuscripción de los observables en una única función que pueda ser llamada en el momento adecuado. Esto puede ayudar a reducir la complejidad del código y hacerlo más fácil de mantener.

Un ejemplo de cómo se podría implementar este patrón, sería en primer lugar crear un decorador personalizado para manejar la suscripción y desuscripción de los observables en un componente.

``` ts
// Crear el decorador personalizado
export function AutoUnsubscribe(constructor: any) {
  const original = constructor.prototype.ngOnDestroy;

  constructor.prototype.ngOnDestroy = function () {
    for (const prop in this) {
      const property = this[prop];
      if (property && typeof property.unsubscribe === 'function') {
        property.unsubscribe();
      }
    }
    original?.apply(this, arguments);
  };
}
```

Este decorador personalizado implementa la interfaz _OnDestroy_ de Angular, que se utiliza para liberar recursos cuando se destruye un componente. La función _AutoUnsubscribe_ busca en el componente todas las propiedades que sean instancias de Observable o Subject y llama a su método _unsubscribe()_ para desuscribirlos.

Apply the decorator to the component.

``` ts
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { AutoUnsubscribe } from './auto-unsubscribe.decorator';
import { MyService } from './my.service';

@AutoUnsubscribe
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
})
export class MyComponent implements OnInit {
  subscription: Subscription;
  mySubject$ = new BehaviorSubject<string>('Initial Value');

  constructor(private myService: MyService) {}

  ngOnInit() {
    this.subscription = this.myService.myBehaviorSubject.subscribe(value => {
      this.value = value;
    });
  }
}
```

Al aplicar el decorador personalizado _AutoUnsubscribe_ al componente, Angular llamará automáticamente al método _ngOnDestroy_ del componente cuando el componente se destruya, y el decorador se encargará de desuscribir todos los observables y subjects creados en el componente.

> Es importante destacar que este patrón no es una solución mágica que funcionará en todos los casos. Por ejemplo, si se espera que un observable continúe emitiendo valores incluso después de que el componente se haya destruido, no es apropiado desuscribirlo en el método _ngOnDestroy_. En esos casos, deberías manejar la desuscripción en otra parte del código. Sin embargo, para la mayoría de los casos, este patrón puede ser una solución simple y efectiva para desuscribir observables en un componente en Angular.

Puedes ver en acción y en StackBlitz un proyecto Angular que he creado con este [ejemplo de servicio de datos con RxJs BehaviorSubject y decorador para desuscribir](https://stackblitz.com/edit/angular-rxjs-behaviorsubject-unsubscribe-decorator).

---
<social-share class="social-share--footer" />
