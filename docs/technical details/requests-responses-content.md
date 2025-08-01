---
stoplight-id: 3xn9r422amf2i
---

# Requests and responses content

Skaleet APIs are relying of JSON to format API requests and responses.

The field and parameter names in requests are case sensitive.

You need to use the MIME type `application/json` in the HTTP header `Content-Type` to send requests.

The request and response bodies are always encoded in UTF-8.

## Headers

You can pass some parameters by HTTP headers:


Header name | Content 
---------|----------
`Accept-Language` | End-user prefered language, will be used for text translations.<br />Example: `Accept-Language: en-us`<br />For more information: [Accept-Language - HTTP - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
`User-Agent` | End-user User Agent.<br />Example: `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36`<br />For more information: [User-Agent - HTTP - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)
`Forwarded` | End-user IP address.<br />Example: `Forwarded: for=192.0.2.60; proto=http; by=203.0.113.43`<br />For more information: [Forwarded - HTTP - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)
`X-RateLimit-Limit`<br />`X-RateLimit-Remaining` | See Rate-Limiting handling section below

### Rate-Limiting

A Rate-Limiting mecanism is protecting Skaleet APIs from excessive amount of requests from the same API clients.

On protected endpoints, the HTTP response will contain the `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers:
Header name | Content 
---------|----------
`X-RateLimit-Limit` | The maximum count of requests allowed in the next minute.<br />Example: `X-RateLimit-Limit: 3000`
`X-RateLimit-Remaining` | The remaining count of allowed requests in the next minute.<br/>Example: `X-RateLimit-Remaining: 2999`

If the maximum amount of requests is exceeded, the server will send back responses with the `429 Too Many Request` HTTP status.

In that case, the API client will have to wait for one minute before they will be able to make a new request. After one minute, the requests count is reset to 0.

The maximum count of requests can be configured by the service provider, therefore it may varie from one platform to another.

## HTTP Status Codes

Skaleet APIs are using common HTTP status codes in the HTTP response to indicate success or failure.

| Code | Signification | Description |
|-----|-----|-----|
| **200** | OK | Successful request.
| **201** | Created | Resource creation is successful.
| **204** | No content | Successful request, there is no response body.
| **400** | Bad request | Request message data did not pass validation.
| **401** | Unauthorized | Client is not authorized to access requested data.
| **403** | Forbidden | Access to requested data is forbidden.
| **404** | Not Found | Requested resource does not exist.
| **408** | Timeout | Operation timed out.
| **409** | Conflict | A conflict has been detected during request processing.
| **422** | Unprocessable entity | Request message data did not pass validation.
| **429** | Too many requests | Request rate limiting has been triggered.
| **500** | Internal server error | API back-end has encountered an unexpected error.

### Server-side errors

Even if server-side errors may occur, these errors are by definition unpredictable. Therefore, they will not be documented in the API references. However, keep in mind that they may be returned by the Skaleet platform.

In case of server-side error, you may collect the `X-Request-ID` response header value to add it to your bug report. It uniquely identify the faulty request.

The response will also contain additional data regarding the error.

Here is the generic Error specification:

```YAML
type: object
required:
  - code
  - message
properties:
  code:
    type: integer
    description: The error numeric code
  message:
    type: string
    description: The error's localized message
example:
  code: 1337
  message: Something went wrong because requirement X was not met.
```

### Client-side errors

The list above exhaustively indicates the status codes that may be returned by the Skaleet platform. In the API references, only the relevant client-side errors (4xx) are documented, except the `429 Too Many Requests` error that can occur on all parts of the API.
