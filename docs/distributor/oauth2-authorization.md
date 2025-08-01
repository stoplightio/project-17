---
tags: [authorization, oauth2, distributor]
stoplight-id: 3uyy5eg8mvuo2
---

# Authentication

To use **Skaleet Distributor API**, you need first to be **authenticated**. The authentication method that we support is based on [Oauth 2.0](https://oauth.net/2/) standard wich is the reference in our industry.

The Distributor API supports the [OAuth2](https://oauth.net/2/) following token grant flows:

Flow | Use case | Comment
---------|----------|---------
 **Client credentials grant**| This authentication method is typically used in a Server Back to Back implementation  | This method must be used to authenticate and get an access token. The life time of the token is by default ten (10) minutes
 **Password grant** | This method is been deprecated by Oauth 2.0 standard. It's however a method available in Skaleet platform to manage authentication from an end-user (A Delegate User in practice) thru a web portal | Because this method is deprecated, Skaleet will replace it by the "Authorization Code Grant with PKCE" method. We recommend not to use this method if you can do otherwise
 **Refresh token grant** | The method to be used to refresh a token which has already been delivered using **Password Grant method** | The life time of this token is by default 30 days

>the lifetime of a token is configurable at the platform level, and you must check the duration indicated in the API feedback. A Skaleet oAuth2 token is based on [JWT standard](https://jwt.io/) and contains all required info. 

If you want to know more about OAuth2, please refer [to this page](https://oauth.net/2/grant-types/).

### Pre-requisites
To access this API you must have a registered **Distributor user account** on the platform.
Please see the platform documentation (🔒 [here](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2853699744)) to find out how to create the API key for the user account you wish to use to consume the platform API services.

### Obtaining an Access Token
In order to obtain an Access Token, you must `POST` to the URL **https://sandbox.skaleet.com/api/distributor/v1/oauth2/token** using a `Content-type: application/json` header and a JSON body containing the following items:

| Field | Type | Description |
| :---: | :---: | --- |
| **grant_type** | string | Accepted values are \"client_credentials\", \"password\", \"refresh_token\" |
| **client_id** | string | the API key identifier |
| **client_secret** | string | the API key secret |
| **scope** | string | with a space-delimited list of requested scope permissions - If missing all scopes will be returned if configuration allows it (except for refresh_token grant type). For more information on creating and managing API keys and scopes, please refer to 🔒 [this page](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2911731868). |
| **username** |  string | Delegate user login ( password grant type only ) |
| **password** |  string | Delegate user password ( password grant type only ) |
| **refresh_token** |  string | When refreshing an expired access token using password grant |


#### Request body example

##### Client credentials grant (Distributor identity only)
```
  {
    \"grant_type\":\"client_credentials\", 
    \"client_id\":\"my-api-key-identifier\", 
    \"client_secret\":\"eb5d1477-0dab-4b36-bc3e-9da6d6cc25ba\",
    \"scope\": \"the scopes list\"
  }
```

##### Password grant (Delegate User only)
```
  {
    \"grant_type\":\"password\", 
    \"client_id\":\"app-api-key-identifier\", 
    \"client_secret\":\"087915e5-9372-4edf-83e5-83631fda114f\",
    \"username\": \"delegate-user-login\",
    \"password\": \"delegate-user-password\",
    \"scope\": \"the scopes list\"
  }
```

##### Refresh token grant (Delegate User only)
```
  {
    \"grant_type\":\"refresh_token\", 
    \"client_id\":\"app-api-key-identifier\", 
    \"client_secret\":\"087915e5-9372-4edf-83e5-83631fda114f\",
    \"refresh_token\": \"the-refresh-token\",
    \"scope\": \"the scopes list\"
  }
```

#### Response body example
Calling the URL as described above will yield a response similar to this (actual token cut off with `[...]` for brevity):
```
  {
      \"token_type\": \"Bearer\",
      \"expires_in\": 59940,
      \"access_token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVjNTY0MzI5ODNiMzJj[...]\"
  }
```
_Note:_ the `expires_in` value is expressed in seconds.

When using **Password Grant** and **Refresh Token Grant** an additional response parameter is returned
```
  {
      ...
      \"refresh_token\": \"def502001a3fd579643cedd176f96425a2c3fb81d9ebbd0fb52c7337a194e7b[...]\"
  }
```

### Using POSTMAN

To begin your initial tests, we recommend using a tool such as [POSTMAN](https://www.postman.com/). With this tool, you can directly and easily import the YAML file available for download at the top right of this [page](https://api.skaleet.com/docs/api/n020caxjs7nj7-distributor-api).

To get a Token, using `client_credentials` grant flow, you need simply to configure the request as follows:
![Postman_Get_Token_Distributor.png](../../assets/images/Postman_Get_Token_Distributor.png)
On this screen copy, you can see:
- 3 parameters need to be set for this request: client_id, client_secret and grant_type,
- scope is left blank meaning the required token should have all the capabilities related to the API key used,
- The token has been received in 200ms,
- The life duration configuration on this platform is set to 15 mins (the value 900 is in seconds).


### Now that you have an Access Token
The thus obtained access token must be provided in the HTTP request header `Authorization` **for each API call** prefixed by the word `Bearer ` (**with** the trailing space):

`
Authorization: Bearer your_api_token
`

### Access token lifetime
The access token has the **same lifetime as a user's session** (defined in the platform configuration), with the significant difference that **it's lifetime is not extended** upon each API action.

Therefore, the access token will expire after it's predefined lifetime has expired, resulting in a `HTTP 401 Unauthorized` response with the message `Access token is invalid`.

It is the API consumer's responsibility to detect such response, to obtain a fresh access token using the process described above, and optionally to issue the failed request anew.
