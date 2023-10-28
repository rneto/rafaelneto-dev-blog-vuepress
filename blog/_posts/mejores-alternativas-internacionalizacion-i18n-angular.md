---
date: 2023-10-28
tags:
  - Angular
  - i18n
summary: La internacionalización es un aspecto fundamental en el desarrollo de aplicaciones modernas y la capacidad de ofrecer nuestra aplicación en diferentes idiomas es esencial para llegar a una audiencia global. Angular, ...
permalink: /blog/:slug
---

# Mejores alternativas para la internationalización (i18n) en Angular

<social-share class="social-share--header" />

<!-- Español | [English](/en/blog/best-angular-internationalization-i18n-alternatives/) -->

La internacionalización es un aspecto fundamental en el desarrollo de aplicaciones modernas y la capacidad de ofrecer nuestra aplicación en diferentes idiomas es esencial para llegar a una audiencia global. Angular, uno de los marcos de desarrollo web más populares, ofrece una [solución nativa para la internacionalización](/blog/internacionalizacion-i18n-angular/) basado en la generación de las traducciones en tiempo de compilación, pero en este artículo también quisiera explorar otras vías alternativas bastante interesantes como son la creación de un servicio desarrollado a medida para la traducción de contenidos, el uso de las librería [Transloco](https://github.com/ngneat/transloco/) o [@ngx-translate/core](https://github.com/ngx-translate/core)

## El Desafío de la Internacionalización en Angular

Antes de profundizar en las diferentes opciones, creo que es importante entender el enfoque nativo de Angular para la internacionalización y porqué es completamente distinto al resto de alternativas.

El enfoque propuesto por el equipo de Angular se basa en la generación de traducciones en tiempo de compilación, lo que significa que se crean múltiples versiones de la aplicación, una por cada idioma, las cuales se despliegan en bloque en nuestro servidor, ello implica que cada vez que el sistema detecta un cambio de idioma, la aplicación se debe recargar por completo en el nuevo idioma. Si bien este sistema funciona perfectamente y tiene múltiples ventajas, podríamos encontrarnos con problemas durante el proceso de despliegue, especialmente si necesitamos alojar todos los idiomas de nuestra aplicación en la misma ruta.

Por otro lado, las demás opciones que aquí planteo como alternativa para la internalización en Angular, siempre harán uso de un servicio de traducción injectado en el código que se encargará de aplicar los diccionarios de traducción en tiempo de ejecución.

Estas son las opciones que vamos a explorar en el presente artículo:

1. **[@angular/localize, el módulo de internacionalización incorporado en Angular](#angular-localize-el-modulo-de-internacionalizacion-incorporado-en-angular).**
2. **[Servicio de traducción personalizado para Angular](#servicio-de-traduccion-personalizado-para-angular).**
3. **[Transloco, una completa librería para la internacionalización en Angular](#transloco-una-completa-libreria-para-la-internacionalizacion-en-angular).**
4. **[@ngx-translate/core, una popular librería pero abandonada en gran medida](#ngx-translate-core-una-popular-libreria-pero-abandonada-en-gran-medida).**


### @angular/localize, el módulo de internacionalización incorporado en Angular

El sistema de internacionalización (i18n) nativo de Angular es una característica esencial para adaptar aplicaciones web a diferentes idiomas y regiones. Ofrece un alto rendimiento al generar traducciones en tiempo de compilación, lo que mejora la eficiencia y facilita el mantenimiento de las aplicaciones. Además, lleva implícita la internacionalización de fechas y números mediante _pipes_ por lo que brinda una experiencia completamente de localización durante nuestro desarrollo.

#### Ventajas de Angular i18n

1. **Alto rendimiento**: Una de las ventajas clave es su alto rendimiento. Esto se debe a que las traducciones se generan en tiempo de compilación, con lo que no se necesita la carga en memoria de un diccionario de traducción durante la ejecución de la aplicación. Esto se traduce en una aplicación más rápida y eficiente.

2. **Mejor mantenibilidad**: El sistema promueve una experiencia de desarrollo eficiente al utilizar el formato de archivo XLIFF para gestionar las traducciones. Esto hace que el proceso de traducción y mantenimiento sea más sencillo y escalable.

3. **Internacionalización completa**: Este sistema no se limita a la traducción de textos, sino que también permite la internacionalización de fechas y números mediante pipes personalizadas. Esto es fundamental para ofrecer una experiencia de desarrollo completa.

#### Características principales de Angular i18n

1. **Generación en tiempo de compilación**: Angular reemplaza cada texto marcado con su equivalente traducido durante el proceso de compilación. Cada idioma se compila en una versión separada de la aplicación. Esto elimina la necesidad de cargar un diccionario de traducción en tiempo de ejecución y mejora el rendimiento.

2. **Uso de marcadores (i18n)**: Para marcar el contenido que debe ser traducido, se utiliza el atributo `i18n`. Este marcador se coloca en elementos HTML y componentes Angular que deben ser traducidos. También se utiliza la función `$localize` para marcar cadenas de texto traducibles.

3. **Extracción de textos para traducciones**: Después de marcar el contenido, utilizamos Angular CLI para extraer estas cadenas marcadas a un archivo de traducciones base. Esto se logra con el comando `ng extract-i18n`.

4. **Configuración regional personalizada**: Podemos configurar la configuración regional (localización) a través del archivo `angular.json`, lo que nos permite definir las traducciones para diferentes idiomas y regiones.

#### Dato interesante

Cuando se cambia el idioma, es importante destacar que la aplicación se recarga automáticamente, sin embargo, el sistema proporciona un alto rendimiento durante este proceso gracias a su generación en tiempo de compilación. Esta característica es fundamental para garantizar que los usuarios obtengan la experiencia localizada deseada sin comprometer la velocidad y eficiencia de la aplicación.

Para profundizar más en detalle sobre este sistema, te recomiendo que le eches un vistazo a este otro artículo que he escrito sobre la [solución nativa propuesta por Angular para la internacionalización de aplicaciones](/blog/internacionalizacion-i18n-angular/).

### Servicio de traducción personalizado para Angular

Esta otra propuesta nos brinda una solución más personalizada si deseamos tener el control total sobre las traducciones en nuestra aplicación Angular y en la cual consideramos la necesidad de crear un servicio y mecanismo de traducción completamente personalizado. En este enfoque, podemos almacenar las traducciones en archivos JSON internamente en nuestra aplicación y donde cada archivo contendrá los textos traducidos para un idioma específico. Luego, mediante un servicio de Angular personalizado, podemos cargar y gestionar estas traducciones en tiempo de ejecución a lo largo de nuestra aplicación.

Esto nos brinda la flexibilidad de agregar, actualizar y personalizar las traducciones según nuestras necesidades y de adaptar a nuestras necesidades específicos los mecanismos de traducción. Debemos tener en cuenta que con esta alternativa, también es esencial implementar un mecanismo para cambiar dinámicamente el idioma en nuestra aplicación y recargar las traducciones cuando sea necesario.

Esta opción, aunque requiere de más desarrollo personalizado, es una elección sólida si buscamos un mayor control y escalabilidad en la gestión de traducciones o si inclusive necesitamos una solución muy sencilla por las propias necesidades de nuestra aplicación.

A continuación, plantearé un ejemplo completo de una sencilla implementación para el servicio de traducción personalizado de una aplicación Angular, incluyendo la configuración, el servicio y cómo usarlo en un componente. Para simplificar el ejemplo, asumiremos que solo estamos trabajando con dos idiomas: inglés (en) y español (es). Los archivos de traducción se almacenarán en archivos JSON en la propia aplicación.

1. **Configuración inicial:**

    En primer lugar, configuramos los archivos JSON de traducción en la aplicación. Crearemos dos archivos, `en.json` y `es.json`, para los idiomas inglés y español respectivamente.

    ``` json
    // en.json
    {
      "greeting": "Hello",
      "message": "Welcome to our application"
    }
    ```

    ``` json
    // es.json
    {
      "greeting": "Hola",
      "message": "Bienvenido a nuestra aplicación"
    }
    ```

2. **Crear el servicio de traducción:**

    Luego, crearemos un servicio de traducción personalizado que cargará y gestionará estas traducciones en tiempo de ejecución. Crearemos un servicio llamado `TranslationService` y utilizaremos el módulo `HttpClient` de Angular para cargar los archivos JSON.

    ``` ts
    // translation.service.ts
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })
    export class TranslationService {
      private translations: any = {};

      constructor(private http: HttpClient) { }

      loadTranslations(lang: string): Observable<any> {
        return this.http.get(`/assets/${lang}.json`);
      }

      setLanguage(lang: string): void {
        this.loadTranslations(lang).subscribe((translations: any) => {
          this.translations = translations;
        });
      }

      translate(key: string): string {
        return this.translations[key] || key;
      }
    }
    ```

3. **Usar el servicio en un componente:**

    Ahora, podemos utilizar el servicio de traducción en un componente Angular. Por ejemplo:

    ``` ts
    // app.component.ts
    import { Component } from '@angular/core';
    import { TranslationService } from './translation.service';

    @Component({
      selector: 'app-root',
      template: `
        <h1>{{ translationService.translate('greeting') }}</h1>
        <p>{{ translationService.translate('message') }}</p>
        <button (click)="changeLanguage('es')">Cambiar a Español</button>
        <button (click)="changeLanguage('en')">Switch to English</button>
      `
    })
    export class AppComponent {
      constructor(private translationService: TranslationService) {}

      changeLanguage(lang: string): void {
        this.translationService.setLanguage(lang);
      }
    }
    ```

4. **Configuración del módulo:**

    No olvidemos importar el módulo `HttpClientModule` en tu módulo principal y proporcionar el servicio de traducción en la lista de proveedores.

    ``` ts
    // app.module.ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { HttpClientModule } from '@angular/common/http';
    import { AppComponent } from './app.component';
    import { TranslationService } from './translation.service';

    @NgModule({
      declarations: [AppComponent],
      imports: [BrowserModule, HttpClientModule],
      providers: [TranslationService],
      bootstrap: [AppComponent]
    })
    export class AppModule {}
    ```

Con esto, tendríamos un sencillo servicio de traducción personalizado que nos permitiría cambiar dinámicamente entre idiomas y gestionar traducciones en nuestra aplicación Angular. A medida que agreguemos más idiomas y traducciones, simplemente deberíamos crear los archivos JSON correspondientes y actualizar el servicio para cargarlos.

Una posible evolución del servicio podría ser permitir la configuración de un idioma por defecto para cuando no encontremos traducciones en el idioma indicado o inclusive también podríamos añadir un parámetro opcional al método _translate_ en el cual poder indicar argumentos y traducir textos del tipo _Hola {0}_.

### Transloco, una completa librería para la internacionalización en Angular

[Transloco](https://github.com/ngneat/transloco/) es una biblioteca de internacionalización para Angular que aunque aborda los mismos desafíos que el sistema nativo de Angular, lo hace con un enfoque completamente diferente ya que en lugar de generar múltiples versiones de la aplicación, las traducciones se cargan de manera eficiente en tiempo de ejecución, lo que significa que podemos cambiar el idioma de la aplicación sin necesidad de recargarla.

Es una alternativa avanzada, completa y consolidada a nuestra humilde propuesta de servicio de traducciones personalizado planteada anteriormente en este artículo.

#### Ventajas de Transloco

1. **Carga eficiente**: Una de las principales ventajas de Transloco es su capacidad para cargar traducciones de manera eficiente en tiempo de ejecución. Esto significa que no es necesario que recarguemos toda la aplicación al cambiar el idioma, con lo que se mejora significativamente la experiencia del usuario.

2. **Facilidad de implementación**: Transloco se integra de manera sencilla en un proyecto Angular existente. No necesitamos generar múltiples versiones de la aplicación ni preocuparnos por problemas de despliegue complicados. Con Transloco, podemos mantener una única instancia de la aplicación y cambiar el idioma de manera dinámica.

3. **Soporte completo para traducciones**: Transloco no se limita solo al texto, sino que también es capaz de gestionar la internacionalización de fechas y números a través de pipes personalizadas. Esto es esencial para ofrecer una experiencia de usuario completamente localizada.

#### Implementando Transloco en tu Aplicación Angular

Para comenzar a usar Transloco en tu aplicación, debemos seguir los siguientes pasos:

1. **Instalación de Transloco:**

    En primer lugar debemos instalar Transloco en nuestro proyecto Angular. Para ello contamos con un asistente que ajustará nuestra aplicación con todo lo necesario mediante la ejecución del siguiente script y la respuesta de las preguntas que nos serán planteadas:

    ``` bash
    ng add @ngneat/transloco
    ```

2. **Configuración inicial generada:**

    Una vez instalado Transloco, podemos comprobar que se han producido los siguientes cambios en nuestra aplicación:
      - Se habrán creado los ficheros JSON a los que añadir nuestras traducciones.
      - Se habrá creado la clase _TranslocoHttpLoader_ que es la encargada de hacer disponibles en el servicio de tradución nuestros ficheros de traducción.
      - Se habrá creado el módulo _TranslocoRootModule_ donde se establece la configuración predeterminada para transloco.
      - Se habrá añadido al _AddModule_ el nuevo _TranslocoRootModule_.

3. **Integración en componentes:**

    Podemos utilizar las directivas y pipes en nuestras plantillas HTML y los servicios proporcionados por Transloco para internacionalizar nuestra aplicación y cargar dinámicamente las traducciones.

    ``` js
    <ng-container *transloco="let t">
      <p>{{ t('hello') }}</p>

      <comp [hello]="t('hello')"></comp>
    </ng-container>
    ```

    ``` js
    <span>{{ 'hello' | transloco }}</span>
    ```

    ``` js
    <span transloco="hello"></span>
    ```

    ``` ts
    export class AppComponent {
      constructor(private translocoService: TranslocoService) {}

      ngOnInit() {
        this.translocoService.translate('hello');
      }
    }
    ```

4. **Cambio dinámico de idioma:**

    Transloco permite cambiar el idioma de nuestra aplicación en tiempo de ejecución. Para ello podríamos implementar un selector de idioma que permita a los usuarios cambiar el idioma según sus preferencias o basarnos en las propiedades de nuestro usuario para establecer el idioma de la aplicación. Para ello contamos con algunos servicios a tener en cuenta:

    ``` ts
    export class AppComponent {
      constructor(private translocoService: TranslocoService) {}

      ngOnInit() {
        // Conocer el idioma predeterminado.
        // Es el idioma utilizado cuando no se encuentre una traducción en el idioma activo.
        const defaultLang = this.translocoService.getDefaultLang();

        // Establecer el idioma predeterminado.
        // También podemos establecerlo en la configuración de nuestro _TranslocoRootModule_.
        this.translocoService.setDefaultLang('es-ES');

        // Conocer el idioma activo.
        const activeLang = this.translocoService.getActiveLang();

        // Establecer el idioma activo.
        this.translocoService.setActiveLang('en-US');
      }
    }
    ```

5. **Plugins imprescindibles:**

    Transloco cuenta con un sistema de extensión basado en plugins, entre los cuales hay dos que considero imprescindibles tener en cuenta:

    1. **Locale L10N**: Tras instalarlo y añadirlo a nuestro _TranslocoRootModule_, este plugin añade soporte de localización (_l10n_) a Transloco, con lo que podremos localizar fechas y números mediante _pipes_ en nuestras plantillas: ```<span> {{ date | translocoDate }} {{ 1234 | translocoCurrency }} {{ 1234.5 | translocoDecimal }} </span>```
    2. **Persist Lang**: Tras instalarlo y añadirlo a nuestro _TranslocoRootModule_, este plugin añade a nuestra aplicación la capacidad de almacenar el idioma activo en la aplicación. Además de manera automática, cuando el usuario cambie el idioma actual, éste se almacenará automáticamente y se establecerá como activo cuando el usuario regrese a la aplicación.

Puedes seguir profundizando en la librería a través de la documentación que puedes encontrar en el [repositorio oficial de Transloco en GitHub](https://github.com/ngneat/transloco/).

### @ngx-translate/core, una popular librería pero abandonada en gran medida

[@ngx-translate/core](https://github.com/ngx-translate/core), es una popular biblioteca de internacionalización para aplicaciones Angular que ha sido ampliamente utilizada y apreciada por la comunidad de desarrolladores durante muchos años. Su historia se remonta a los primeros días de _Angular 2_ y ha evolucionado para adaptarse a las sucesivas versiones de Angular. Ahí es donde ahora mismo radica su abandono, ya que está en estado de mantenimiento y sólo tiene previsto tener actualizaciones para mantener su compatibilidad con futuras versiones de Angular.

En sus primeras versiones, `ngx-translate` se utilizó para superar las limitaciones del sistema de internacionalización nativo de Angular, el cual se encontraba aún en estado de desarrollo. Proporcionaba de una forma eficiente de gestionar las traducciones y facilitaba la internacionalización de aplicaciones Angular en un momento en que no había muchas alternativas sólidas.

Al igual que hemos visto hasta ahora, `ngx-translate` también se destacaba por su simplicidad y facilidad de uso. Permitía cargar archivos de traducción como JSON en la aplicación y proporcionaba un mecanismo sencillo para cambiar el idioma en tiempo de ejecución.

Es muy probable que a lo largo de nuestra trayectoria como desarrolladores Angular acabemos conociendo más de proyecto que usa o ha usado en el pasado `ngx-translate` ya que ha sido ampliamente adoptado en muchas aplicaciones Angular, desde pequeños proyectos hasta grandes aplicaciones empresariales.

Sin embargo, a medida que Angular ha evolucionado y ha introducido su propio sistema de internacionalización en versiones posteriores, `ngx-translate` se ha enfrentado algunos desafíos y limitaciones. Es el caso por ejemplo del mantenimiento de la librería. Con la llegada de Angular i18n, `ngx-translate` empezó a perder seguimiento por parte de la comunidad y ha enfrentado desafíos en términos de compatibilidad y mantenimiento continuo. Es el caso por ejemplo del propio creador de la librería, que trabajó durante más de 2 años en Google potenciando el sistema de internacionalización nativo de Angular, lo que lógicamente afectó a la evolución de la librería y que creo condicionó la decisión definitiva de poner la librería en estado de mantenimiento.

Además de ello, también me he encontrado con limitaciones en cuanto a la existencia de _pipes_ y herramientas para la transformación de contenidos en las plantillas, por lo que acaba siendo imprescindible la creación clases y herramientas personalizadas para poder suplir dicha carencia.

Su historia y legado en la comunidad de Angular son indiscutibles, y ha sido fundamental para brindar soporte a aplicaciones multilingües durante muchos años, así que a pesar de estas limitaciones, `ngx-translate` sigue siendo una opción sólida para proyectos más antiguos, siempre y cuando no sean válidas algunas de las propuestas que he hecho anteriormente.

Puedes conocer más sobre la librería en la documentación que puedes encontrar en el [repositorio oficial de @ngx-translate/core en GitHub](https://github.com/ngx-translate/core).

---
<social-share class="social-share--footer" />
