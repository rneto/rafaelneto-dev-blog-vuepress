---
date: 2023-2-28
tags:
  - ASPNETCore
  - AzureAD
  - OAuth2
  - OIDC
  - seguridad
summary: Un flujo de autorización es lo que permite que una aplicación cliente, como aplicaciones web, aplicaciones de escritorio, teléfonos móviles, dispositivos IoT y otros consumidores, ...
permalink: /blog/:slug
---

# Flujos de autorización con OAuth 2.0 y openID Connect

<social-share class="social-share--header" />

Español | [English](/en/blog/authorization-flows-oauth-2-0-openid-connect/)

Un flujo de autorización es lo que permite que una aplicación cliente, como aplicaciones web, aplicaciones de escritorio, teléfonos móviles, dispositivos IoT y otros consumidores, obtengan acceso autorizado a recursos protegidos, como APIs web y archivos entre otros. OAuth 2.0 se centra en la simplicidad para el desarrollador del cliente al tiempo que proporciona flujos de autorización específicos, que se enriquecen mediante el uso de OpenID Connect como una capa de identidad simple sobre el protocolo OAuth 2.0.

## OAuth 2.0

OAuth 2.0 es un marco de autorización estándar que permite un mayor control sobre el alcance de una aplicación y los flujos de autorización a través de múltiples sistemas. OAuth 2.0 tiene que ver con el acceso a recursos con alcances granulares que le otorgan permisos en nombre de un usuario.

Antes de OpenID Connect, se usaba OAuth 2.0 para autenticación y autorización, pero el problema era que con OAuth no teníamos la información del usuario porque a OAuth no le importa quién es el usuario. OAuth fue diseñado para permisos y alcances, pero hubieron muchas empresas (Facebook, Google, Twitter, etc.) que usaban OAuth 2.0 para su proceso de autenticación. Todos ellos necesitaron crear una implementación personalizada para suplir las carencias del protocolo relacionadas con la identificación del usuario (y por eso cierta documentación nos confunde).

OAuth 2.0 se usó para delegar la autorización, así como en exceso para la autenticación con inicio de sesión simple, SSO e inicio de sesión en aplicaciones móviles.

## OpenID Connect (OIDC)

OpenID Connect es una capa de identidad adicional (una extensión) sobre el protocolo OAuth 2.0 mediante el uso del flujo de mensajes estandarizado de OAuth 2.0 basado en JSON y HTTP, para proporcionar un nuevo protocolo de servicios de identidad para la autenticación, que permite a las aplicaciones verificar y recibir la información del perfil de usuario de los usuarios registrados.

> OAuth 2.0 + Identidad + Autenticación = **OpenID Connect**

OpenID Connect añade a OAuth 2.0:

- Token de identidad que representa cierta información del usuario.
- Puntos de acceso para verificar la información de identidad y obtener más información del usuario.
- Ámbitos (_scopes_) y notificaciones (_claims_) estándar específicos para la identidad.
- Implementación estandarizada.
- Un documento de descubrimiento en el que el servidor publica sus metadatos a través de la conocida URL (_https://my-iodc-server.com/.well-known/openid-configuration_).

OpenID Connect permite a los desarrolladores liberarse de la difícil y peligrosa responsabilidad de almacenar y gestionar las contraseñas de las personas, también identifica los atributos personales que pueden intercambiarse entre los proveedores de identidad y las aplicaciones que los utilizan, e incluye un paso de aprobación en el que el usuario puede consentir o denegar el intercambio de esta información.

Por lo tanto, deberíamos utilizar OAuth 2.0 para la autorización, es decir, para conceder acceso a las API y obtener acceso a los datos de usuario en otros sistemas, y OpenID Connect para la autenticación, es decir, para registrar al usuario y para que un usuario esté disponible en otro sistema.

### Implementaciones de OpenID Connect

[Bibliotecas, servidores, servicios y proveedores con implementaciones certificadas de OpenID Connect](https://openid.net/developers/certified/).

### Conceptos clave

- _Client ID_: Identifica al cliente (aplicación) en el servidor de autorización.
- _Client secret_: La contraseña/clave privada que sólo conocen el cliente y el servidor de autorización.
- _Authorization code_: Es un código temporal devuelto por el servidor de autenticación y utilizado con el secreto de cliente por la aplicación para intercambiar por el token de acceso y el token de identificación.
- _Access token_ (token de acceso): Es la clave que utilizará el cliente para solicitar datos al servidor de recursos.
- _ID token_ (token de identificación): Es la información del perfil de usuario devuelta de forma segura por el servidor de autenticación en formato JWT. Puede ampliarse llamando al endpoint _user_info_ y debe ser comprobado por el cliente para asegurarse de que el _aud_ (audiencia, es decir, cliente) coincide con su _client_id_ y el _iss_ (autoridad emisora) coincide con el dominio (o subdominio) del emisor del _client_id_.
- _Access token_: Es una cadena OAuth utilizada en un sistema de autorización basado en tokens para realizar peticiones que permitan a una aplicación acceder a una API o servidor de recursos. Son los que se utilizan como _Bearer tokens_.
- _Refresh token_: Es un token especial devuelto durante el intercambio de códigos de autenticación y proporciona al cliente la posibilidad de tener acceso continuo a los recursos mientras el usuario no está utilizando la aplicación. Permite a una aplicación obtener un nuevo token de acceso sin preguntar al usuario a través del flujo de token de refresco. Cuando se utiliza en el canal frontal para refrescar el token de acceso, está protegido por una cookie HTTP Only o utilizando una nueva técnica llamada _Refresh Token Rotation_ en la que se genera un nuevo token de refresco con cada solicitud. _Un refresh token puede comprometer la seguridad de la aplicación permitiendo a alguien conectarse al sistema._
- _Scopes_ (ámbitos): Los token de acceso permiten hacer cosas específicas y los scopes son la forma de definir de forma granular, como el cliente (aplicación) solicita ese acceso (leer email, escribir email, borrar foto, etc). Es el mecanismo utilizado para limitar el acceso a los datos de un usuario desde una aplicación.
- _opendid_ scope: Con este scope, la petición OAuth 2.0, se convierte en una petición OpenID Connect. Esto significa que el cliente está solicitando un identificador (_id_) para el usuario. Otros ámbitos importantes de OpenID Connect son:
  - _profile_: devuelve la información del perfil (definida por el servidor y el usuario) como nombre, apellido o foto.
  - _email_: devuelve el correo electrónico del usuario.
  - _address_: la dirección del usuario.
  - _phone_: el teléfono del usuario.

### Flujo de código de autorización de OpenID Connect

El flujo de código de autorización (Authorization Code Flow) es un flujo de OpenID Connect (basado en el flujo de código de autorización de OAuth 2.0 ampliado con funciones de OIDC) diseñado específicamente para autenticar aplicaciones del lado del servidor, ya que debe producirse un intercambio de claves en un entorno seguro (back channel).

#### ¿Cómo funciona?

1. El usuario hace clic en el enlace de inicio de sesión que desencadena una acción en el lado del servidor de la aplicación (back channel).
1. El lado del servidor de la aplicación solicita un _code_ de autorización al servidor de autorización a través del punto de acceso _authorize_. La solicitud incluye el ámbito _openid_ además de otros ámbitos, el _client id_, el parámetro _state_ (valor utilizado para mantener el estado entre la solicitud y la respuesta) e indica que requiere el tipo de respuesta _code_.
1. El servidor de autorización redirige al usuario a la página de inicio de sesión.
1. El usuario se autentica y consiente (o deniega) los ámbitos solicitados.
1. Si el usuario concede el acceso a la aplicación, el servidor de autorización responde con un _authorization code_ y el _state_ al lado del servidor de la aplicación.
1. El lado del servidor de la aplicación solicita el intercambio del _access token_ y el _id token_ (opcionalmente un _refresh token_) al servidor de autenticación a través del punto de acceso _token_, utilizando el _authorization core_ original, el _client id_ y el _client secret_.
1. El servidor de autorización verifica la solicitud.
1. El servidor de autorización responde con un _access token_ y un _id token_ (opcionalmente un _refresh token_) al servidor de la aplicación.
1. En este paso, la aplicación puede crear una sesión de usuario o registrar al nuevo usuario en la aplicación utilizando la información del perfil de usuario.
1. El lado del servidor de la aplicación realiza llamadas a la API utilizando el _access token_ mediante la autorización _Bearer_ en la cabecera HTTP.
1. La API responde con datos al servidor de la aplicación.

### Flujo de código de autorización con PKCE

El flujo de código de autorización con PKCE (Authorization Code Flow with PKCE) se usa para evitar el ataque de interceptación de código de autorización podemos utilizar PKCE que amplía el flujo de código de autorización impidiendo [CSRF](https://developer.mozilla.org/es/docs/Glossary/CSRF). PKCE, pronunciado "pixy" es un acrónimo de _Proof Key for Code Exchange_. Este flujo incluye nuevos elementos PKCE (_code verifier_, _code challenge_ y _code challenge method_) en varios pasos del flujo encargados de proteger la comunicación entre el cliente y el servidor de autenticación.

Fue originalmente diseñado para proteger el flujo de código de autorización en aplicaciones móviles donde no podemos almacenar de forma segura un secreto de cliente, pero actualmente es el **flujo recomendado para la mayoría de las aplicaciones** como aplicaciones web con servidor backend, SPAs con y sin backend, aplicaciones nativas y móviles.

#### ¿Cómo funciona?

1. El usuario hace clic en el enlace de inicio de sesión.
1. El cliente/aplicación (del lado del cliente/canal frontal o del lado del servidor/canal posterior), crea un _code verifier_ criptográficamente aleatorio y a partir de ahí genera un _code challenge_.
1. El cliente solicita un _code_ de autorización al servidor de autorización a través del punto de acceso _authorize_. La solicitud incluye el _code challenge_ y el parámetro _state_ (valor utilizado para mantener el estado entre la solicitud y la respuesta).
1. El servidor de autorización redirige al usuario a la página de inicio de sesión.
1. El usuario se autentica y consiente (o deniega) los ámbitos solicitados.
1. Si el usuario concede el acceso a la aplicación, el servidor de autorización almacena el _code challenge_ y responde con un _authorization code_ a la aplicación.
1. La aplicación solicita el intercambio del _access token_ y el _id token_ (opcionalmente un _refresh token_) al servidor de autenticación a través del punto de acceso _token_, utilizando el _authorization code_ original y el _code verifier_.
1. El servidor de autorización verifica el _code challenge_ y el _code verifier_.
1. El servidor de autorización responde con un _access token_ y un _id token_ (opcionalmente un _refresh token_) a la aplicación.
1. En este paso, la aplicación puede crear una sesión de usuario o registrar el nuevo usuario en la aplicación utilizando la información del perfil de usuario.
1. La aplicación realiza llamadas a la API utilizando el _access token_ utilizando la autorización _Bearer_ en la cabecera HTTP.
1. La API responde con datos.

Flujo de código de autorización OAuth 2.0 con PKCE (así como el Flujo de código de autorización -Authorization Code Flow- del que deriva), permite autenticar en nombre de otro usuario para tener más control sobre los ámbitos de una aplicación y mejora los flujos de autorización a través de múltiples dispositivos. En otras palabras, los desarrolladores que creen aplicaciones para personas en Twitter, GitHub, AWS, Google o PayPal, por ejemplo, tendrán más control sobre la información que su aplicación solicita a sus usuarios, de modo que sólo tendrá que pedir (a través de los ámbitos) a sus usuarios finales los datos y la información que necesite.

> Este moderno protocolo de autorización te permitirá presentar a tus usuarios finales un flujo de consentimiento más ágil para autorizar tu aplicación, en el cual sólo se mostrarán los ámbitos (_scopes_) específicos que les has solicitado. Esto no sólo reduce la carga de datos, sino que también puede aumentar la confianza de los usuarios. Este flujo se utiliza para conceder acceso a una API u obtener acceso a los datos de los usuarios en otros sistemas y cuando se concede a una aplicación que importe la información de sus usuarios desde otra aplicación.

### Flujo implícito

El flujo implícito (Implicit flow) es un flujo en desuso y utilizado sólo por SPAs que no tienen lado de servidor y no pueden soportar PKCE, por lo tanto es menos seguro y mucho más simple.

#### ¿Cómo funciona?

1. El usuario hace clic en el enlace de inicio de sesión que desencadena una acción en la aplicación (front channel).
1. La app solicita el _id token_ al servidor de autorización a través del punto de acceso _authorize_. La petición incluye el ámbito _openid_ además de otros ámbitos y el _client id_, el parámetro _state_ (valor utilizado para mantener el estado entre la petición y la respuesta), el _redirect_uri_ donde la app escuchará por la redirección del servidor de identidad, e indicará que requiere el tipo de respuesta _id_token_ (para obtener sólo el _id_token_) o _id_token token_ (para obtener el _id_token_ y el _access_token_).
1. El servidor de autorización redirige al usuario a la página de inicio de sesión.
1. El usuario se autentica y consiente (o deniega) los ámbitos solicitados.
1. Si el usuario concede el acceso a la aplicación, el servidor de autorización redirige a la aplicación con un _id token_ y un _access token_ (si se solicita) y el cliente valida el token.
1. En este paso, la aplicación puede realizar llamadas a la API utilizando el _access token_ mediante el _Bearer_ de autorización en la cabecera HTTP.
1. La API responde con datos a la SPA.

### Flujo de credenciales de cliente

El flujo de credenciales de cliente (Client Credentials Flow) se utiliza en el contexto de la comunicación máquina a máquina (back-end) y utilizando una clave secreta que sólo el sistema conoce para autenticar y autorizar las aplicaciones en segundo plano en lugar de un usuario.

#### ¿Cómo funciona?

1. La aplicación solicita el _access token_ al servidor de autorización a través del punto de acceso _token_, utilizando el _client id_ y el _client secret_.
1. El servidor de autorización verifica la solicitud.
1. El servidor de autorización responde con un _access token_ a la aplicación.
1. La aplicación realiza llamadas a la API utilizando el _access token_ mediante el _Bearer_ de autorización en la cabecera HTTP.
1. La API responde con datos a la aplicación.

## Conectando los usuarios del servidor de autorización y los usuarios de la aplicación

Una posible forma de conectar los usuarios del servidor de autorización y los usuarios de la aplicación es cuando la aplicación tiene un almacenamiento de datos de usuario. En ese caso podemos manejar la conexión entre ambos con una notificación/claim (tal vez el correo electrónico del usuario). El caso de uso podría ser:

1. Como paso previo se podría crear el usuario en la aplicación.
1. Cuando el usuario se autentique a través del servidor de identidad, utilizar un claim para que coincida con los datos de la aplicación del usuario.
1. Si el usuario no fue creado anteriormente, registrar el nuevo usuario en la aplicación utilizando la información del perfil del usuario.
1. Crear una sesión de usuario y permitir el uso de la aplicación.

Este enfoque permite la posibilidad de utilizar varios servidores de autenticación.

Otra forma es cuando no tenemos una tabla de usuarios. En ese caso necesitamos confiar en el sistema del servidor de autenticación y manejarlo usando el perfil de usuario, los _scopes_ y los _claims_ directamente.

> _¿Cómo podemos utilizar el _refresh token_ para mantener viva una sesión web?_ La mejor manera de manejar esto es redirigir al usuario al servidor de autenticación y dejar que el servidor de autorización mantenga la sesión para el usuario.

## Securizar una aplicación con OpenID Connect y Azure AD

### ¿Qué es Azure Active Directory?

Azure Active Directory (Azure AD) es el servicio de gestión de acceso e identidad basado en la nube de Microsoft (proveedor de autenticación). Simplifica la autenticación para los desarrolladores proporcionando identidad como servicio. Es compatible con protocolos estándar del sector como OAuth 2.0 y OpenID Connect.

## Crear un tenant de Azure AD

Un _tenant_ es una instancia de Azure AD que representa a una organización. Es una instancia dedicada de Azure AD que una organización o un desarrollador de aplicaciones recibe cuando la organización o el desarrollador de aplicaciones crea una relación con Microsoft, como la suscripción a Azure, Microsoft 365 o Microsoft Intune.

## Registrar una aplicación web

Dentro del tenant Azure AD, necesitará un registro para la aplicación. El registro es un registro de detalles de seguridad para la aplicación en Azure AD. Un registro garantiza que Azure AD pueda identificar la aplicación y el usuario. El registro de una aplicación puede incluir soporte para el directorio empresarial y las cuentas Microsoft.

## Configurar la aplicación para la autenticación

Hay muchos detalles para garantizar que las especificaciones del protocolo OpenID Connect se siguen correctamente. Para ayudar a los desarrolladores a utilizar OpenID Connect en sus aplicaciones, Microsoft proporciona middleware para facilitar esta comunicación. Este middleware consiste en APIs que incluyen métodos y propiedades que facilitan la interacción con el proveedor de identidad.

```csharp
services.Configure<CookiePolicyOptions>(options =>
    {
        options.CheckConsentNeeded = context => true;
        options.MinimumSameSitePolicy = SameSiteMode.None;
    });

services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
    .AddAzureAD(options => Configuration.Bind("AzureAd", options));

services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
    {
        options.Authority = options.Authority + "/v2.0/";
        options.TokenValidationParameters.ValidateIssuer = false;
    });
```

Puedes utilizar el middleware de autenticación para registrar usuarios de uno o más tenants de Azure AD. El middleware se inicializa en el archivo _Startup.Auth.cs_, pasándole el ID de cliente de la aplicación y la URL del tenant de Azure AD donde está registrada la aplicación. A continuación, el middleware se encarga de:
- Descargar los metadatos de Azure AD.
- Procesar las respuestas de autenticación de OpenID Connect.
- Integración con la cookie de sesión.

> Si quieres saber más sobre autenticación y autorización en ASP.NET Core, te recomiendo que le eches un vistazo a este otro artículo que he creado sobre [Autenticación y autorización basada en token (JWT Bearer) con ASP.NET Core](/blog/autenticacion-autorizacion-jwt-bearer-aspnet-core/).

---
<social-share class="social-share--footer" />