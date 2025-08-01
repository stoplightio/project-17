---
stoplight-id: biarhs0xte0vt
tags: [interbanking, oauth2, authorization]
internal: true
---

# How to authenticate on Interbanking API

### Pre-requisites

To access this API you must have an API key.

Please see the platform documentation to find out how to obtain the API key for you wish to use, in order to access the platform API services.

### Obtaining an Access Token

In order to obtain an Access Token, you must `POST` to the URL **<https://sandbox.skaleet.com/api/interbankling/v1/oauth2/token>** using a `Content-type: application/json` header and a JSON body containing the following items:

<table>
<tr><th>grant_type</th><td>string</td><td>MUST be "client_credentials"</td></tr>
<tr><th>client_id</th><td>string</td><td>the API key identifier</td></tr>
<tr><th>client_secret</th><td>string</td><td>the API key secret</td></tr>
<tr><th>scope</th><td>string</td><td>a space-separated list of one or more of the below specified OAuth2 scopes</td></tr>
</table>



#### Request body example

```json
  {
    "grant_type":"client_credentials", 
    "client_id":"eza9eza21eaz951ea8f2ffs9fgdfsdd3", 
    "client_secret":"eb5d1477-0dab-4b36-bc3e-9da6d6cc25ba",
    "scope": "transfer_creation transfer_update"
  }
```

Calling the URL as described above will yield a response similar to this (actual token cut off with `[...]` for brevity):

```json
  {
      "token_type": "Bearer",
      "expires_in": 300,
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]"
  }
```

### Now that you have an Access Token

The thus obtained access token must be provided in the HTTP request `Authorization` header **for each API call** in `Bearer` mode:

`Authorization: Bearer [your_access_token]`

### Access token lifetime

The access token has the **same lifetime as a user's session** (defined in the platform configuration). It's lifetime **is not extended** upon each API request.

Therefore, the access token will expire after it's predefined lifetime has expired, resulting in a `HTTP 401 Unauthorized` response with the message `Access token is invalid`.

It is the API consumer's responsibility to detect such response, to obtain a new access token using the process described above, and optionally to make a new attempt on the failed request.
