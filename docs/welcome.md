---
stoplight-id: hoxh08dxqj2sp
---

# Skaleet Developer Portal


Skaleet APIs are split into two categories based on what is the purpose/intent of the API: 

- “**Service Based API**”: These API are “service oriented” and enable to access/use the operations provided by said service. These APIs reflect the way the service has been designed from a business / functional perspective and therefore expose the capabilities said service is capable of offering
- “**User Based API**”: These APIs are “customer oriented”, in the sense that they hide the potential complexity of how the customer journey is processed (services that are used and how). The endpoints provided are based on the steps of the customer journey which involve interactions between the customer and the system. These APIs have been designed in a way that they can be used to build web or mobile applications for the users.

Service-domain-based APIs are mostly **event-based** (and those that are not meant to change) and **webhooks** can be configured on the platform for a list of available events. 

Schematically, here is the difference between Service-Based API and User Based API: 

![SchemeAPI.png](../assets/images/SchemeAPI.png)


## List of available API
Available API have been split between user API and service-based API. 

### Service-Based API

API Name | Description
---------|----------
**Service Domain API** | Aggregation of most services than can be used by third party to use services provided by Skaleet
**SAE API** | Authorization and settlement for card management
**Interbanking Standard API** | Account recharge management by Request To Pay
**Bill Issuer API** | Connection to external service provider with pre-authentication vs. transaction functions. For close loop payments only
**Credit API** | Credit management, from origination to servicing
**Savings API** | Saving managemet, from origination to servicing
**Calculation Engine API** | Interest / Installment calculation

### User Based API

API Name | Targeted User 
---------|----------
**Admin API**| Bank User 
**Distributor API** | Distributor (B2B2X, BASS) 
**Acceptor API** | Merchants & Agents 
**Client API** | Private Customer 
**Corporate API** | Enterprise Customer 
