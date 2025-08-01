---
stoplight-id: ioww9h4pztt52
---

# Server Sent Events
Some of this API endpoints use the Server Sent Events standard.

## Architecture
The server keeps the HTTP response opened over time and send a series of event messages at arbitrary times.
The stream is opened until server has no more events to send, decides that the connection has been open long enough and can be considered stale, or until the client explicitly closes the initial request.
The Server Sent Events standard specifies how the messages should be formatted.

## Event format
Here’s a template for a single event message:
```
id: <event id>\n
event: <event type>\n
data: <event data>\n
\n
\n
```
- `id`: A unique ID for this event
- `event`: Specifies the type of event in the case where one event stream may have distinctly different event types.
- `data`: The message body, in our case a json encoded object

## Endpoints
The following endpoints use Server Sent Events : 
- [NSDT (`PATCH /authentications/{transactionToken}/nsdt/verify`)](#operation/VerifyNSDT)
- [Client pincode (IVR) (`PATCH /authentications/{transactionToken}/pincode-client-ivr/verify`)](#operation/VerifyPincodeClientIVR)
