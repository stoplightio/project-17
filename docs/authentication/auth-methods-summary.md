---
stoplight-id: gw7ad53b5blpz
tags: [authentication, oauth2]
---

# Authentication methods across APIs

The Skaleet APIs use the [OAuth2](https://oauth.net/2/) standard protocol to manage API  authentication wich is the reference in our industry.

The grant flow varies with the considered API.

Here is a table of which flows are available on which APIs.

API | Status | Authorization Code Grant (with PKCE) | Password Grant (deprecated) | Client Credentials Grant
---------|---------|----------|---------|---------
 Client API | Live | Yes | Yes | Yes (only for application-related functions)
 Company API | Live | Yes | No | Yes (only for application-related functions)
 Distributor API | Live | No | Yes | Yes
 SAE API | Live | No | No | Yes
 Service Domain API* | Live | No | No | Yes
 Standard Interbanking API | Live | No | No | Yes
 Admin API | Deprecated | No | No | Yes
 Interbanking API | Deprecated | No | No | Yes
 Credit Module API | Not Available | No | No | No
 Savings Module API | Not Available | No | No | No

\* for **Service Domain API**, Client Credentials Grant flow is available only if used API key is not linked to another API. If so, then the authentication must be made on one of the other linked APIs.

\*\* For **Distributor API**, Password Grant flows is deprecated (not recommanded to be used in the future for security reason and should be replaced by Authorization Code Flow method) but is still available in Skaleet APIs.

## Access Token

Skaleet is following the OAuth2 standard to handle API's clients authorizations.

At the end of an authorization process, API's clients receive an Access Token that allow them to provide their authorization on the other API endpoints. The Access Token is a JSON Web Token (JWT, defined by [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519)) and can be provided via the `Authorization` HTTP header in Bearer Mode ([RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750))

### Decoding a JWT

<!-- theme: warning -->
> #### Warning
>
> In OAuth2 standard, the Access Token is meant to be an opaque value.
> Because Skaleet API is using JWTs, it is technically possible to decode their values. However, it is **strongly not** recommended to base API's clients logic on the values contained in the tokens.
> Content of the JWT is not subject to the Skaleet's breaking changes policy, therefore it could be modified without prior notice.

The JWT is composed of 3 base64-encoded string, separated by periods:
* the header, containing the MAC algorithm,
* the payload, containing token claims,
* the signature, that allows the Skaleet server to validate the JWT content and the API's client to validate the identity of the token's issuer.

To decode a JWT, it can be splitted using the periods as separators (excluding the periods). Then each part can be base64 decoded.

For more information or testing, you can use the [JWT.io](https://jwt.io) website.

### Lifetime of a Token

Access tokens has by design a very limited lifetime. By default Skaleet's APIs Access Token expire **5 minutes** after their issuing datetime.
An Access Token cannot be used after its expiration date and can be deleted.

Please note that the Access Tokens lifetime is configurable and can be modified by the service provider administrative team.

API Name | Default Access Token lifetime
-----|-----
Client API | 5 minutes
Company API | 5 minutes
Distributor API | 5 minutes
SAE API | 5 minutes
Service Domain API | 5 minutes
Standard Interbanking API | 5 minutes
Admin API | 5 minutes
Acceptor API | 5 minutes

## Refresh Token

When Resource Owners are authenticating by Authorization Code Grant flow, a Refresh Token can be issued along with the Access Token, in the response to the Token Request.

This token is an opaque value that cannot be decoded by the API's client.

It can be exchanged against a new Access Token when necessary, i.e. the Access Token is expired.

The lifetime of a Refresh Token is 1 month by default. This value is configurable and can be modified by the service provider administrative team.

Please refer the APIs references and documentations for more information on how to use Refresh Tokens.
