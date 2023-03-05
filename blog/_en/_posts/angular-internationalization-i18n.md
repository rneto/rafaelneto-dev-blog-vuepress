---
date: 2023-3-5
tags:
  - Angular
  - i18n
summary: A basic step in virtually all projects is to set up a system that allows us to internationalize our Angular application. In that sense, the use of the official internationalization system of Angular ...
permalink: /en/blog/:slug
---

# Angular Internationalization (i18n)

<social-share class="social-share--header" />

[Español](/blog/internacionalizacion-i18n-angular/) | English

A basic step in virtually all projects is to set up a system that allows us to internationalize our application. In that sense, the use of the official internationalization system of Angular allows us to be more aligned with the natural evolution of Angular. This system, based on the generation of translations at compile time, creates as many versions of our application as different languages we have defined, so we will not need a translation service or special dictionary, we will simply have the final texts in the application.

When talk about compile-time translations, Angular replaces each marked text with the corresponding translation text from the translation file. This process is executed once for each language, so we will eventually end up with an application package for each language.

Let's consider the advantages of this system:

1. More performance because there is no translation dictionary loaded in memory at run-time.
1. More performance because it is not necesarry to translate the text in each application change detection event.
1. Better maintainability because of the better development experience in the way it is used.
1. Better maintainability by using a well extended file format such as XLIFF.

And the main disadvantage:

1. Application reload when changing the language.

This system includes several basic steps:

- Initial configuration.
- Localization of application content for formatting or extraction.
- Extraction of text for translations.
- Generation of translation files.
- Building a localized project.

## Initial configuration

The first step is to install the necessary dependencies using Angular CLI:

`ng add @angular/localize`

This will add the _@angular/localize_ package and load the `$localize` function in the global scope.

Angular uses _Unicode locale ID_ to locale the data, its default value being _en-US_. Otherwise, it can be specified via the _sourceLocale_ property in the _angular.json_ file.

## Localization of application content for formatting or extraction

The next step is to prepare our content to be transformed in the correct way using the language and locale based on the _LOCALE_ID_ and to be extracted and translated externally.

To display our data in the correct format we have [_Angular pipes_](https://angular.io/guide/pipes) that allows us to transform them based on the language configuration we have set:

``` js
{{ myDateTime | date:'shortTime' }} // will be '5:15 PM' for 'en-US' and '17:15' for 'en-GB'
{{ myAmount | number }}```  // will be '2,138.62' for 'es' and '2 138,62' for 'fr'
```

To prepare our content to be extracted we have to use the _i18n_ attribute and the _$localize_ function to mark our text strings as translatable.

``` html
<p i18n>Text to translate.</p>
<ng-container i18n>Text to translate.</ng-container>
<img [src]="image.png" i18n-title title="Image title" i18n-alt alt="Image alt"/>
```
``` ts
private myText: $localize 'Text to translate';
private myText: $localize `Text to translate ${variable}`;
```

## Extraction of text for translations

After preparing our content to be extracted, we must use Angular CLI to extract to a base translations file all the marked strings. In this case, I will create a new _locale_ folder during the generation process inside which a new _messages.xlf_ file will be created with all marked texts of out application.

`ng extract-i18n --output-path src/locale`

### Update the base translation file

1. Make your changes in the app.
1. Run `ng extract-i18n --output-path src/locale` to update que _messages.xlf_ file.

## Generation of translation files

It is time to create and translate each locale file using an XLIFF file editor or create and edit it ourselves:

1. We make a copy of the source language file (_messages.xlf_ by default) in the same _locale_ folder and rename it with each required locale (_message.{locale}.xlf_).
1. Add a _target-language_ attribute to the _file_ node with the locale code, e.g. _target-language="es"_.
1. Search for the first _trans-unit_ node.
1. Duplicate the child node _source_ and rename it _target_.
1. Translate the content of the _target_ node.
1. Repeat the same steps above for each _trans-unit_ node.

To help us manage the translation files we can use the [XLIFF Sync] extension (https://marketplace.visualstudio.com/items?itemName=rvanbekkum.xliff-sync) and use the _Create New Target File(s)_ command to set up the project environment for the extension.

### Add new locales

Make a copy of the source language file and rename it with the required locale or use the XLIFF Sync extension (_Create New Target File(s)_) to create a new target file (a new alternate language).
1. We change the _angular.json_ file to add the new locale to the _projects -> Your.Project.Name -> i18n -> locales_ section. **I will talk about this section later.**

### Managing the translation files

- We use the XLIFF Sync extension (_Synchronize Translation Units_ command) to syncronize all translations units between the base file and all the alternate languages.
- We can edit the target files manually or if you use a external service (e.g., https://smartcat.com/) to translate them, then use the XLIFF Sync extension (_Import Translations from File(s)_ command) to copy the translations from the selected files to the target files with the same language (remember to check the _source-language_ and _target-language_ file attributes from the origin translation file to make sure it works correctly).

## Building a localized project

First of all we need is define all supported locales using the _i18n_ project property in the _angular.json_ file:

``` json
{
  // ...
  "projects": {
    "my-app": {
      // ...
      "i18n": {
        "sourceLocale": "en-US",
        "locales": {
          "es": {
            "translation": "src/locale/messages.es.xlf",
            "baseHref": "/es/"
          },
          "pt": {
            "translation": "src/locale/messages.pt.xlf",
            "baseHref": "/pt/"
          },
          // ...
        }
      },
      "architect": {
        // ...
      }
    }
  }
  // ...
}
```
_angular.json_

We can then use our locale definition in the build configuration to decide which locales must be generate during the build process. To do this, we must use the _localize_ option of the _build_ section of the _angular.json_ file:

``` json
{
  // ...
  "projects": {
    "my-app": {
      // ...
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "localize": true,
            "i18nMissingTranslation": "error",
            // ...
          },
          "configurations": {
            "production": {
              // ...
            },
            "development": {
              "localize": false,
              // ...
            },
            "es": {
              "localize": ["es"]
            },
            "pt": {
              "localize": ["pt"]
            }
          },
          "defaultConfiguration": "production"
        },
        // ...
      }
    }
  }
  // ...
}
```
_angular.json_

The supported values for _localize_ are:

- _true_, will generate the bundles for all the defined locales.
- _false_, will generate only the source language bundle.
- _["locale-id-1", "locale-id-2", ...]_, will generate only the specified locales bundles.

**When using _ng server_, the only allowed values for the _localize option are _false_ and _["locale-id-1"]_ (single element array).**

Another interesting property to configure in our _angular.json_ file is the _i18nMissingTranslation_ build option with the _error_ value that throws an error on build when a translation is missing. The default value allows the build and only display warning messages about translations.

Finally we can add new build configurations for specific locales and also use it to serve the app in a specific language. Just add new small changes to our _angular.json_ file:

``` json
{
  // ...
  "projects": {
    "my-app": {
      // ...
      "architect": {
        "build": {
          // ...
          "configurations": {
            // ...
            "es": {
              "localize": ["es"]
            },
            "pt": {
              "localize": ["pt"]
            }
          },
          // ...
        },
        "serve": {
          // ...
          "configurations": {
            // ...
            "es": {
              "browserTarget": "my-app:build:development,es"
            },
            "pt": {
              "browserTarget": "my-app:build:development,pt"
            }
          },
          // ...
        },
        // ...
      }
    }
  }
  // ...
}
```
_angular.json_

And the script to run our app in the specific language:

`ng serve --configuration=es`

`ng serve --configuration=pt`

> _Language not changing when debugging?_ When using the ASP.NET Core Angular template we could have problems when running the application locally with _ng serve_ modifying the locale to display. After running the application for the first time and shutting it down using Ctrl+C, if you restart the application after changing the _localize_ configuration to another _locale ID_, the previous process (Node.js connection listener) will still be alive and you will have to stop it manually to see your application in the new _localize_. To stop the above process we use the answer that fits our system and port according to this Stack Overflow question _["Port 4200 is already in use" when running the ng serve command](https://stackoverflow.com/questions/39091735/port-4200-is-already-in-use-when-running-the-ng-serve-command)_. You can find more information on how Node.js instances continue to run after debugging ASP.NET Core in the _[38897](https://github.com/dotnet/aspnetcore/issues/38897)_ GitHub topic _[38897](https://github.com/dotnet/aspnetcore/issues/38897)_.

Here is a [basic demo project with Angular internationalization](https://stackblitz.com/edit/angular-i18n-demo-rneto) in Stackblitz.

### App routing

Finally when generating our application, if _my-app_ is the directory containing the project files, when generating multiple languages, as many subdirectories will be generated as many as locale configurations we have set. For example, the Spanish version of _my-app_ will be in the _my-app/es_ directory.

Once the application is generated and deployed, it will take care of routing the user to the specific directory of each language based on the routing configuration specified in the _baseHref_ property of our _angular.json_ file for each locale.

By default, users will be redirected to the language indicated in the _Accept-Language_ HTTP header unless the path to a specific language is accessed. In all other cases where no language information is received, the default language of the application will be used.

### Using a default language other than en-US

By default Angular uses _en-US_ as default locale, so we need to make some change to rewrite the default locale source used in our app.

To set the app's locale source to _en_ (all the texts in the template are in Spanish):

- We set the _LOCALE_ID_ token to _es_ in the _app.module.ts_ file to propagate the locale throughout the application.
- We use the _registerLocaleData_ function in the _app.module.ts_ file to register the locale that Angular will use internally.
- We set the _i18n\sourceLocale_ property to _es_ in the _angular.json_ file to build only for this locale.

``` ts
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
})
export class AppModule {
  constructor() {
    registerLocaleData(localeEs);
  }
}
```
_app.module.ts_

``` json
{
  // ...
  "projects": {
    "my-app": {
      // ...
      "i18n": {
        "sourceLocale": "es"
      },
      "architect": {
        // ...
      }
    }
  }
  // ...
}
```
_angular.json_

---
<social-share class="social-share--footer" />