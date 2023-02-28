---
date: 2023-1-25
tags:
  - ASPNETCore
  - JWT
  - seguridad
summary: La autenticación basada en token es un esquema de autenticación HTTP en el cual la seguridad se apoya en el uso de cadenas de texto encriptadas, ...
permalink: /blog/:slug
---

# Autenticación y autorización basada en token (JWT Bearer) con ASP.NET Core

<social-share class="social-share--header" />

Español | [English](/en/blog/aspnet-core-jwt-bearer-authentication-authorization/)

La autenticación basada en token es un esquema de autenticación HTTP en el cual la seguridad se apoya en el uso de cadenas de texto encriptadas, normalmente generadas por el servidor y que identifican al portador (bearer) del mensaje mediante la inclusión de dichas cadenas (token) en todas las peticiones de recursos realizas al servidor.


## JSON Web Tokens (JWT)

Es un estándar que define la forma de transmitir de manera compacta y segura información entre las partes mediante un objecto JSON y que se usa normalmente en los escenarios de autorización de acceso a recursos por parte de los usuarios y también como medio para transmitir la información de forma segura entre las partes.

Estructuralmente es una cadena codificada en base64 y formada por tres bloques separados por un punto (.) y que son:

- _Header_: Usado para identificar el tipo de token y el algoritnmo de firma.
- _Payload_: Es el bloque que contiene las notificaciones (_claims_, clave-valor) relacionados con una entidad (normalmente el usuario), y los cuales podemos diferenciar entre _registered_ (predefinidos y recomendadas por el estándar), _public_ (definidos a voluntad y sin restricciones aunque con recomendaciones) y _private_ (completamente personalizados para compartir información acordada entre las partes de manera concreta).
- _Signature_: Incluye una llave secreta para validar el token


## Sobre la autenticación

Para determinar y controlar lo que un usuario (identidad) puede hacer en el sistema, debemos haber determinado previamente quién es el usuario. Esto es lo que se denomina el mecanismo de autenticación y que en ASP.NET Core se logra mediante el servicio de autenticación utilizado por el middleware de autenticación.

Al conjunto de controladores de autenticación y sus configuraciones es a lo que llamamos _esquemas_ de autenticación. Los esquemas de autenticación tienen la responsabilidad de definir los comportamientos del proceso de autenticación mediante los cuales autenticar a los usuarios y recuperar su identidad.

Para cada esquema que queramos utilizar, deberemos registra los correspondientes servicios de autenticación desde _Program.cs_ tras la llamada a _AddAuthentication_:

```csharp
builder.Services.AddAuthentication()
  .AddJwtBearer()
  .AddJwtBearer("OtherAuthServer");
```

Ejemplo de configuración basado en la siguiente configuración:

```json
{
  "Authentication": {
    "DefaultScheme":  "OtherAuthServer",
    "Schemes": {
      "Bearer": {
        "ValidAudiences": [
          "customer:a",
          "customer:b"
        ],
        "ValidIssuer": "https://localhost:7202"
      },
      "OtherAuthServer": {
        "ValidAudiences": [
          "customer:c"
        ],
        "ValidIssuer": "https://localhost:4447"
      }
    }
  }
}
```

_Bearer_ es el nombre del esquema predeterminado cuando registramos un servicio basado en JWT Bearer (_.AddJwtBearer()_), pero podemos ver cómo añadir otros como al que he llamado _OtherAuthServer_ e inclusive establecerlo como predeterminado mediante la propiedad _DefaultScheme_.

A continuación deberemos agregar el middleware de autenticación desde _Program.cs_ y que se encargará de usar los esquemas antes registrados:

```csharp
  app.UseAuthentication();
```

La acción de autenticación de los usuarios es llevada a cabo por el **controlador de autenticación**, el cual implementa el comportamiento necesario acorde al esquema y se encarga de construir y devolver el resultado de la autenticación, así como los objectos de identidad de usuario necesarios si la autenticación se lleva a cabo con éxito. Además de la autenticación, el controlador de autenticación también ofrece métodos para conocer el mecanismo de autenticación cuando se intenta acceder a un recurso (_desafío_) y métodos para conocer si un usuario está autenticado y si tiene permitido el acceso al recurso solicitado (_prohibición_).

Además de ello, existen escenarios donde es necesario un paso de autenticación remota como pueden ser [OAuth 2.0](https://oauth.net/2/) y [OIDC](https://openid.net/connect/), en cuyo caso el responsable de la autenticación es el proveedor remoto. Es el caso por ejemplo del uso de Azure AD, Auth0, Identity Server, Okta, Facebook, Twitter, Google, Microsoft entre otros.

Cabe destacar la importancia de la clase _ClaimsPrincipal_ en ASP.NET Core ya que se usa para representar una entidad de seguridad sobre la que tomaremos las decisiones relativas a los permisos. En una solicitud HTTP por ejemplo, es la clase de la que deriva el usuario que podemos encontrar en la clase _HttpContext_:

```csharp
ClaimsPrincipal principal = HttpContext.Current.User as ClaimsPrincipal;
if (null != principal)
{
  foreach (Claim claim in principal.Claims)
  {
      Response.Write("CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value + "</br>");
  }
}
```

[Información general sobre la autenticación de ASP.NET Core en learn.microsoft.com.](https://learn.microsoft.com/es-es/aspnet/core/security/authentication)

## Tipos de autorización

Una vez identificado el usuario, .NET nos ofrece múltiples formas de validar sus permisos, dentro de las cuales podemos destacar:

- [Autorización basada en roles](/blog/autenticacion-autorizacion-jwt-bearer-aspnet-core/#autorizacion-basada-en-roles)
- [Autorización basada en notificaciones](/blog/autenticacion-autorizacion-jwt-bearer-aspnet-core/#autorizacion-basada-en-notificaciones)
- [Autorización basada en directivas](/blog/autenticacion-autorizacion-jwt-bearer-aspnet-core/#autorizacion-basada-en-directivas)
- [Autorización basada en recursos](/blog/autenticacion-autorizacion-jwt-bearer-aspnet-core/#autorizacion-basada-en-recursos)

### Autorización basada en roles

Al crearse una entidad, ésta puede pertenecer a uno o varios roles, los cuales se usan para validar el acceso del usuario a los servicios. Es el clásico ejemplo de pertenecer a los roles de _Administrator_ y _User_.

Registro de servicios de autorización basados en roles desde _Program.cs_ y que se encargará de usar los esquemas antes registrados:

```csharp
builder.Services.AddDefaultIdentity<IdentityUser>( ... )
    .AddRoles<IdentityRole>()
```

Comprobaciones de acceso basadas en roles:

```csharp
[Authorize(Roles = "Administrator, User")]
public class FileManagerController : Controller
{
    public IActionResult Read() =>
        Content("Administrator or User");

    [Authorize(Roles = "Administrator")]
    public IActionResult Delete() =>
        Content("Administrator only");
}
```

Registro de servicios de autorización basados en roles mediante la sintaxis de directiva desde _Program.cs_ y que se encargará de usar los esquemas antes registrados:

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("IsAdministratorRole",
        policy => policy.RequireRole("Administrator"));
});
```

Comprobaciones de acceso basadas en roles:

```csharp
[Authorize(Policy = "IsAdministratorRole")]
public IActionResult Delete() =>
        Content("Administrator only");
```

[Documentación oficial en learn.microsoft.com.](https://learn.microsoft.com/es-es/aspnet/core/security/authorization/roles)

### Autorización basada en notificaciones

Al crearse una entidad, se la añaden nuevas notificaciones (_claims_, clave-valor) emitidas por una entidad de confianza. En este caso, para validar el acceso del usuario a los servicios, la validación se lleva a cabo comprobando la presencia de una notificación y opcionalmente su valor.

Registro de servicios de autorización basados en notificaciones desde _Program.cs_ y que se encargará de usar los esquemas antes registrados:

```csharp
builder.Services.AddAuthorization(options =>
{
  options.AddPolicy("IdentifiedUser", policy =>
  {
    policy.RequireClaim("UserId");
  });

  options.AddPolicy("HasAPIScope", policy =>
  {
      policy.RequireAuthenticatedUser();
      policy.RequireClaim("scope", "api");
  });
});
//...
app.UseAuthorization();
```

Comprobaciones de acceso basadas en notificaciones:

```csharp
[Authorize(Policy = "IdentifiedUser")]
public class UserDataController : Controller
{
    public IActionResult Profile() =>
        Content("IdentifiedUser only");

    [AllowAnonymous]
    public IActionResult Index() =>
        Content("Any");
}

[Authorize(Policy = "HasAPIScope")]
public class SomeAPIController : Controller
{
    public IActionResult DoSomething() =>
        Content("HasAPIScope only");
}
```

[Documentación oficial en learn.microsoft.com.](https://learn.microsoft.com/es-es/aspnet/core/security/authorization/claims)

### Autorización basada en directivas

En este caso, la validación se lleva a cabo mediante la comprobación de los requisitos registrados durante la configuración del servicio de autorización. Dada su flexibilidad, además de ser usada internamente por la autorización basada en roles y la autorización basada en notificaciones (a partir de opciones preconfiguradas), también dota a éstas de mayor flexibilidad al permitir el registro de directivas personalizadas para dichos escenarios.

Registro de servicios de autorización basados en directivas desde _Program.cs_ y que se encargará de usar los esquemas antes registrados:

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("IsRestrictedIP", policy =>
        policy.Requirements.Add(new IPAddressRequirement(new List<string>(){"224.0.0.0", "224.0.0.1"})));
});
```
_IPRequirement_ es un clase definida por nosotros que implementa la interfaz _IAuthorizationRequirement_ y se utiliza como parámetro en la creación de los requerimientos de la directiva.

```csharp
using Microsoft.AspNetCore.Authorization;
public class IPAddressRequirement : IAuthorizationRequirement
{
    public IPAddressRequirement(List<string> ips) =>
        Ips = ips;

    public List<string> Ips { get; }
}
```

Además del requisito, también es necesario definir el controlador responsable de evaluar sus propiedades. Para ello crearemos el controlador implementando la interfaz _AuthorizationHandler\<TRequirement\>_, donde _TRequirement_ es el requisito a controlar.

```csharp
public class IPAddressHandler : AuthorizationHandler<IPAddressRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IPAddressRequirement requirement)
    {
        // Validación del requisito en base al context y requirement.Ips
        var isAuthorizedIP = {...};

        if (isAuthorizedIP)
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
```

Y para terminar, no olvidemos la necesidad de registrar nuestro nuevo controlador en la colección de servicios para que esté disponible a lo largo de nuestra aplicación:

```csharp
builder.Services.AddSingleton<IAuthorizationHandler, IPAddressHandler>();
```

Comprobaciones de acceso basadas en directivas:

```csharp
[AllowAnonymous]
public class UserDataController : Controller
{
    [Authorize(Policy = "IsRestrictedIP")]
    public IActionResult Detail() =>
        Content("IsRestrictedIP only");

    public IActionResult Index() =>
        Content("Any");
}
```

[Documentación oficial en learn.microsoft.com.](https://learn.microsoft.com/es-es/aspnet/core/security/authorization/policies)

### Autorización basada en recursos

Este enfoque permite aplicar un método de autorización completamente personalizado y se usa cuando el proceso de autorización depende del recurso en cuestión, lo que implica que la evaluación debe realizarse justo antes de la operación solicitada, así que debemos invocar un método de autorización personalizado.

En primer lugar debemos saber que gracias a la injección de dependecias, el servicio de autorización está disponible desde los controladores:

```csharp
public class MediaServerController : Controller
{
    private readonly IAuthorizationService authorizationService;
    private readonly IMediaServerRepository mediaServerRepository;

    public DocumentController(IAuthorizationService authorizationService,
                              IMediaServerRepository mediaServerRepository)
    {
        this.authorizationService = authorizationService;
        this.mediaServerRepository = mediaServerRepository;
    }
    //...
}
```

Usaremos el servicio de autorización para realizar una validación de autorización personalizada durante la recuperación del recurso.

```csharp
public class MediaServerController : Controller
{
  //...
  public async Task<IActionResult> OnGetConfigurationAsync(Guid mediaServerId)
  {
      MediaServer mediaServer = mediaServerRepository.Find(mediaServerId);

      if (mediaServer == null)
      {
          return new NotFoundResult();
      }

      var authorizationResult = await authorizationService
              .AuthorizeAsync(User, mediaServer, "GetConfigurationPolicy");

      if (authorizationResult.Succeeded)
      {
          return Page();
      }
      else if (User.Identity.IsAuthenticated)
      {
          return new ForbidResult();
      }
      else
      {
          return new ChallengeResult();
      }
  }
}
```

Definición del requisito y controlador responsable de evaluar sus propiedades.

```csharp
public class SameCountryRequirement : IAuthorizationRequirement { }

public class MediaServerAuthorizationHandler :
    AuthorizationHandler<SameCountryRequirement, MediaServer>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
      SameCountryRequirement requirement,
      MediaServer resource)
    {
        if (context.User.Claims.FirstOrDefault(c => c.Type == "CountryId") == resource.CountryId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
```

Y finalmente el registro del requisito y el controlador en _Program.cs_:

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("GetConfigurationPolicy", policy =>
        policy.Requirements.Add(new SameCountryRequirement()));
});

builder.Services.AddSingleton<IAuthorizationHandler, MediaServerAuthorizationHandler>();
```

[Documentación oficial en learn.microsoft.com.](https://learn.microsoft.com/es-es/aspnet/core/security/authorization/resourcebased)

---
<social-share class="social-share--footer" />