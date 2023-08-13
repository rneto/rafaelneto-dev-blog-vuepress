---
date: 2020-6-4
tags:
  - JavaScript
  - ES2015
summary: Since the ECMAScript 2015 specification, operations with arrays of elements have been enhanced thanks to new high-level methods such as map, filter, reduce, some, every or forEach among others. With them we gain ...
permalink: /en/blog/:slug
canonicalUrl: https://rafaelneto.dev/blog/optimizar-bucles-javascript/
---

# Optimizing JavaScript loops

<social-share class="social-share--header" />

[Español](/blog/optimizar-bucles-javascript/) | English

Since the ECMAScript 2015 specification, operations with arrays of elements have been enhanced thanks to new high-level methods such as _map_, _filter_, _reduce_, _some_, _every_ or _forEach_ among others. With them we gain in code understanding and debugging, but they are not always the best option to optimize the execution time of our loops.

We will see below some of the most common operations performed on arrays using both high-level methods and their alternative based on classical loops. Finally, we will check with a real practical example the performance of all the scenarios presented.

## Loop through all the elements of an array and obtain a new collection of modified elements

The ```map()``` method creates a new array with the results of the function applied to each of its elements.

Starting from an array of texts, we are going to convert all the texts to uppercase with the ```map()``` method and a classic ```for ()``` loop.

``` js
let texts = ['js', 'html', 'css', '.net'];

// Map method
let mapTexts = texts.map(t => t.toUpperCase());

// Classic for loop
let forTexts = [];
for (let i=0; i < texts.length; i++) {
  forTexts[i] = texts[i].toUpperCase();
}
```

## Filtering the elements of an array based on a given condition

The ```filter()``` method creates a new array with all the elements that meet the condition of the applied function.

Starting from an array of texts, we are going to filter those elements starting with the character _h_, using both the ```filter()``` method and a classic ```for ()``` loop.

``` js
let texts = ['js', 'html', 'css', '.net'];

// Filter method
let filterTexts = texts.filter(t => t.charAt(0) === 'h');

// Classic for loop
let forTexts = [];
for (let i=0; i < texts.length; i++) {
  if(texts[i].charAt(0) === 'h'){
    forTexts.push(texts[i]);
  }
}
```

## Reducing the elements of an array to a single value

The ```reduce()``` method applies a reducer function that traverses from left to right through each element of an array, returning a single value as a result.

Starting with an array of numbers, we will reduce the elements to their sum, using both the ```reduce()``` method and a classic ```for ()``` loop.

``` js
let numbers = [5, 10, 15];

// Reduce method
let reduceSum = numbers.reduce((a, b) => a + b);

// Classic for loop
let forSum = 0;
for (let i=0; i < numbers.length; i++) {
  forSum += numbers[i];
}
```

## Determine if at least one element of the array meets a certain condition

The ```some()``` method determines if at least one element of the array meets the condition of the applied function.

Starting from an array of texts, we will check if any element is _.net_, using both the ```some()``` method and a classic ```for ()``` loop.

``` js
let texts = ['js', 'html', 'css', '.net'];

// Some method
let someResult = texts.some(t => t === '.net');

// Classic for loop
let forResult = false;
for (let i=0; i < texts.length; i++) {
  if(texts[i] === '.net'){
    forResult = true;
    break;
  }
}
```

## Determine if all the elements of the array meet a certain condition

The ```every()``` method determines if all the elements of the array meet the condition of the applied function.

Starting from an array of texts, we will check if all elements have less than 5 characters, using both the ```every()``` method and a classic ```for ()``` loop.

``` js
let texts = ['js', 'html', 'css', '.net'];

// Every method
let everyResult = texts.every(t => t.length  < 5);

// Classic for loop
let forResult = true;
for (let i=0; i < texts.length; i++) {
  if(texts[i].length >= 5){
    forResult = false;
    break;
  }
}
```

## Execute a function for each element of the array

The ```forEach()``` method executes the function indicated by each of the array elements.

Starting from an array of texts, we are going to register in the console each one of its values with the ```forEach()``` method and a classic ```for ()``` loop.

``` js
let texts = ['js', 'html', 'css', '.net'];

// ForEach method
texts.forEach(t => console.log(t));

// Classic for loop
for (let i=0; i < texts.length; i++) {
  console.log(texts[i]);
}
```

## Practical example of performance testing with loops and arrays in JavaScript

I have created in StackBlitz a TypeScript project with a [practical example of performance testing with loops and arrays in JavaScript](https://stackblitz.com/edit/ts-testing-loops-with-arrays).

---
<social-share class="social-share--footer" />
