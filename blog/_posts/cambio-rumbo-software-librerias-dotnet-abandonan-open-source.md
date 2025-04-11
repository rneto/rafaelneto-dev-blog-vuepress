---
date: 2025-4-11
tags:
  - .NET
summary: En los últimos años hemos sido testigos de un fenómeno que no puede dejarnos indiferentes y que para algunos, puede llegar a ser preocupante para su ecosistema en el desarrollo de software, particularmente en el ámbito de .NET y C#.
permalink: /blog/:slug
---

# El cambio de rumbo en el software: Librerías de .NET que abandonan el open source

<social-share class="social-share--header" />

En los últimos años hemos sido testigos de un fenómeno que no puede dejarnos indiferentes y que para algunos, puede llegar a ser preocupante en su ecosistema en el desarrollo de software, particularmente en el ámbito de .NET y C#. Hablo de herramientas y librerías que durante mucho tiempo han sido piezas fundamentales en el movimiento open source, pero que han empezado a migrar hacia modelos comerciales, lo que nos fuerza a reevaluar nuestras estrategias a futuro. Hablo por ejemplo del movimiento de IdentityServer hace años y más recientemente de MediatR y AutoMapper, dos herramientas esenciales para la mediación en patrón CQRS en .NET y el mapeo de objetos, que se unen a la lista según las [últimas noticias](https://github.com/AutoMapper/AutoMapper/discussions/4536).

#### IdentityServer: El pionero del cambio

IdentityServer, una librería clave en la implementación de autenticación y autorización basada en estándares como OpenID Connect y OAuth 2.0, fue uno de los últimos casos destacados en este giro. Durante años, fue un proyecto open source que nos facilitó a los desarrolladores la construcción de sistemas seguros sin costes adicionales, sin embargo, en 2021, con el lanzamiento de IdentityServer 5 (bajo el nombre de Duende Software) anunciaron que las nuevas versiones pasarían a un modelo de licencia comercial. Afortunadamente la comunidad ha seguido manteniendo la versión 4 (que seguiría siendo gratuita).

El motivo que condicionó el cambio fue claro, la necesidad de financiar el desarrollo continuo y soporte del proyecto. Mantener un proyecto de esa magnitud requiere mucho tiempo, esfuerzo y recursos, lo que a pesar de las contribuciones de la comunidad, no siempre es suficiente.

Personalmente creo que hubiera sido el momento de que Microsoft se implicara en la creación de su propia solución de autenticación y autorización integrada en ASP.NET Core, pero hizo todo lo contrario al promover soluciones como Azure AD (Entra ID) y más viendo los pasos que ha ido dando con ASP.NET Core Identity, quedando enfocada a una autenticación muy básica y que no cubre los estándares avanzados como OpenID Connect y OAuth 2.0.

De esa necesidad, una vez más la comunidad respondió llenando ese vacío con librerías como OpenIddict como alternativa a tener en cuenta. Es una de las partes que más me apasionan del desarrollo de software: si lo necesitas, puedes crearlo.

#### MediatR y AutoMapper: El impacto notable más reciente

Y ahora llegamos a 2025, donde dos proyectos icónicos del ecosistema .NET han seguido un camino similar, MediatR y AutoMapper. MediatR, es una implementación del patrón Mediator y que se usa para simplificar la comunicación entre componentes en aplicaciones C#. Por otro lado, AutoMapper es una herramienta para mapear objetos de manera sencilla y eficiente. Ambas llevan muchos años siendo usadas en nuestros proyectos como recursos básicos fundamentales, la primera al aplicar una arquitectura CQRS en .NET y la segunda para simplificar las tareas de mapeo de objetos traspasados entre capas.

La transición de MediatR y AutoMapper a un modelo comercial no implica que dejen de ser accesibles por completo. Las versiones anteriores seguirán disponibles bajo licencias open source, sin embargo, las nuevas funcionalidades, actualizaciones y soporte oficial requerirán de una suscripción. De mismo modo que con IdentityServer, responde a la necesidad de financiar su desarrollo continuo.

Es normal que el tiempo dedicado a estas librerías de manera altruista, deriven en este cambio de modelo más si cabe cuando cada vez más productos comerciales se benefician de ese mantenimiento y nuevas características que no dejan de crecer.

#### Otros casos en el radar

Aunque por más sonados y por implicaciones directas, me gusta destacar IdentityServer, MediatR y AutoMapper, no son los únicos casos. En los últimos meses, otras librerías populares en el ecosistema .NET han buscado vías de financiación como por ejemplo:

-  **FluentAssertions**: Una herramienta para escribir aserciones más legibles en pruebas unitarias en .NET, conocida por su API fluida, introdujo recientemente un modelo comercial para ciertas características avanzadas o un soporte premium, aunque mantiene una versión base gratuita para proyectos no comerciales.

-  **ImageSharp**: Una librería de procesamiento de imágenes, evolucionó a hacia un modelo híbrido donde en algunos contextos requieren una licencia comercial, mientras que la base sigue siendo open source según su uso.

-  **OpenIdict**: Es una librería que proporciona una solución flexible para implementar un stack propio de autenticación y autorización basado en los estándares OAuth 2.0 y OpenID Connect en aplicaciones .NET, que a pesar de ser open source, ofrece soporte oficial premium a patrocinadores y colaboradores del proyecto.

Creo que estos casos reflejan una tendencia bastante clara de que el open source, tal como lo entendíamos, está evolucionando hacia un modelo híbrido donde el acceso gratuito coexiste con otras opciones que permiten hacer económicamente viable el mantenimiento y evolución del proyecto.

#### Factores que impulsan el cambio hacia modelos comerciales

Creo que hay varios factores que lo explican:

1.  **Sostenibilidad económica**: La comunidad que mantiene los proyectos open source a menudo trabaja gratis o depende de donaciones esporádicas, con lo que a medida que las librerías crecen en uso y complejidad, se hace cada vez más complejo mantenerlas sin ingresos estables.

2.  **Uso empresarial extendido**: Muchas de estas herramientas son usadas por empresas de todo tipo, inclusive las que generan muchos ingresos gracias a este tipo de desarrollos, así que es lógico que los creadores busquen que estas grandes organizaciones contribuyan económicamente.

3.  **Competencia y expectativas**: El acelerado ritmo evolutivo en el mundo del desarrollo de software exige actualizaciones cada vez más constantes, compatibilidad con nuevas versiones de .NET y soporte técnico. Esto requiere muchos recursos que el modelo open source tradicional no siempre puede garantizar.

#### Impacto del cambio en la comunidad .NET

Esta tendencia plantea varias consideraciones importantes para la comunidad de desarrollo .NET y C#:

1.  **Evaluación de costes y oportunidades**: Para quienes hacemos uso de este tipo de librerías, el cambio plantea retos y oportunidades. Por un lado, el coste adicional podría llegar a ser un obstáculo, y por otro lado, el modelo comercial debería garantizar un desarrollo más robusto y soporte dedicado, algo que beneficiaría a quienes pueden pagarlo. Llega el momento de evaluar costes a la hora de planificar nuevos proyectos o actualizar los ya existentes.

2.  **Búsqueda de alternativas**: Es muy probable que veamos un aumento en la búsqueda y desarrollo de soluciones alternativas open source para suplir estos nuevos modelos comerciales.

3. **Contribución en proyectos existentes**: No olvidemos la importancia y responsabilidad que tenemos los desarrolladores de apoyar y contribuir con los proyectos open source. Creo que estas transiciones abrirán un debate necesario sobre cómo podemos apoyar de manera sostenible a los creadores de código open source. Debemos apoyar activamente, ya sea contribuyendo con código, documentación, soporte o donaciones con este tipo de proyectos.

4. **Claridad en las licencias**: Es fundamental que comprendamos las implicaciones en nuestros desarrollos de las dependencias de las que hacemos uso y las licencias que tienen, con el objetivo de evitar problemas legales en el futuro. Pero también es cierto que debería haber más transparencia en los modelos de licencia, ya que a veces puede llegar a ser confusa.

#### ¿Hacia dónde vamos?

El futuro del desarrollo en .NET parece dirigirse hacia un equilibrio entre lo gratuito y lo comercial. Esto nos recuerda que el desarrollo de software es un esfuerzo en constante evolución. La comunidad podría responder de diversas maneras: manteniendo forks de versiones antiguas, desarrollando nuevas alternativas open source o integrando más activamente estos modelos híbridos en nuestros proyectos. Lo cierto es que el debate sobre cómo financiar esa parte del código que usamos todos los días y sin coste, está muy vivo.

Como desarrolladores (y las empresas para las que trabajamos), debemos reflexionar. ¿Estamos dispuestos a asumnir los costes de las herramientas que nos ahorran mucho tiempo de trabajo? ¿Deberíamos implicarnos más en los proyectos open source de manera activa para hacerlos viables en el tiempo? No hay una única respuesta posible, pero el cambio es real y ya está aquí. Como desarrolladores debemos mantenernos informados, evaluar nuestras opciones cuidadosamente y seguir contribuyendo a una comunidad .NET brillante.

---
<social-share class="social-share--footer" />
