---
date: 2023-3-5
tags:
  - Angular
  - i18n
summary: Un paso básico en prácticamente todos los proyectos es configurar un sistema que nos permita idiomatizar nuestra aplicación Angular. En ese sentido, el uso del sistema de internacionalización oficial de Angular ...
permalink: /blog/:slug
---

# Internationalización (i18n) en Angular

<social-share class="social-share--header" />

Español | [English](/en/blog/angular-internationalization-i18n/)

Un paso básico en prácticamente todos los proyectos es configurar un sistema que nos permita idiomatizar nuestra aplicación. En ese sentido, el uso del sistema de internacionalización oficial de Angular nos permite estar más alineados con la evolución natural de Angular. Dicho sistema, basado en la generación de las traducciones en tiempo de compilación, crea tantas versiones de nuestra aplicación como diferentes idiomas hayamos definido, por lo que no necesitaremos un servicio de traducción o diccionario especial, simplemente tendremos los textos finales en la aplicación.

Cuando hablamos de traducciones en tiempo de compilación, Angular reemplaza cada texto marcado con el texto de traducción correspondiente del archivo de traducción. Este proceso se ejecuta una vez para cada idioma, por lo que finalmente terminaremos con un paquete de aplicación compuesto por varios paquetes, uno para cada idioma.

Tengamos en cuenta las ventajas de este sistema:

1. Más rendimiento porque no hay un diccionario de traducción cargado en memoria en tiempo de ejecución.
1. Más rendimiento porque no es necesario traducir el texto de cada aplicación en cada evento de detección de cambio de aplicación.
1. Mejor mantenibilidad por la mejor experiencia de desarrollo en la forma de usarlo.
1. Mejor mantenibilidad por utilizar un formato de archivo bien extendido como es XLIFF.

Y la principal desventaja:

1. Recarga de la aplicación al cambiar el idioma.

Este sistema incluye varios pasos básicos:

- Configuración inicial.
- Localización del contenido de la aplicación para formateo o extracción.
- Extracción de texto para traducciones.
- Generación de archivos de traducción.
- Construcción de un proyecto idiomatizado.

## Configuración inicial

El primer paso es instalar las dependencias necesarias utilizando Angular CLI:

`ng add @angular/localize`

Esto añadirá el paquete _@angular/localize_ y cargará la función `$localize` en el ámbito global.

Angular utiliza _Unicode locale ID_ para establecer la configuración regional (_localize_ en inglés, de ahí que a veces use la expresión _localizar_) de los datos, siendo su valor por defecto _en-US_. Si no, se puede especificar a través de la propiedad _sourceLocale_ en el archivo _angular.json_.

## Localización del contenido de la aplicación para formateo o extracción

El siguiente paso es preparar nuestro contenido para ser transformado de la forma correcta utilizando el idioma y la configuración regional basados en el _LOCALE_ID_ y para ser extraído y ser traducido externamente.

Para mostrar nuestros datos en el formato correcto contamos con [_Angular pipes_](https://angular.io/guide/pipes) que nos permite transformarlos en base a la configuración idiomática que hayamos establecido:

``` js
{{ myDateTime | date:'shortTime' }} // will be '5:15 PM' for 'en-US' and '17:15' for 'en-GB'
{{ myAmount | number }}  // will be '2,138.62' for 'es' and '2 138,62' for 'fr'
```

Para preparar nuestro contenido para ser extraído tenemos que utilizar el atributo _i18n_ y la función _$localize_ para marcar nuestras cadenas de texto como traducibles.

``` html
<p i18n>Text to translate.</p>
<ng-container i18n>Text to translate.</ng-container>
<img [src]="image.png" i18n-title title="Image title" i18n-alt alt="Image alt"/>
```
``` ts
private myText: $localize 'Text to translate';
private myText: $localize `Text to translate ${variable}`;
```

## Extracción de texto para traducciones

Después de preparar nuestro contenido para ser extraído, debemos utilizar Angular CLI para extraer a un archivo de traducciones base todas las cadenas marcadas. En este caso, crearé una nueva carpeta _locale_ durante el proceso de generación dentro de la cual se creará un nuevo archivo _messages.xlf_ con todos los textos marcados de nuestra aplicación.

`ng extract-i18n --output-path src/locale`

### Actualizar el archivo de traducción base

1. Realizamos los cambios en la aplicación.
1. Ejecutamos `ng extract-i18n --output-path src/locale` para actualizar el archivo _messages.xlf_.

## Generación de archivos de traducción

Es hora de crear y traducir cada archivo de configuración regional utilizando un editor de archivos XLIFF o crearlo y editarlo nosotros mismos:

1. Hacemos una copia del archivo de idioma fuente (_messages.xlf_ por defecto) en la misma carpeta _locale_ y lo renombramos con cada localización requerida (_message.{locale}.xlf_).
1. Añadimos un atributo _target-language_ al nodo _file_ con el código de localización, por ejemplo _target-language="es"_.
1. Buscamos el primer nodo _trans-unit_.
1. Duplicamos el nodo hijo _source_ y le cambiamos el nombre a _target_.
1. Traducimos el contenido del nodo _target_.
1. Repitimos los mismos pasos anteriores con cada nodo _trans-unit_.

Para ayudarnos a gestionar los archivos de traducción podemos utilizar la extensión [XLIFF Sync](https://marketplace.visualstudio.com/items?itemName=rvanbekkum.xliff-sync) y usamos el comando _Create New Target File(s)_ para configurar el entorno de proyecto para la extensión.

### Añadir nuevas configuraciones regionales

1. Hacemos una copia del archivo del idioma de origen y lo renombramos con la configuración regional requerida o utilizamos la extensión XLIFF Sync (_Create New Target File(s)_) para crear un nuevo archivo de destino (un nuevo idioma alternativo).
1. Cambiamos el archivo _angular.json_ para añadir la nueva configuración regional a la sección _projects -> Your.Project.Name -> i18n -> locales_. **Hablaré de esta sección más adelante.**

### Gestión de los archivos de traducción

- Utilizamos la extensión XLIFF Sync (comando _Synchronize Translation Units_) para sincronizar todas las unidades de traducción entre el archivo base y todos los idiomas alternativos.
- Podemos editar los archivos de destino manualmente o si utilizamos un servicio externo (por ejemplo, https://smartcat.com/) para traducirlos, y luego utilizar la extensión XLIFF Sync (comando _Import Translations from File(s)_) para copiar las traducciones de los archivos seleccionados a los archivos de destino con el mismo idioma (recordemos comprobar los atributos de archivo _source-language_ y _target-language_ del archivo de traducción de origen para asegurarse de que funciona correctamente).

## Construcción de un proyecto idiomatizado

Lo primero que tenemos que hacer es definir todas las configuraciones regionales soportadas utilizando la propiedad _i18n_ del proyecto en el archivo _angular.json_:

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

Entonces podemos usar nuestra definición de configuración regional en la configuración de compilación para decidir qué localizaciones deben generarse durante el proceso de compilación. Para ello, debemos utilizar la opción _localize_ de la sessión _build_ del archivo _angular.json_:

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

Los valores admitidos para _localize_ son:

- _true_, generará los paquetes para todas las configuraciones regionales definidas.
- _false_, generará sólo el paquete del idioma de origen.
- _["locale-id-1", "locale-id-2", ...]_, generará sólo los paquetes de las localizaciones especificadas.

**Cuando se utiliza _ng server_, los únicos valores permitidos para la opción _localize son _false_ y _["locale-id-1"]_ (matriz de un solo elemento)**.

Otra propiedad interesante para configurar en nuestro archivo _angular.json_ es la opción de compilación _i18nMissingTranslation_ con el valor _error_ que lanza un error en la compilación cuando falta una traducción. El valor por defecto permite la compilación y sólo mensajes de advertencia sobre las traducciones.

Por último, podemos añadir nuevas configuraciones de compilación para locales específicos y también utilizarlo para servir la aplicación en un idioma específico. Sólo hay que añadir nuevos pequeños cambios a nuestro archivo _angular.json_:

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

Y el script para ejecutar nuestra aplicación en el idioma específico:

`ng serve --configuration=es`

`ng serve --configuration=pt`

> _¿No cambia el idioma al depurar?_ Cuando se utiliza la plantilla ASP.NET Core Angular podríamos tener problemas al ejecutar la aplicación localmente con _ng serve_ modificando la configuración regional a mostrar. Después de ejecutar la aplicación por primera vez y apagarla usando Ctrl+C, si reiniciamos la aplicación después de cambiar la configuración _localize_ a otro _locale ID_, el proceso anterior (Node.js connection listener) seguirá vivo y deberemos pararlo manualmente para ver tu aplicación en el nuevo _localize_. Para parar el proceso anterior utilizamos la respuesta que se ajuste a nuestro sistema y puerto según esta pregunta de Stack Overflow _["Port 4200 is already in use" when running the ng serve command](https://stackoverflow.com/questions/39091735/port-4200-is-already-in-use-when-running-the-ng-serve-command)_. Puedes encontrar más información sobre cómo las instancias de Node.js continúan ejecutándose después de depurar ASP.NET Core en el tema _[38897](https://github.com/dotnet/aspnetcore/issues/38897)_ de GitHub.

Aquí hay un [proyecto básico de demostración con internacionalización Angular](https://stackblitz.com/edit/angular-i18n-demo-rneto) en Stackblitz.

### Enrutamiento de aplicaciones

Por último al generar nuestra aplicación, si _my-app_ es el directorio que contiene los ficheros del proyecto, al generar múltiples idiomas, se generarán tantos subdirectorios como configuraciones regionales hayamos establecido. Por ejemplo, la versión en español de _my-app_ estará en el directorio _my-app/es_.

Una vez generada y desplegada la aplicación, ésta se encargará de enrutar al usuario al directorio específico de cada idioma en función de la configuración de enrutamiento especificada en la propiedad _baseHref_ de nuestro archivo _angular.json_ para cada configuración regional.

Por defecto, los usuarios serán redirigidos al idioma indicado en la cabecera HTTP _Accept-Language_ a menos que se acceda a la ruta de un idioma específico. En todos los demás casos en los que no se reciba información sobre el idioma, se utilizará el idioma por defecto de la aplicación.

### Utilizar un idioma por defecto distinto de en-US

Por defecto Angular usa _en-US_ como configuración regional por defecto, así que necesitamos hacer algún cambio para reescribir la configuración por defecto usada en nuestra app.

Para establecer la configuración regional de la aplicación a _es_ (todos los textos de la plantilla los tenemos en español):

- Establecemos el token _LOCALE_ID_ a _es_ en el archivo _app.module.ts_ para propagar la configuración regional a través de la aplicación.
- Usamos la función _registerLocaleData_ en el archivo _app.module.ts_ para registrar la configuración regional que usará internamente Angular.
- Establecemos la propiedad _i18n\sourceLocale_ a _es_ en archivo _angular.json_ para generar la aplicación sólo para esta configuración regional.

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
