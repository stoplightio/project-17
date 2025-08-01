---
stoplight-id: fdw17osn4xaz9
---

# OAuth2 authorization processes in Client API

The Client API uses the OAuth2 following token grant flows:
* Authorization code grant, with PKCE protection
* Refresh token grant
* Client credentials grant

## Pre-requisites

To access this API you must be a registered application in Skaleet platform platform.

Unique `client_id` and `client_secret` will be generated for your application. You must provide the allowed redirect URI list to be configured. 

The `client_id` and `client_secret` are to be used when calling `/oauth2` endpoints (see below).

## When to use which flow

Your goal when using an authentication flow is to gain an Access Token.  
Access Tokens prove to the API that you have the right to use the methods you are calling on behalf of the Client.

### Client Credentials grant

The Client Credentials flow grants access to only a limited number of methods that do not require a Skaleet platform Client authentication.   
You only need to use your `client_id` and `client_secret` (see below).

### Authorization Code (with PKCE) Grant / Password Grant

To get a valid access token for the other endpoints, you must use the Authorization Code grant or Password grant.  
These grant flows allow a Skaleet platform Client to authenticate by either a login/password or phone number/secret code combinations.  
To choose the right grant flow, you must look at the corresponding configuration parameter contained in the response to the call to the `GET /configuration` endpoint (see documentation).  

### Refresh Token grant

When the access token expired, use a refresh token to generate a new access token.  
Only the Authorization Code and Password grant flows issue Refresh Tokens.

## Get an access Token (Authorization code grant)

### Get an authorization code
The API client must open the system default web browser to the URL **https://sandbox.skaleet.com/api/client/v1/oauth2/authorize** with the following query parameters :


| Parameter    | Description               |
| ------------ | ------------------------- |
| `response_type` | always `code`  |
| `client_id` | the application's identifier |
| `redirect_uri` | URI to redirect the user to when authentication is completed |
| `scope` | with a space-delimited list of requested scope permissions |
| `code_challenge_method` | `plain` or `S256` |
| `code_challenge` | first part of the PKCE |
| `state` | a string value as recommended by RFC6749 (https://tools.ietf.org/html/rfc6749#section-4.1.1) |

Add the following parameters if your user is coming from the enrollment procedure:

| Parameter    | Description               |
| ------------ | ------------------------- |
| `enrollment_id` | the enrollment procedure ID |
| `enrollment_otp` | the enrollment procedure validation OTP sent to the user by SMS |

**Important:** The OTP validation is a mandatory step to terminate the enrollment procedure!

> ### Note on the `state` usage
>
> The `state` parameter will allow to identify the end user application installation.  
> Use a secure random generated string to identify your application instance.  
> Make sure to save the value securely for a better user experience as for unknown `state` a two factor authentication will be mandatory on the user login.

**Example of an authorization code request:**
```
https://sandbox.skaleet.com/api/client/v1/oauth2/authorize?response_type=code&client_id=80c42e38b35a91b4ff75b09e3e538560&redirect_uri=https%3A%2F%2Fmydomain.com%2Fmy%2Fredirect%2Furi&scope=accounts_view%20recipients_view%20recipients_update%20payout&code_challenge_method=S256&code_challenge=lVL9NWggfxbqCHxJUbae2Ewvn_wrhHTgHXMYes7bNAw&state=jeYAuBaTVqwRGyd_m4C9qw
```

Skaleet platform server will then verify your application access then redirect the user to a login page.

Once logged in, the user will have to allow your application to access his data, then the Skaleet platform server will redirect him to your application to the provided `redirect_uri` with the following query parameters:

| Parameter    | Description               |
| ------------ | ------------------------- |
| `code` | the generated authorization code for your application  |
| `state` | the state parameter which was provided by your application in the `/authorize` endpoint call |

**Example:**
```
https://mydomain.com/my/redirect/uri?state=jeYAuBaTVqwRGyd_m4C9qw&code=def50200939a44489266327c4ddd1218fe273224cc6b45fe17793ac479e4c33791daa94c79219b673a3512e7b79264f775a0c8f9def3d1a73873463724b4690452bf30ea7b134a4a84c2401467303078d8f94764d4d7c7ef94cccc3b32829d0ad0f667ece7148527f47a8be53f5c910b8f858daafac34645e46c834c211fd8d8c3a8479d18212519ceb4555d4fdb078321a61308ce7d3f6fc3247ff9c6f69bc58c6b342c3108d3716a1be984406ac8b11a9176b1cd8bfcfbf16a1e93ae1297def8ee10442bd524a6422119af4f9277d8f454328e51756374ffdeecd53f87c95f3716dcd4514d44e1a87ba3e35707410396dc8a520dd49ebff28dd3e33f7476699586b0400667507eb35b644d085456b949280d6113b991c979a8b542fd277786be51ab3d814c43b876fe1e3b754e93eb038a0455ed63e768464d2bbd038f8739a1ef361925dbec4139d9187ff28ed1ad054513763bd760777f0b207c086fa66fe143df65ad89336260b8c569166393b5916af4dacb1a0f2781ef2c9dbd531bd58a59be553ee6660a8c61dee91f31677ac4e702dc165a88309f6a01bd8711843341a8c52331a5dc5c68bf5d448f0fa07915601ee076c135b2bde49d31af9c97a2a4df5b8f2d599c6f41184f3ce059cd51fb031256f0c71af042aff5b9bb18c5e1a34047b0a32d5df3199dc154060b1344fe3a73af62970f34a1e088f5df26b3c5ffd5de27306f335cd3ec9633f9c0de12395e87c04a1ab30bbbeb8c34d91483ba04b48eb35dce07d518189aefb327d8485db5fb9514c219ecc33733b3c55cce349296fdad9f706bac5d67aea0866f35e118f1889d2c63edf8ad6d20b92e416b8affa5886df771131fb654928cfa6aae42c08989a832a5e8760326bf421f4dc0633240f10fbad106d61c7e143be47bd5c68f20e39fe4489fa6bfbd9ff0174dccbbce7ba356c748c423648384abd82fb5c68c696f028de3240c967804c3974036c23ec55e2716208f86ab10460250f16d2538fe20f0fae6cb2a06f04c8f7d7e36b925f91b7b9b1e09c4103e11870aa9bfb14126ed272260360a8a7b55d6040816b1621432881d04f7cf2793192da7e9345d1296a286ef15816de66eddc41ef3033c1d5e6acc668934cce4a7640b24ba1c342e331e1febf7a861cede1d5d3027&
```

Now you have an authorization code to exchange for an access token.

### Exchange authorization code for access token

In order to obtain an Access Token, you must `POST` to the URL **https://sandbox.skaleet.com/api/client/v1/oauth2/token** using a `Content-type: application/json` header and a JSON body containing the following items:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `grant_type` | with the value `authorization_code` |
| `client_id` | the application's identifier |
| `client_secret` | the application's secret |
| `redirect_uri` | redirect URI used to generate the authorization code |
| `code_verifier` | second part of the PKCE |
| `code` | the authorization code generated by the Skaleet platform server |

**Example:**
```json
{
  "grant_type": "authorization_code",
  "client_id": "80c42e38b35a91b4ff75b09e3e538560",
  "client_secret": "4640226fbf3699472eca0d2cd4ef52d9164f23088a39f57b1014df51bc1e13f1",
  "redirect_uri": "https://mydomain.com/my/redirect/uri",
  "code_verifier": "BOdNPHygBjE0Ux7YX3_LY8z4v3gsj68weAIWw2SoUOTHkx2w57C8DY~TkV9k4E7cfPltAmnsL-1IIb4ZOhlqw-cvrqTBrXyHSyDZhKvGUomAoReYazRT6g6Ay02YB70p",
  "code": "def50200939a44489266327c4ddd1218fe273224cc6b45fe17793ac479e4c33791daa94c79219b673a3512e7b79264f775a0c8f9def3d1a73873463724b4690452bf30ea7b134a4a84c2401467303078d8f94764d4d7c7ef94cccc3b32829d0ad0f667ece7148527f47a8be53f5c910b8f858daafac34645e46c834c211fd8d8c3a8479d18212519ceb4555d4fdb078321a61308ce7d3f6fc3247ff9c6f69bc58c6b342c3108d3716a1be984406ac8b11a9176b1cd8bfcfbf16a1e93ae1297def8ee10442bd524a6422119af4f9277d8f454328e51756374ffdeecd53f87c95f3716dcd4514d44e1a87ba3e35707410396dc8a520dd49ebff28dd3e33f7476699586b0400667507eb35b644d085456b949280d6113b991c979a8b542fd277786be51ab3d814c43b876fe1e3b754e93eb038a0455ed63e768464d2bbd038f8739a1ef361925dbec4139d9187ff28ed1ad054513763bd760777f0b207c086fa66fe143df65ad89336260b8c569166393b5916af4dacb1a0f2781ef2c9dbd531bd58a59be553ee6660a8c61dee91f31677ac4e702dc165a88309f6a01bd8711843341a8c52331a5dc5c68bf5d448f0fa07915601ee076c135b2bde49d31af9c97a2a4df5b8f2d599c6f41184f3ce059cd51fb031256f0c71af042aff5b9bb18c5e1a34047b0a32d5df3199dc154060b1344fe3a73af62970f34a1e088f5df26b3c5ffd5de27306f335cd3ec9633f9c0de12395e87c04a1ab30bbbeb8c34d91483ba04b48eb35dce07d518189aefb327d8485db5fb9514c219ecc33733b3c55cce349296fdad9f706bac5d67aea0866f35e118f1889d2c63edf8ad6d20b92e416b8affa5886df771131fb654928cfa6aae42c08989a832a5e8760326bf421f4dc0633240f10fbad106d61c7e143be47bd5c68f20e39fe4489fa6bfbd9ff0174dccbbce7ba356c748c423648384abd82fb5c68c696f028de3240c967804c3974036c23ec55e2716208f86ab10460250f16d2538fe20f0fae6cb2a06f04c8f7d7e36b925f91b7b9b1e09c4103e11870aa9bfb14126ed272260360a8a7b55d6040816b1621432881d04f7cf2793192da7e9345d1296a286ef15816de66eddc41ef3033c1d5e6acc668934cce4a7640b24ba1c342e331e1febf7a861cede1d5d3027&"
}
```

Response body contains the following information:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `token_type` | always `Bearer` |
| `expires_in` | access token time to live |
| `access_token` | the actual access token |
| `refresh_token` | refresh token to use when access token is expired |
| `scope` | a space-delimited list of requested scope permissions. Scope list can be different to requested one according to the user configuration |

**Example:**
```json
{
  "token_type": "Bearer",
  "expires_in": 300,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]",
  "refresh_token": "IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk",
  "scope": "accounts_view recipients_view"
}
```

## Authenticate with Client's phone number and secret code (Password Grant)

This grant relies on 2 operations:
  * Skaleet platform Client secret code validation (if the Client exists)
  * OTP validation (either for connection or enrollment)
  
The connection process depends on either you made your user through the enrollment procedure before connection.  
Jump to the right section according to your situation after reading the description of each procedure.

### Password Grant: Skaleet platform Client secret code validation

#### Pre-requisite

Fetch a virtual keyboard associated to the Client phone number (see `GET /keyboard/{phone}`).  
In order to do so, you must have a valid access token (see Client Credentials grant below).

```
https://sandbox.skaleet.com/api/client/v1/keyboard/3312345678
```

#### Validate the Skaleet platform Client secret code

You are going to proceed to the Skaleet platform Client secret code validation by TagPay.  
The `GET /configuration` endpoint returns the secret code length specs (see endpoint documentation).  

In order to obtain an Access Token, you must first `POST` to the URL **https://sandbox.skaleet.com/api/client/v1/oauth2/token** using a `Content-type: application/json` header, and a JSON body containing the following items:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `grant_type` | with the value `password` |
| `client_id` | the application's identifier |
| `client_secret` | the application's secret |
| `scope` | depending on which procedure you are following (see below, after Password Grant endpoint description) |
| `username` | the virtual keyboard ID |
| `password` | a semi-colon separated list of the keyboard positions selected by the user |

**Example:**
```json
{
  "grant_type": "password",
  "client_id": "80c42e38b35a91b4ff75b09e3e538560",
  "client_secret": "4640226fbf3699472eca0d2cd4ef52d9164f23088a39f57b1014df51bc1e13f1",
  "scope": "<depends on procedure>",
  "username": "aa198417-0465-4c01-b60e-8727939fbdd5",
  "password": "1;2;3;4"
}
```

Response body contains the following information:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `token_type` | always `Bearer` |
| `expires_in` | access token time to live |
| `access_token` | the actual access token |

**Example:**
```json
{
  "token_type": "Bearer",
  "expires_in": 120,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]"
}
```

The thus obtained access token is valid for the next Password grant procedure.

### Password Grant: enrollment or authentication OTP validation

The OTP has been sent by SMS to the Skaleet platform Client's phone. You can't get access to the OTP value other than asking the User.  
The `GET /configuration` endpoint returns the OTP length specs (see corresponding documentation).

You must `POST` to the URL **https://sandbox.skaleet.com/api/client/v1/oauth2/otp** using a `Content-type: application/json` header, and a JSON body containing the following items:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `grant_type` | with the value `password` |
| `client_id` | the application's identifier |
| `client_secret` | the application's secret |
| `scope` | depending on which procedure you are following (see below, after Password Grant endpoint description) |
| `username` | the access token issued on part 1 or the Enrollment ID |
| `password` | the OTP received by the user |

**Example:**
```json
{
  "grant_type": "password",
  "client_id": "80c42e38b35a91b4ff75b09e3e538560",
  "client_secret": "4640226fbf3699472eca0d2cd4ef52d9164f23088a39f57b1014df51bc1e13f1",
  "scope": "<depends on procedure>",
  "username": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]",
  "password": "123456"
}
```

Response body contains the following information:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `token_type` | always `Bearer` |
| `expires_in` | access token time to live |
| `access_token` | the actual access token |
| `refresh_token` | refresh token to use when access token is expired |

**Example:**
```json
{
  "token_type": "Bearer",
  "expires_in": 120,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]",
  "refresh_token": "IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk"
}
```

### How to authenticate with Password Grant flow

The authentication procedure depends on whether you have a valid Enrollment ID.

#### You have a valid Enrollment ID

In that case, the authentication consists in:
  * validating the Enrollment, with the Enrollment OTP
  * checking the Client secret code.

You must call the `//api/client/v1/oauth2/otp` endpoint first with:
  * the Enrollment ID as `username`,
  * the Enrollment OTP as `password`
  * the `otp_check` and `pincode_check` scopes in the `scope` field.

On success, the response contains an Access Token limited to the next operation, Client secret code validation.
  
Call the `//api/client/v1/oauth2/token` endpoint with:
  * all the scopes you need in the `scope` field for this call,
  * append a pipe `|` and the enrollment ID to the `password` field, i.e. `"password": "1;2;3;4|IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk` 

Note that the Keyboard ID used for the secret code validation become your app installation ID in TagPay. Save it securely in your app data it might be asked the app user to communicate it by service support teams.

#### You don't have an Enrollment ID

In that case, the Client has to be registered in TagPay. The authentication consists in:
  * checking the Client secret code,
  * validating the Client identity with an authentication OTP validation.

You must call the `//api/client/v1/oauth2/token` endpoint first with the `otp_check` scope only in the `scope` field.  
Upon this call an OTP has been generated and sent to the Client's phone.  

Then call the `//api/client/v1/oauth2/otp` with all the scopes you need in the `scope` field.

Note that the Keyboard ID used for the secret code validation become your app installation ID in TagPay. Save it securely in your app data it might be asked the app user to communicate it by service support teams.

## Refresh an access token (Refresh Token Grant)

When your access token has expired, you can use the previously provided refresh token to get new access token

In order to obtain an Access Token, you must `POST` to the URL **https://sandbox.skaleet.com/api/client/v1/oauth2/token** using a `Content-type: application/json` header and a JSON body containing the following items:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `grant_type` | with the value `refresh_token` |
| `client_id` | the application's identifier |
| `refresh_token` | your refresh token |

**Example:**
```json
{
  "grant_type": "refresh_token",
  "client_id": "80c42e38b35a91b4ff75b09e3e538560",
  "refresh_token": "IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk"
}
```
Skaleet platform server will then verify the refresh token. It can result in two responses :

### 200: OK
Refresh was successful, and the following information is returned in response body:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `token_type` | always `Bearer` |
| `expires_in` | access token time to live |
| `access_token` | the actual access token |
| `refresh_token` | refresh token to use when access token is expired |
| `scope` | a space-delimited list of requested scope permissions. Scope list can be different to requested one according to your API key configuration |

**Example:**
```json
{
  "token_type": "Bearer",
  "expires_in": 300,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]",
  "refresh_token": "IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk",
  "scope": "accounts_view recipients_view"
}
```

### 401: Unauthorized
Invalid refresh token was given

**Example:**
```json
{
    "error": "invalid_token",
    "error_description": "The access token expired"
}
```

## Get an access token (Client Credentials grant)

In order to obtain an Access Token, you must `POST` to the URL **https://sandbox.skaleet.com/api/client/v1/oauth2/token** using a `Content-type: application/json` header and a JSON body containing the following items:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `grant_type` | with the value `client_credentials` |
| `client_id` | the application's identifier |
| `client_secret` | the application's secret |
| `scope` | a space-delimited list of requested scope permissions. Scope list can be different to requested one according to the user configuration |

**Example:**
```json
{
  "grant_type": "client_credentials",
  "client_id": "5e94feb52bd0a2f828ed4d2be6a187d5",
  "client_secret": "4640226fbf3699472eca0d2cd4ef52d9164f23088a39f57b1014df51bc1e13f1",
  "scope": "client_onboarding pincode_check acceptor_search configuration"
}
```

The following information is then returned in response body:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `token_type` | always `Bearer` |
| `expires_in` | access token time to live |
| `access_token` | the actual access token |

**Example:**
```json
{
  "token_type": "Bearer",
  "expires_in": 300,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]"
}
```

## Now that you have an Access Token

The thus obtained access token must be provided in the HTTP request header `Authorization` **for each API call** prefixed by the word `Bearer ` (**with** the trailing space):

`
Authorization: Bearer your_access_token
`
