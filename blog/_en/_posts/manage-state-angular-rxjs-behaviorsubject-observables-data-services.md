---
date: 2021-8-5
tags:
  - Angular
  - RxJs
  - BehaviourSubject
summary: There are multiple options when it comes to manage the state of an Angular application by using a state management, however, there is also another centralized storage solution, simple and inexpensive (for its size and implementation) that is completely valid for certain projects.
permalink: /en/blog/:slug
---

# Manage the state of an Angular application using RxJs BehaviorSubject for observable data services

<social-share class="social-share--header" />

[Español](/blog/gestionar-estado-angular-rxjs-behaviorsubject-servicios-datos-observables/) | English

There are multiple options when it comes to manage the state of an Angular application by using a state management library ([Ngrx Store](https://ngrx.io/guide/store) -recommended- or [Angular Redux](https://github.com/angular-redux/platform) -obsolete- for example), however, there is also another centralized storage solution, simple and inexpensive (for its size and implementation) that is completely valid for certain projects. This time I am talking about having an injectable and observable data service, based on [RxJs](https://rxjs.dev/) [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject), which will act as a centralized manager of the state of our application. We consider it injectable because we could supply it anywhere in our code where the data is needed, and we consider it observable because the data is readily available and periodically updated.

> A **data service** is an Angular service that can be used to provide multiple data consistently to different parts of the application.

_BehaviorSubject_ is a special type of _[observable](https://angular.io/guide/observables)_ that allows multiple transmission of values to many concurrent observers and where the current value is always stored and remains available. That is why each time a new consumer subscribes to the data, it will always receive the current value (this is the main difference with respect to the standard _observable_).

## Implementation

This example represents a service where we will centralize the information of the current user in our application.

``` js
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject({} as User);
  public readonly currentUser: Observable<User> = this.currentUserSubject.asObservable();

  constructor() { }

  setCurrentUser(currentUser: User): void {
    this.currentUserSubject.next(currentUser);
  }
}
```
_user.service.ts_

``` js
export interface User {
  username: string;
}
```
_user.model.ts_

In the service we have created a private property `currentUserSubject` that protects the emission of new values of our state (`currentUserSubject.next()`), which can be emitted exclusively through the action method `setCurrentUser` of our service. This method could also be used to ensure the consistency of the data we store or to interact with external systems (we could validate the received data or even call an API).

And finally we find the public read-only and _observable_ variable `currentUser`, which is the only way from which the data can be consulted.

Then we could subscribe to the service to view the data, without forgetting to unsubscribe from the observable when the _ngOnDestroy()_ component is destroyed.

> Observables are a powerful tool for handling asynchronous data, however they can also be a source of memory problems if we don't manage them correctly. This is why the importance to [Unsubscribe from an RxJs BehaviorSubject observable in Angular](/en/blog/unsubscribing-behaviorsubject-observable-angular/).

``` js
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from './user.service';

@Component({
  selector: 'hello',
  template: `
    <h1 *ngIf="username">Hello {{ username }}!</h1>
  `
})
export class HelloComponent implements OnInit, OnDestroy {
  username: string;

  private userServiceSubscription: Subscription | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userServiceSubscription = this.userService.currentUser.subscribe(
      currentUser => {
        this.username = currentUser.username;
      }
    );
  }

  ngOnDestroy(): void {
    this.userServiceSubscription?.unsubscribe();
  }
}
```
_hello.component.ts_


Or we could also update the data when necessary:

``` js
import { Component } from '@angular/core';

import { UserService } from './user.service';

@Component({
  selector: 'my-app',
  template: `
    <input #username type="text" placeholder="What is your name?">
    <button (click)="saveUserName(username.value)">Save</button>

    <hello></hello>
  `
})
export class AppComponent {
  constructor(private userService: UserService) {}

  saveUserName(username: string) {
    this.userService.setCurrentUser({ username: username });
  }
}
```
_app.component.ts_

You can see in action and in StackBlitz an Angular project I created with this [data service example with RxJs BehaviorSubject](https://stackblitz.com/edit/angular-testing-service-data-with-rxjs-behaviorsubject).


## IDEA: Use of a data service for inputs and outputs of Angular components

The standard way to manage the interaction between Angular components proposes the use of _@Input_ parameters for data input and the emission of output events with the _@Output_ attribute, however, it is possible that an excessive passage of data between nested components may occur or even complicate the strategy of centralization of the state of the application by the flow of events. When this happens, we can rethink the input and output strategy of our components and as a possible alternative, make use of an observable data service to simplify and decouple the communication between our components in a simple and effective way.

---
<social-share class="social-share--footer" />
