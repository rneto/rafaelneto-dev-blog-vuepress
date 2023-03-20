---
date: 2023-3-20
tags:
  - Angular
  - RxJs
  - BehaviourSubject
  - Observable
  - DesignPattern
summary: Observables are a powerful tool in Angular to handle asynchronous data flows. BehaviorSubjects are a special variant of observables ...
permalink: /en/blog/:slug
---

# Unsubscribing from an RxJs BehaviorSubject observable in Angular

<social-share class="social-share--header" />

[Español](/blog/desuscribir-observable-behaviorsubject-angular/) | English

Observables are a powerful tool in Angular to handle asynchronous data flows. BehaviorSubjects are a special variant of observables that maintain a current state and emit that state to any new subscribers. This makes it very useful, for example, to share information between components in an Angular application. However, once you subscribe to a BehaviorSubject, you need to have a way to unsubscribe when you no longer need to receive updates to avoid memory leaks. Here are five ways to unsubscribe from an observable in Angular.

## 1. Using the Subscription variable
The most common way to unsubscribe from a BehaviorSubject is to use the Subscription variable that is returned when you subscribe. You can save this variable to a property in your component and then call the _unsubscribe()_ method in the _ngOnDestroy()_ of the component to release the subscription.

``` ts
import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-my-component',
  template: `{{ value }}`,
})
export class MyComponent implements OnDestroy {
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

## 2. Using the takeUntil() operator
Another way to unsubscribe from a BehaviorSubject is to use the _takeUntil()_ operator. This operator takes an observable that emits a value and completes the original observable when a value is emitted in the secondary observable. You can create an observable that emits in the _ngOnDestroy()_ and pass that observable to the _takeUntil()_ operator.

``` ts
import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-component',
  template: `{{ value }}`,
})
export class MyComponent implements OnDestroy {
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

## 3. Using the take() operator
If you only need to receive a limited number of values from the BehaviorSubject, you can use the _take()_ operator instead of _unsubscribe()_. This operator takes a number n and completes the observable after receiving n values.

``` ts
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-my-component',
  template: `{{ value }}`,
})
export class MyComponent {
  value: any;

  constructor(private myService: MyService) {}

  ngOnInit() {
    this.myService.myBehaviorSubject
      .pipe(take(1))
      .subscribe(value => {
        this.value
```

## 4. Using the first() method
The _first()_ method of observables is a way to emit the first value that is emitted in the observable flow and then automatically complete it. If you subscribe to this method, you will only receive the first value that the observable emits and then unsubscribe automatically. This is useful if you only need to listen for the first value emitted and do not require listening for subsequent changes, such as with CUD (create, update, delete) methods that perform an operation and return an observable.

To use this method with a BehaviorSubject, you can subscribe to the observable and call the _first()_ method:

``` ts
const behaviorSubject$ = new BehaviorSubject('Initial value');

behaviorSubject$.pipe(
  first()
).subscribe(
  (value) => console.log('The initial value of the  BehaviorSubject is:', value)
);
```

In this example, the observable is subscribed to the _first()_ method, which means that only the first value that the BehaviorSubject emits will be received. The stream will automatically complete after emitting the first value.

## 5. Using the decorator pattern to unsubscribe from all observables in an Angular component

The idea behind using a decorator pattern to unsubscribe from observables in an Angular component is to encapsulate the logic of subscribing and unsubscribing from observables in a single function that can be called at the appropriate time. This can help reduce code complexity and make it easier to maintain.

An example of how this pattern could be implemented is to first create a custom decorator to handle subscription and unsubscription of observables in a component.

``` ts
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// Create the custom decorator
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

This custom decorator implements the _OnDestroy_ interface of Angular, which is used to release resources when a component is destroyed. The _AutoUnsubscribe_ function searches the component for all properties that are instances of Observable or Subject and calls their _unsubscribe()_ method to unsubscribe them.

Apply the decorator to the component.

``` ts
import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AutoUnsubscribe } from './auto-unsubscribe.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
})
export class MyComponent implements OnDestroy {
  mySubject$ = new BehaviorSubject<string>('Initial Value');
  myObservable$: Observable<number>;

  constructor() {
    this.myObservable$ = interval(1000);
  }

  // Implement the OnDestroy method of the OnDestroy interface
  ngOnDestroy(): void {
    // This method is automatically called when the component is destroyed.
  }
}
```

By applying the custom _AutoUnsubscribe_ decorator to the component, Angular will automatically call the component's _ngOnDestroy_ method when the component is destroyed, and the decorator will take care of unsubscribing from all observables and subjects created in the component.

> It is important to note that this pattern is not a magic solution that will work in all cases. For example, if an observable is expected to continue emitting values even after the component has been destroyed, it is not appropriate to unsubscribe from it in the ngOnDestroy method. In those cases, you should handle the unsubscription in another part of the code. However, for most cases, this pattern can be a simple and effective solution for unsubscribing from observables in an Angular component.

---
<social-share class="social-share--footer" />
