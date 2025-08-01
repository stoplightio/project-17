---
stoplight-id: kk0hfo13bd2va
---

# How to authenticate on Acceptor API

The Acceptor API is using OAuth2 protocol to handle authentication.

## Pre-requisites

To access this API you must have a registered acceptor account on the **Skaleet** platform.
An API key for this acceptor must be created
Please see the platform documentation to find out how to obtain the API key for the user account you wish to use, in order to access the platform API services.

## Obtaining an Access Token

To get the access token you have to send a `POST` to the url `/api/acceptor/v1/oauth2/token` with the parameters depending on whether it is an employee or a client.

### Identifying as Acceptor (not Employee)

To use **Acceptor identity** (Client Credentials grant):

| Field name | Field type | Description |
| --- | --- | --- |
| `grant_type` | string | MUST be "client_credentials" |
| `client_id` | string | the API key identifier |
| `client_secret` | string | the API key secret |
| `scope` | string | the scopes you need access to, separated by simple space |

You cannot use a device-linked API key with this scheme.


#### Request body example (client credentials)
```json
  {
    "grant_type":"client_credentials", 
    "client_id":"eza9eza21eaz951ea8f2ffs9fgdfsdd3",
    "client_secret":"eb5d1477-0dab-4b36-bc3e-9da6d6cc25ba",
    "scope":"clients_view accounts_view"
  }
```

Calling the URL as described above will yield a response similar to this (actual token cut off with `[...]` for brevity):

| Attribute    | Type | Description               |
| ------------ | --- | ------------------------- |
| `token_type` | string | always `Bearer` |
| `expires_in` | integer | access token time to live |
| `access_token` | string | the actual access token |

```json
  {
      "token_type": "Bearer",
      "expires_in": 3600,
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]"
  }
```

### Identifying as Employee

To identify an **Employee** of your Acceptor (Password Grant):

| Attribute | Type | Description |
| --- | --- | --- |
| `grant_type` | string | MUST be "password" |
| `client_id` | string | the API key identifier |
| `client_secret` | string | the API key secret |
| `scope` | string | the scopes you need access to, separated by simple space |
| `username` | string | the Employee alias |
| `password` | string | the Employee code |

#### Request body example (password)
```json
  {
    "grant_type":"password", 
    "client_id":"eza9eza21eaz951ea8f2ffs9fgdfsdd3", 
    "client_secret":"eb5d1477-0dab-4b36-bc3e-9da6d6cc25ba",
    "scope":"clients_view accounts_view",
    "username": "employee1",
    "password": "4567"
  }
```

The issued Access Token, and consequent tokens issued with the Refresh Token, will identify the Employee's Identity used in the request. 

To refresh an Employee access (Refresh Token Grant) you must `POST` the Refresh URL.

| Attribute | Type | Description |
| --- | --- | --- |
| `grant_type` | string | MUST be "refresh_token" |
| `client_id` | string | the API key identifier |
| `client_secret` | string | the API key secret |
| `refresh_token` | string | the refresh token issued on first identification by Password |
| `scope` | string | the scopes you need access to, separated by simple space (optional, then the previously requested scope will be used) |

#### Request body example (Refresh)

```json
  {
    "grant_type":"refresh_token", 
    "client_id":"eza9eza21eaz951ea8f2ffs9fgdfsdd3", 
    "client_secret":"eb5d1477-0dab-4b36-bc3e-9da6d6cc25ba",
    "refresh_token":"def50200f0a1419b21e8c86543719dc4c5254771415b41815db86e093c709f04a7f4e66ae6fa6063c6fcefd72de7318ebc8ea540a7a22464df0e199f9a6615e3dcb572240bb3aaa782ff8f2d9c66833494a61[...]",
  }
```

Calling the URL as described above will yield a response similar to this (actual token cut off with `[...]` for brevity):

| Attribute    | Type | Description               |
| ------------ | --- | ------------------------- |
| `token_type` | string | always `Bearer` |
| `expires_in` | integer | access token time to live |
| `access_token` | string | the actual access token |
| `refresh_token` | string | refresh token to use when access token is expired |

```json
  {
      "token_type": "Bearer",
      "expires_in": 3600,
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]",
      "refresh_token": "def50200f0a1419b21e8c86543719dc4c5254771415b41815db86e093c709f04a7f4e66ae6fa6063c6fcefd72de7318ebc8ea540a7a22464df0e199f9a6615e3dcb572240bb3aaa782ff8f2d9c66833494a61[...]"
  }
```

The Refresh Token Grant has a similar response content to the Password Grant response.

### Identifying as Acceptor or Employee from a third-party app

This process is using the Authorization Code Grant (with PKCE) scheme.

You must use an API key that is in one of the following case:
* the API key is dedicated to your app and your app is not dedicated to one Acceptor,
* the API key is dedicated to an Acceptor.

#### Authorization request body

You must `GET` the Authorization URL with the following body structure:

| Parameter    | Description               |
| ------------ | ------------------------- |
| `response_type` | always `code`  |
| `client_id` | the API key identifier |
| `redirect_uri` | URI to redirect the user to when authentication is completed |
| `scope` | a space-delimited list of requested scope permissions |
| `code_challenge_method` | always `S256` |
| `code_challenge` | first part of the PKCE |
| `state` | a string value as recommended by RFC6749 (https://tools.ietf.org/html/rfc6749#section-4.1.1) |

This request should be done in a web browser able to handle HTTP redirections.

Once logged in, the user will have to allow your application to access his data, then the Skaleet server will redirect him to your application to the provided `redirect_uri` with the following query parameters:

| Parameter    | Description               |
| ------------ | ------------------------- |
| `code` | the generated authorization code for your application  |
| `state` | the state parameter which was provided by your application in the `/authorize` endpoint call |

**Example:**
```
https://mydomain.com/my/redirect/uri?state=jeYAuBaTVqwRGyd_m4C9qw&code=def50200939a44489266327c4ddd1218fe273224cc6b45fe17793ac479e4c33791daa94c79219b673a3512e7b79264f775a0c8f9def3d1a73873463724b4690452bf30ea7b134a4a84c2401467303078d8f94764d4d7c7ef94cccc3b32829d0ad0f667ece7148527f47a8be53f5c910b8f858daafac34645e46c834c211fd8d8c3a8479d18212519ceb4555d4fdb078321a61308ce7d3f6fc3247ff9c6f69bc58c6b342c3108d3716a1be984406ac8b11a9176b1cd8bfcfbf16a1e93ae1297def8ee10442bd524a6422119af4f9277d8f454328e51756374ffdeecd53f87c95f3716dcd4514d44e1a87ba3e35707410396dc8a520dd49ebff28dd3e33f7476699586b0400667507eb35b644d085456b949280d6113b991c979a8b542fd277786be51ab3d814c43b876fe1e3b754e93eb038a0455ed63e768464d2bbd038f8739a1ef361925dbec4139d9187ff28ed1ad054513763bd760777f0b207c086fa66fe143df65ad89336260b8c569166393b5916af4dacb1a0f2781ef2c9dbd531bd58a59be553ee6660a8c61dee91f31677ac4e702dc165a88309f6a01bd8711843341a8c52331a5dc5c68bf5d448f0fa07915601ee076c135b2bde49d31af9c97a2a4df5b8f2d599c6f41184f3ce059cd51fb031256f0c71af042aff5b9bb18c5e1a34047b0a32d5df3199dc154060b1344fe3a73af62970f34a1e088f5df26b3c5ffd5de27306f335cd3ec9633f9c0de12395e87c04a1ab30bbbeb8c34d91483ba04b48eb35dce07d518189aefb327d8485db5fb9514c219ecc33733b3c55cce349296fdad9f706bac5d67aea0866f35e118f1889d2c63edf8ad6d20b92e416b8affa5886df771131fb654928cfa6aae42c08989a832a5e8760326bf421f4dc0633240f10fbad106d61c7e143be47bd5c68f20e39fe4489fa6bfbd9ff0174dccbbce7ba356c748c423648384abd82fb5c68c696f028de3240c967804c3974036c23ec55e2716208f86ab10460250f16d2538fe20f0fae6cb2a06f04c8f7d7e36b925f91b7b9b1e09c4103e11870aa9bfb14126ed272260360a8a7b55d6040816b1621432881d04f7cf2793192da7e9345d1296a286ef15816de66eddc41ef3033c1d5e6acc668934cce4a7640b24ba1c342e331e1febf7a861cede1d5d3027&
```

You now have to `POST` the Token URL with the following body structure:

| Attribute    | Description               |
| ------------ | ------------------------- |
| `grant_type` | with the value `authorization_code` |
| `client_id` | the API key identifier |
| `client_secret` | the API key secret |
| `redirect_uri` | redirect URI used to generate the authorization code |
| `code_verifier` | second part of the PKCE |
| `code` | the authorization code generated by the Skaleet server |

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

Response body will contain the following information:

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
  "expires_in": 300,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]",
  "refresh_token": "IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk"
}
```

## Now that you have an Access Token
The thus obtained access token must be provided in the HTTP request header `Authorization` **for each API call** prefixed by the word `Bearer ` (**with** the trailing space):

`
Authorization: Bearer <your_api_token>
`

## Access token lifetime
The access token has the **same lifetime as a user's session** (defined in the platform configuration), with the significant difference that **it's lifetime is not extended** upon each API action.

Therefore, the access token will expire after it's predefined lifetime has expired, resulting in a `HTTP 401 Unauthorized` response with the message `Access token is invalid`.

It is the API consumer's responsibility to detect such response, to obtain a new access token using one of the processes described above, and optionally to issue the failed request anew.
