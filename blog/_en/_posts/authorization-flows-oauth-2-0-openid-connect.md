---
date: 2023-2-28
tags:
  - ASPNETCore
  - AzureAD
  - OAuth2
  - OIDC
  - security
summary: An authorization flow is what allows a client application such as web applications, desktop applications, mobile phones, IoT devices, and other consumers ...
permalink: /en/blog/:slug
---

# Authorization flows with OAuth 2.0 and openID Connect

<social-share class="social-share--header" />

[Español](/blog/flujos-autorizacion-oauth-2-0-openid-connect/) | English

An authorization flow is what allows a client application such as web applications, desktop applications, mobile phones, IoT devices, and other consumers to gain authorized access to protected resources such as web APIs and files, among others. OAuth 2.0 focuses on simplicity for the client developer while providing specific authorization flows, which are enriched by using OpenID Connect as a simple identity layer on top of the OAuth 2.0 protocol.

## OAuth 2.0

OAuth 2.0 is a standard authorization framework that allows greater control over the scope of an application and authorization flows across multiple systems. OAuth 2.0 is all about access to resources with granular scopes that grant you permissions on behalf of a user.

Before OpenID Connect, OAuth 2.0 was used for authentication and authorization, but the problem was that with OAuth we didn´t have the user information because OAuth don't cares who you are. OAuth was designed for permission and scopes, but there were a lot of companies (Facebook, Google, Twitter, etc) using OAuth 2.0 for their authentication process. All of them needed to create a customized implementation to supply the protocol lacks related to user identification (and that's why some documentation confuses us).

OAuth 2.0 was used for delegate authorization as well as overused for authentication with simple login, SSO and login on mobile apps.

## OpenID Connect (OIDC)

OpenID Connect is an extra identity layer (an extension) on top of OAuth 2.0 protocol by using the standarized OAuth 2.0 message flow based on JSON and HTTP, to provide a new identity services protocol for authentication, which allows applications to verify and receive the user profile information of signed-in users.

> OAuth 2.0 + Identity + Authentication = **OpenID Connect**

OpenID Connect adds OAuth 2.0:

- ID token which represents some user information.
- Endpoints for verifying the identity information and getting more user information.
- Standard scopes and claims specifically for identity.
- Standarized implementation.
- A discovery document where the server publishes its metadata through the well-know URL (_https://my-iodc-server.com/.well-known/openid-configuration_).

OpenID Connect lets developers to relieve themselves of the difficult and dangerous responsability of storing and managing people's passwords, it also identifies personal attributes that can be exchanged between Identity Providers and the applications that use them, and includes an approval step in which the user can consent or deny the exchange of this information.

Therefore, we should use OAuth 2.0 for authorization, that is, granting access to APIs and getting access to user data in other systems, and OpenID Connect for authentication, that is, logging the user and for making a user available in other system.

### Implementations of OpenID Connect

[Libraries, servers, services and providers with certified implementations of OpenID Connect](https://openid.net/developers/certified/).

### Key concepts

- _Client ID_: Identifies the client (application) at the authorization server.
- _Client secret_: The password/private key that only the client and de authorization server know.
- _Authorization code_: Is a temporary code returned by the authentication server and used with the client secret by the application to exchange for the access token and the ID token.
- _Access token_: It is the key the client will use to request data from the resource server.
- _ID token_: It is the user profile information returned securely by the authentication server in JWT format. Could be extended calling the _user_info_ endpoint and must be checked by client to ensure that the _aud_ (audience, i.e. client) matches its _client_id_ and _iss_ (issuing authority) matches the domain (or sub-domain) of the issuer of the _client_id_.
- _Access token_: It is an OAuth string used in a token-based authorization system to make requests to allow an application to access an API or resource server. They are the ones that are used as _Bearer tokens_.
- _Refresh token_: It's a special token returned during the authentication code exchange and provides to the client the possibility to have continuous access to the resources while the user is not using the application. It allows an application to obtain a new access token without prompting the user via the refresh token flow. When used in the front channel to refresh the access token, it's protected by a HTTP Only cookies or using a new technique called _Refresh Token Rotation_ where a new refresh token is generated with each request. _A refresh token can compromise the app security allowing someone connect to the system._
- _Scopes_: Token access grants access to do specific things and scopes is the way of define with a granular way, how the client (application) requests that access (read email, write email, delete photo, etc). Is the mechanism used to limit the access to a user's data from a application.
- _opendid_ scope: With this scope, the OAuth 2.0 request, turns into an OpenID Connect request. It means that the client is requesting an identifier (_id_) for the user. Others importants OpenID Connect scopes are:
  - _profile_: returns the profile information (defined by the server and the user) as first name, last name or picture.
  - _email_: returns the user email.
  - _address_: the user address.
  - _phone_: the user phone.

### OpenID Connect Authorization Code Flow

The Authorization Code Flow is an OpenID Connect flow (based on the OAuth 2.0 Authorization Code Flow that is extended with OIDC features) specifically designed to authenticate server-side applications since a key exchange must take place in a secure environment (back channel).

#### How does it work?

1. The user click the login link that trigger an action on the app server-side (back channel).
1. The app server-side requests an authorization _code_ to the authorization server through the _authorize_ endpoint. The request includes the _openid_ scope in addition to other scopes, the _client id_, the _state_ parameter (value used to maintain state between the request and the response) and indicates that requiere the response type _code_.
1. The authorization server redirects the user to the login page.
1. The user authenticate and consents (or denies) the requested scopes.
1. If the user grants access to the app, the authorization server response an _authorization code_ and the _state_ to the app server-side.
1. The app server-side requests the exchange of the _access token_ and the _id token_ (optionally a _refresh token_) to the authentication server through the _token_ endpoint, using the original _authorization code_, the _client id_ and the _client secret_.
1. The authorization server verifies the request.
1. The authorization server responds with an _access token_ and an _id token_ (optionally a _refresh token_) to the app server-side.
1. At this step, the app can create an user session or register the new user in the app using the user profile information.
1. The app server-side makes calls to the API using the _access token_ using the authorization _Bearer_ in the HTTP header.
1. The API responds with data to the app server-side.

### Authorization Code Flow with PKCE

To avoid authorization code interception attack we can use PKCE that extends the authorization code flow preventing [CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF). PKCE, pronounced “pixy” is an acronym for _Proof Key for Code Exchange_. This flow includes new PKCE elements (_code verifier_, _code challenge_ and _code challenge method_) at various steps in the flow in charge of protecting the communication between the client and the authentication server.

It was original designed to protect the authorization code flow in mobile apps where we cannot securely store a client secret, but currently it is the **recommended flow for most applications** like web application with server backend, SPAs with and without backend, native and mobile apps.

#### How does it work?

1. The user click the login link.
1. The client/app (client-side/front channel or server-side/back channel), creates a cryptographically randomized _code verifier_ and from there it generates a _code challenge_.
1. The client requests an authorization _code_ to the authorization server through the _authorize_ endpoint. The request includes the _code challenge_ and the _state_ parameter (value used to maintain state between the request and the response).
1. The authorization server redirects the user to the login page.
1. The user authenticate and consents (or denies) the requested scopes.
1. If the user grants access to the app, the authorization server stores the _code challenge_ and response an _authorization code_ the app.
1. The app requests the exchange of the _access token_ and the _id token_ (optionally a _refresh token_) to the authentication server through the _token_ endpoint, using the original _authorization code_ and the _code verifier_.
1. The authorization server verifies the _code challenge_ and _code verifier_.
1. The authorization server responds with an _access token_ and an _id token_ (optionally a _refresh token_) to the app.
1. At this step, the app can create an user session or register the new user in the app using the user profile information.
1. The app makes calls to the API using the _access token_ using the authorization _Bearer_ in the HTTP header.
1. The API responds with data.

OAuth 2.0 Authorization Code Flow with PKCE (as well as the Authorization Code Flow from which it derives), allows you to authenticate on behalf of another user to have more control over an application’s scopes and improves authorization flows across multiple devices. In other words, developers building applications for people on Twitter, GitHub, AWS, Google or PayPal for example, will have more control over the information their app requests from its users, so that you only have to ask (through the scopes) your end-users for the data and information you need.

> This modern authorization protocol will allow you to present your end-users with a more streamlined consent flow for authorizing your app, which only displays the specific scopes you have requested from them. Not only does this reduce your data burden, but it may also lead to increased trust from end-users. This flow is used to grant access to an API or getting access to user data in other systems and when you grants an application to import your user information from another application.

### Implicit Flow

The legacy flow used only for SPAs that do not have a back-channel and cannot support PKCE, therefore it is less secure and much simpler.

#### How does it work?

1. The user click the login link that trigger an action on the app (front channel).
1. The app requests the _id token_ to the authorization server through the _authorize_ endpoint. The request includes the _openid_ scope in addition to other scopes and the _client id_, the _state_ parameter (value used to maintain state between the request and the response), the _redirect_uri_ where the app will listen for the callback, and indicates that requiere the response type _id_token_ (to get the only the _id_token_) or _id_token token_ (to get the _id_token_ and the _access_token_).
1. The authorization server redirects the user to the login page.
1. The user authenticate and consents (or denies) the requested scopes.
1. If the user grants access to the app, the authorization server redirect to the app with an _id token_ and an _access token_ (if requested) and the client validates the token.
1. At this step, the app can makes calls to the API using the _access token_ using the authorization _Bearer_ in the HTTP header.
1. The API responds with data to the SPA.

### Client Credentials Flow

The client credentials flow is used in the context of machine to machine communication (back-end) and using a secret key that only the system knows to authenticate and authorize the applications in the background instead of a user.

#### How does it work?

1. The app requests the _access token_ to the authorization server through the _token_ endpoint, using the _client id_ and the _client secret_.
1. The authorization server verifies the request.
1. The authorization server responds with an _access token_ to the app.
1. The app makes calls to the API using the _access token_ using the authorization _Bearer_ in the HTTP header.
1. The API responds with data to the app.

## Connecting authorization server users and the application users

One possible way to connect authorization server users and application users is when the application has a user data store. In that case we can handle the connecting between both with a claim (maybe the user's email). The use case could be:

1. As a previous step, you could create the user in the application.
1. When the user authenticates through the identity server, use a claim to match with the user's application data.
1. If the user was not created before, register the new user in the application using the user profile information.
1. Create a user session and allow the application using.

This approach enables the possibility of using multiple authentication servers.

Another way is when we don't have a user table. In that case we need to trust in the authentication server system and handle it using the user profile, scopes, and claims directly.

> _How can we use the refresh token to keep a web session alive?_ The best way to handle with that is redirect back the user to the authentication server and let the authorization server keep track the session for the user.

## Secure application with OpenID Connect and Azure AD

### What is Azure Active Directory?

Azure Active Directory (Azure AD) is Microsoft's cloud-based identity and access management service (authentication provider). It simplifies authentication for developers by providing identity as a service. It supports industry-standard protocols such as OAuth 2.0 and OpenID Connect.

## Create an Azure AD tenant

A tenant is an instance of Azure AD that represents an organization. It's a dedicated instance of Azure AD that an organization or app developer receives when the organization or app developer creates a relationship with Microsoft, like signing up for Azure, Microsoft 365, or Microsoft Intune.

## Register a web app

Within the Azure AD tenant, you'll need a registration for the application. The registration is a record of security details for the application in Azure AD. A registration ensures that Azure AD can identify the application and the user. An app registration can includes support for organizational directory and Microsoft accounts.

## Configure the app for authentication

There's a lot of detail to ensure that the OpenID Connect protocol specifications are followed properly. To help developers use OpenID Connect in their applications, Microsoft provides middleware to facilitate this communication. This middleware consists of APIs that include methods and properties that make it easy to interact with the identity provider.

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

You can use the authentication middleware to sign in users from one or more Azure AD tenants. The middleware is initialized in the _Startup.Auth.cs_ file, by passing it the client ID of the application and the URL of the Azure AD tenant where the application is registered. The middleware then takes care of:
- Downloading the Azure AD metadata.
- Processing OpenID Connect authentication responses.
- Integration with the session cookie.

> If you want to know more about authentication and authorization in ASP.NET Core, I recommend you to take a look at this other article I created about [Token-based authentication and authorization (JWT Bearer) with ASP.NET Core](/en/blog/aspnet-core-jwt-bearer-authentication-authorization/).

---
<social-share class="social-share--footer" />