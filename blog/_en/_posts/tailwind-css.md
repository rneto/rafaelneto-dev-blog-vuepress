---
date: 2021-03-08
tags:
  - TailwindCSS
summary: Tailwind CSS is a CSS framework that provides a set of low-level utilities that allow us to create completely customized layouts based on class composition.
permalink: /en/blog/:slug
---

# What is Tailwind CSS?

<social-share class="social-share--header" />

[Español](/blog/tailwind-css/) | English

[Tailwind CSS](https://tailwindcss.com/) is a CSS framework that provides a set of low-level utilities that allow us to create completely customized layouts based on class composition.

Since its introduction in late 2017, the incorporation of Tailwind CSS into thousands of projects every day is undeniable. By the end of February 2021, it reached nearly 700,000 daily installations of its package on npm (with Bootstrap, for comparison, reaching 3.2 million daily downloads of its package on npm).

One of the main advantages offered by Tailwind CSS lies in its design system approach. It can be considered a progressive CSS framework, meaning that we can fully adopt it to create an attractive design without any additional assistance, or we can partially adopt it while remaining compatible with our existing design system. Unlike frameworks like Bootstrap, Tailwind CSS doesn't provide pre-designed components. Instead, it assists us in designing our own components by leveraging its utility classes.

Another significant advantage of Tailwind CSS is related to deployment size. By using CSS preprocessors, it's possible to significantly reduce the size of our project's style file by scanning our HTML files and removing unused Tailwind CSS classes.

The following example demonstrates what we can achieve with Tailwind CSS:

``` html
<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-r shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div>
            <img src="https://rafaelneto.dev/images/logo.png" class="h-7 sm:h-8" />
          </div>
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <p>Tailwind CSS is a great CSS framework option to start my projects.</p>
              <ul class="list-disc space-y-2">
                <li class="flex items-start">
                  <span class="h-6 flex items-center sm:h-7">
                    <svg class="flex-shrink-0 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <p class="ml-2">
                    It’s flexible!
                  </p>
                </li>
                <li class="flex items-start">
                  <span class="h-6 flex items-center sm:h-7">
                    <svg class="flex-shrink-0 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <p class="ml-2">
                    It's customizable!
                  </p>
                </li>
                <li class="flex items-start">
                  <span class="h-6 flex items-center sm:h-7">
                    <svg class="flex-shrink-0 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <p class="ml-2">
                    It's progressive and compatible with my current designs!
                  </p>
                </li>
              </ul>
            </div>
            <div class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
              <p>
                <a href="https://rafaelneto.dev" class="text-green-600 hover:text-green-700"> Rafael Neto </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
```

And this would be the result:

<style>
  .responsive-embed {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .responsive-embed::before {
    padding-top: 75%;
  }

  .responsive-embed::before {
    display: block;
    content: "";
  }

  .responsive-embed__element,
  .responsive-embed embed,
  .responsive-embed iframe,
  .responsive-embed object,
  .responsive-embed video {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
    background-color: #222;

    align-items: center;
    display: flex;
    justify-content: center;
    text-align: center;
  }
</style>

<div class="responsive-embed">
  <iframe src="https://htmlpreview.github.io/?https://github.com/rneto/mini-projects/blob/master/basic-tailwind-css/index.html"></iframe>
</div>

You can find the complete code for the previous example, which I've named [Basic Tailwind CSS](https://github.com/rneto/mini-projects/tree/master/basic-tailwind-css), in my GitHub repository [Mini projects](https://github.com/rneto/mini-projects).

If you want to delve deeper into using Tailwind CSS with Angular, including Angular Material, I suggest visiting my article on [how to integrate Tailwind CSS with Angular Material in an Angular application](/en/blog/integrate-tailwind-css-angular-material/).

---
<social-share class="social-share--footer" />
