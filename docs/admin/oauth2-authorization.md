---
stoplight-id: o37y72vyevi6m
---

# Pre-requisites

To access this API you must have a registered administrator account on the platform.
Please see the platform documentation to find out how to obtain the API key for the administrator account you wish to use to consume the platform's API services.

# Obtaining an Access Token

In order to obtain an Access Token, you must `POST` to the URL **https://sandbox.skaleet.com/api/v2/admin/oauth2/token** using a `Content-type: application/json` header and a JSON body containing the following items:

Field name | Type | Description
---------|----------|---------
 **grant_type** | string | MUST be "client_credentials"
 **client_id** | string | The Admin API key identifier
 **client_secret** | string | The Admin API key secret
 **scope** | string | A space-separated list of one or more of the below specified OAuth2 scopes

## Request body example

```json
{
  "grant_type":"client_credentials",
  "client_id":"myApiAdmin",
  "client_secret":"eb5d1477-0dab-4b36-bc3e-9da6d6cc25ba",
  "scope":"TransactionView AgentView AgentCreation"
}
```

Calling the URL as described above will yield a response similar to this (actual token cut off with `[...]` for brevity):

```json
{
  "token_type": "Bearer",
  "expires_in": 10800,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]"
}
```

# Now that you have an Access Token

The thus obtained access token must be provided in the HTTP request header `Authorization` **for each API call** prefixed by the word `Bearer ` (**with** the trailing space):

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]
```

# Access token lifetime

The access token has the **same lifetime as an administrator's session** (defined in the platform's configuration), with the noteable difference that **it's lifetime is not extended** upon each API action.

Therefore, the access token will expire after it's predefined lifetime has expired, resulting in a `HTTP 401 Unauthorized` response with the message `Access token is invalid`.

It is the API consumer's responsibility to detect such response, to obtain a fresh access token using the process described above, and optionally to issue the failed request anew.
