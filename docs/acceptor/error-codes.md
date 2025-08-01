---
stoplight-id: c6jlf83uzcnvx
---

# API error codes signification

The Acceptor API uses consistent error representation across all the endpoints.  
Here is a list of Common errors that could lead an API client to suggest actions to the final user.

| API Error code | Description | Endpoints that could return this error |
|:---:|---|---|
| 23008 | Given code is invalid. | Verify otp/sms authentication endpoint |
| 65200 | Acceptor needs at least one device to make operations. | Acceptor pin code and NSDT authentication endpoints |
| 65201 | Authentication type not needed. | All authentication endpoints |
| 65202 | Session state is not valid for this operation. | All confirmation transaction endpoints |
| 65203 | Session does not exist. |  All confirmation transaction endpoints  |
| 65204 | Agent-only transaction. | Bill payment endpoints |
| 65205 | Unknown customer. | All endpoints involving a client |
| 65206 | Unknown biller. | All endpoints involving a biller |
| 65207 | Unexpected transaction type. | Bill payment and otp/sms authentication endpoints |
| 65208 | Customer phone required. | Bill cash payment endpoint |
| 65209 | Please wait 30 seconds before requesting an SMS. | Send otp/sms authentication endpoint |
| 65210 | Too many sms requests, authentication refused. | Send otp/sms authentication endpoint |
| 65212 | Authentication already completed. | All authentication endpoints |
