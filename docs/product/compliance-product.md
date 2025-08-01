---
stoplight-id: twu6t8hmqxvhs
tags: [compliance, product]
---

# Risk and Compliance
Compliance refers to the adherence to legal and regulatory standards, as well as internal policies and procedures. 

# Scoring
When a user submits a request to enter into a relationship, their profile undergoes internal and/or external analysis for validation purposes.

Scoring consists of calculating a score for a user based on their information (KYC/documents). The scoring category can be Risk Score or Confidence Score. Depending on the benchmark established by the bank (average score, high score = high risk or the opposite, etc.) a score assigned to a user will therefore be considered more or less high/low, and will help the back office to decide on the user

In this document, the interface contract allows external scoring is discussed, which therefore generally requires integration with a dedicated organization in charge of calculating the score and restoring it.

## Create a score
Create a new score	POST	/scores:
## Search a score
Get score list	GET	/scores:
Get one score	GET	/scores/{code}
## Update a score
Update score	PUT	/scores/{code}
## Remove a score
Remove score	DELETE	/scores/{code}
## Associate scores to product
Associate something to a score	POST	/scores/{code}/links
Dissociate something from a score	DELETE	/scores/{code}/links
## Manage users scores
### Create a score result for a user
Create a new score result	POST	/score-results:
Add an external score result	POST	/identities/{identityId}/add-external-score-result
### Search users score result
Get one score result	GET	/score-results/{id}
Get linked score results	GET	/identities/{identityId}/scores

# Screening
Banks and financial institutions must comply with Anti-Money Laundering (AML) and Countering Financing of Terrorism (CFT) regulations. Compliance involves mandatory checks on new customers and operations, and assessing credit/risk scores. 

These obligations include screening new customers who initiate an account opening request on the platform, aiming to ensure that these customers do not appear on any watchlist and thus comply with legal requirements. They also include screening transactions emitted by users of the platform or received by them.

When a screening has to be executed on a user or a transaction, an object to screen is created.  This object groups all interactions with screening entities related to the object being screened (third party or transaction).
## Manage Object To Screen
### Create Object To Screen
Create one object to screen	POST	/objects-to-screen:
Fetch objects to screen screening types	GET	/objects-to-screen/screening-types:
### Search Object To Screen
Fetch objects to screen	GET	/objects-to-screen:
Retrieve one object to screen	GET	/objects-to-screen/{id}
### Manage Object To Screen Transition
Transition an object to screen	PATCH	/objects-to-screen/{id}
Retrieve one object to screen's history	GET	/objects-to-screen/{id}/history

## Manage Screening Request
### Create Screening Request
Add Screening Request	POST	/objects-to-screen/{otsId}/screening-request
### Search Screening Request
Fetch screening requests	GET	/screening-requests:
### Update Screening Request
Update Screening Request	POST	/objects-to-screen/{otsId}/screening-request/{srId}
### Manage Screening Request Transition
Transition Screening Request to pending decision	POST	/objects-to-screen/{otsId}/screening-request/{srId}/is-pending-decision
Transition Screening Request to compliant	POST	/objects-to-screen/{otsId}/screening-request/{srId}/is-ok
Transition Screening Request to non-compliant	POST	/objects-to-screen/{otsId}/screening-request/{srId}/is-not-ok
Transition Screening Request to error	POST	/objects-to-screen/{otsId}/screening-request/{srId}/is-in-error

## Manage Screening Response
### Create Screening Response
Create a screening response	POST	/object-to-screen/{objectId}/screening-requests/{requestId}/screening-responses

# Strong Customer Authentication 
In Skaleet, Strong Customer Authentication (SCA) is a robust security measure designed to enhance the safety of sensitive transactions. It employs a multi-factor authentication approach, utilizing two out of three distinct elements to verify an individual's identity securely. These elements include Knowledge-Based Authentication such as passwords or PINs, " Possession-Based Authentication such as mobile phones or OTPs, and Biometric-Based Authentication like fingerprints or facial recognition. By combining these factors, SCA ensures a higher level of security and protection for online transactions, safeguarding users against unauthorized access and fraud. 

The complexity of the SCA API is explained in this article, enabling developers to use it to accelerate customer authentication processes.

For additional information, Refer to [`Strong Customer Authentication (SCA) Module`](https://tagpay.atlassian.net/wiki/spaces/ProductDocumentation/pages/2864841002/Complete+Guide+to+the+Strong+Customer+Authentication+SCA+Module)
## Manage an authentication session
When a customer triggers Strong Customer Authentication (SCA) during specific actions within the Core Banking System module, the system checks whether these actions necessitate an SCA request. If SCA is required, the Core Banking System module initiates an SCA request to the Authentication API module. For example, a customer may perform specific actions such as adding a beneficiary or making an online payment within the Core Banking System module.
### Initiate an authentication session
For a new authentication session, You can sent the request to the authentication server to initiate a new authentication session by using	[`POST	/authentications/sessions:`](https://api.skaleet.com/docs/api/twe5x3r89du05-initiate-a-new-authentication-session).
### Search an authentication session
You can retrieve list of authentication sessions logs by using parameters such as Id, offset, limits and [`GET	/authentications/sessions:`](https://api.skaleet.com/docs/api/clgao2gvcocj3-search-authentication-sessions).

To retrieve information of a specific authentication session, you can use	[`GET	/authentications/sessions/{token}`](https://api.skaleet.com/docs/api/o035qjtl6jvz7-retrieve-information-about-the-authentication-session) by providing the session token.
### Cancel an authentication session
If you like to stop the authentication session which you have initiated, By providing the session token you sent a request to terminate the authentication session by using cancel authentication session. [`POST	/authentications/sessions/{token}/cancel`](https://api.skaleet.com/docs/api5s9tulwycdli7-cancel-the-authentication-session).
### Refuse an authentication session
If the input parameters are not matching, By providing the session token admin can send a request to discontinue an authentication session by using [`POST	/authentications/sessions/{token}/refuse`](https://api.skaleet.com/docs/api/yqnuk66ogz2sg-refuse-the-authentication-session).
### Manage a suspicious authentication session
Once an authentication session is available, it can be marked as suspicious regardless of its status. To Mark an authentication session as suspicious due to potential irregularities or suspicious behaviour, you can use the [`PATCH	/authentications/sessions/{token}/mark-suspicious`](https://api.skaleet.com/docs/api/jpibw0dj7ioeo-mark-the-authentication-session-as-suspicious). Actions such as sending SMS, generating a keyboard or authentications methods are fully blocked. 

If it is marked as suspicious, it is only possible to either unmark, refuse or cancel it. When a marked suspicious authentication section is no longer raises security concerns, you can unflag the suspicious section by using Unmark the authentication session as suspicious	[`PATCH	/authentications/sessions/{token}/unmark-suspicious`](https://api.skaleet.com/docs/api/vi16typayxx3g-unmark-the-authentication-session-as-suspicious).
## Authenticate customer
### Authenticate with SMS
In order to authenticate the authentication SMS method, you can send sms to the user's registered mobile number by using	[`POST	/authentications/sessions/{token}/methods/sms/send`](https://api.skaleet.com/docs/api/x3asscocvgz5z-send-sms-information-to-authenticate-the-current-authentication-method-sms).
In order to verify the SMS for athentication SMS method, use the [`POST	/authentications/sessions/{token}/methods/sms/verify`](https://api.skaleet.com/docs/api/s7ki57t2bmrfc-authenticate-with-information-for-the-current-authentication-method-sms).
### Authenticate with pincode
You can generate a keyboard input secret code for authentication propose by using the [`POST	/authentications/sessions/{token}/keyboard`](https://api.skaleet.com/docs/api/ovqhc9v8455qe-generates-a-secret-code-input-keyboard-to-authenticate).
You can verify the pervious function, authenticate with information for the current authentication method pincode by using [`POST	/authentications/sessions/{token}/methods/pincode/verify`](https://api.skaleet.com/docs/api/uqymrm59fowhx-authenticate-with-information-for-the-current-authentication-method-pincode).