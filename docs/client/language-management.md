---
stoplight-id: 8i5aj6iwg0ln3
---

# Language management in requests

The Client API supports the `Accept-Language` HTTP header on all requests.  

Please follow the header specifications as described here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language  

### On all endpoints

If the header `Accept-Language` is defined in the request, the response header `Content-Language` will be set and contain the language code chosen by the platform.
However, the response header may not contain any of the language defined in the request header. See why below.

### On unauthenticated endpoints

The header is parsed and then the most preferred language is evaluated.  
If the platform supports the language, then the response content will be returned in this language.

### On authenticated endpoints

If the user is authenticated, then the platform will use the language configured in the user profile, and override the `Accept-Language` header content.
