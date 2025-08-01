---
stoplight-id: anja0wtragdgq
tags: [product, cards]
---

# Cards

Cards are payment instruments issued by the bank that belong to cardholders and are electronically linked to one or more deposit accounts. 

The card lifecycle generally includes the following steps:
- Apply for a new card
- Activate a card
- Block / Unblock a card
- Oppose a card 
- Close a card
- Replace a card

Cards in `ACTIVE` status can be used to make payments. The authorization and clearing of these payments are reflected in the account the card is paired to.

Card contracts in Skaleet are represented by a product. The configuration of this product will define the card characteristics, features, properties and operating rules.

## Card Characteristics
### Card Partner
Skaleet manages cards in collaboration with integrated card processors. The integration with these card partners enables the creation of card products used for card contracts with clients.

As soon as the partner is configured in the platform, it is necessary to define the possible card operations between Skaleet and the partner, the functionalities, and the card limits.

A card partner can be configured using [`POST /product-partners`](https://api.skaleet.com/docs/api/57eyz5d8ra7cg-create-a-card-partner). When creating this card partner three elements can be defined : 
- Activation modes: indicate how card activation can be managed
- Operations: indicate which card operations are allowed for cards with this partner
- Features: indicate which features are allowed for cards with this partner
- Limits: indicates which limits are allowed for cards with this partner.

Once created, you can list the card partners using [`GET /product-partners`](https://api.skaleet.com/docs/api/zgvn9d70xmqgf-list-all-card-partners) and edit them using [`PATCH /product-partner/{partnerName}`](https://api.skaleet.com/docs/api/a6lily7j7osid-edit-a-card-partner).

For more information about card partners, refer to 🔒[Configure Card Issuer](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2866348506).
### Card Identification
Cards are all identified through a unique number generated automatically by Skaleet.

> The PAN of the card is never stored in Skaleet. Communication between Skaleet and the card processor is managed using the unique number of the card

You can also identify your card adding and managing external references (`externalId` and `externalData`). 

### Card Attributes

All products have a configuration in Skaleet that defines the purpose of the product.

|Setting|Description/Use|
|----|----|
|SCHEME|Based on the card processor, informs on the network being used (MasterCard, Visa e.g.)|
|SUPPORT TYPE|Physical (plastic card) or virtual (online card)|
|AUTHORIZATION MODE|Classic, prepaid or automatic|
|USAGE|Individual vs Professional (informative)|
|PERSONALIZATION|Anonymous vs. Nominative|

### Card Features

If the card is in `ACTIVE` or `BLOCKED` statuses and the product is correctly configured, you can configure the following features for the selected card: 
- Contactless Payment (NFC)
- Withdrawal, Domestic Payment
- Foreign Withdrawal
- Europe Zone Withdrawal
- Foreign Payment
- Europe Zone Payment

For more information about card features, refer to 🔒[Manage Card Features](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2858320002).

All cards will offer the features configured on its product. The features can then be edited by an authorized user (see below).

### Card Limits

Limits for card products can be set by specifying a weekly or monthly maximum for payments or withdrawals, each with a default value. Additionally, it is possible to restrict card use to specific countries, MCCs, and/or merchants.

For more information about card limits, refer to 🔒[Manage Card Features](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2858320002) and  to 🔒[Configure Card Product](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2865137407) for their configuration.

All cards will apply the configured limits on its product. The limits can then be edited by an authorized user (see below).

## Card Lifecycle
The customer card lifecycle in banking is a systematic process that commences when an individual or business request a card subscription to a financial institution. It continues throughout the card's existence until it eventually terminated. Cards hold a status which represents their relationship status with the financial institution: `NEW`, `PENDING`, `ACTIVE`, `BLOCKED`, `EXPIRED`, `REMOVED`, `OPPOSED` and `CANCELLED`.

Skaleet manages two types of card : **Anonymous** and **Nominative**.
>From a Skaleet point of view, the management of anonymous and nominative cards is almost similar, except that anonymous cards require specifying an `embossed name` and  `embossed reference` upon their creation or activation. 

For more information about card lifecycle, refer to 🔒[Manage Card Lifecycle](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2858254471).

### Card Lifecycle Operations
Each actions to execute on a card is represented by an operation : 
- Card creation
- Card activation
- Reissue of the confidential code
- Refabricating a card
- Blocking a card
- Unblocking a card
- Opposition
- Cancellation/Deactivation of a card
- Updating card features
- Updating card limits

These operations are initiated with Skaleet and mirrored by the card processor, which will indicate if the operation can be executed.

You can initiate the operation by requesting to perform an action on the card using the endpoints described below. Skaleet will verify the operation and if the controls pass an event *card.management_operation.accepted* is emitted. 

The processor can subscribe to this event to know when an operation is requested and retrieve the card's information. The partner will then have to execute the operation on the card. Once it is done, the processor can inform Skaleet and update the card : 
- using [`POST /cards/{id}/operation/{type}/accept`](https://api.skaleet.com/docs/api/dexqy84tz184j-accept-card-operation-by-the-partner) if the operation is accepted
- using [`POST /cards/{id}/operation/{type}/refuse`](https://api.skaleet.com/docs/api/6j33ubxm4m5nc-refuse-card-operation-by-the-partner) if the operation is refused
- using [`POST /cards/{id}/operation/{type}/error`](https://api.skaleet.com/docs/api/2zn5euzjji7rf-error-card-operation-by-the-partner) if an error occured during the operation
- using [`POST /cards/{id}/operation/{type}/pending`](https://api.skaleet.com/docs/api/eh3497rvfwgxu-pending-card-operation-by-the-partner) if the operation needs to be put on hold 
> These endpoints are accessible via the Admin API. Therefore, you will first need to create an administrator and authenticate using its credentials with the API authorization methods.

For each decision sent by the partner for a card operation, an event is emitted : *card.management_operation.settled* when accepted, *card.management_operation.refused* when refused and *card.management_operation.err_settled* when the partner indicates that an error occured.

To list or search operations ongoing on a given card, you can use [`GET /cards/{cardI}/operations`](https://api.skaleet.com/docs/api/acx10gnicrrdj-list-all-card-operations).
 
### Card Creation

You can subscribe to a card using the [`POST /cards`](https://api.skaleet.com/docs/api/yrp4zfeg1qrz8-request-a-new-card) endpoint. The requested card is created in `NEW` status and cannot be used until it is activated. The account to which the card will be linked must be provided during the card creation process. Therefore, it needs to be created before sending this request.

When the card is created on the platform, an event is then emitted: *card.new*, which simply informs that a card has been created.

As the card is created, an operation is initiated: `card_creation`. The processor will then have to manage the card operation as described in the "Card Lifecycle Operations" section (section above).

When the card creation is accepted, the card status is changed to `PENDING`. Only then is it possible to activate it.

If an error occurs during the card creation or if the processor refuses the card creation, the card status is changed to `CANCELED`.

### Card Information Retrieving

You can search cards using [`GET/cards`](https://api.skaleet.com/docs/api/2ucu77iw40edk-list-all-cards) and limit your search using the multiple criteria available. The response contains a list of cards matching these criteria.

Detailed information on a specific card can be retrieved using [`GET /cards/{cardId}`](https://api.skaleet.com/docs/api/crhbdf1jyxqzs-retrieve-a-card). With this endpoint, sensitive data are not returned. To access them, you can use [`POST /cards/{cardId}/details`] (https://api.skaleet.com/docs/api/3hrh2hr7jkaaq-get-a-card-s-details). 

Card products are configured with an image that can be used on the client interface to display cards in a customised and user-friendly way. This image can be retrieved using [`GET /cards/{cardId}/image`](https://api.skaleet.com/docs/api/5mqecp5ymr3xs-get-a-card-s-image).


### Card Information Update
Card's information can be updated when its status is `NEW`, `ACTIVE`, `PENDING` and `BLOCKED`. The data that can be updated are restricted to : `externalId`, `externalStatus`, `expirationMonth`, `expirationYear` and `externalData`. These data are used to store informations given by the processor for a card. To update this card data use [`PATCH /cards/{cardId}`](https://api.skaleet.com/docs/api/vtt1sa8jvzzfr-update-a-card).

### Card Activation
You can request to activate a card with the `PENDING` status using [`POST /cards/{cardId}/activate`](https://api.skaleet.com/docs/api/worwx9w9i2ns5-request-a-card-activation). 

When the card activation is requested and pass Skaleet controls, an operation is initiated: `card_activation`. The processor will then have to manage the card operation as described in the "Card Lifecycle Operations" section (section above).

When the card activation is accepted, the card status is changed to `ACTIVE` and the event *card.status.activated* is emitted. With this status the card can be used for payments.

If an error occurs during the card activation or if the processor refuses the card activation, the card status is changed to `INACTIVE`.

### Card Blocking / Unblocking

You can request to block a card with the `ACTIVE` status using [`POST /cards/{cardId}/block`](https://api.skaleet.com/docs/api/5uii6jy3o8969-request-a-card-blocking). 

When the card blocking is requested and pass Skaleet controls, an operation is initiated: `card_blocking`. The processor will then have to manage the card operation as described in the "Card Lifecycle Operations" section (section above).

When the card blocking is accepted, the card status is changed to `BLOCKED` and the event *card.status.blocked* is emitted.

If an error occurs during the card blocking or if the processor refuses the card blocking, the card status stays as `ACTIVE`.

When a card is blocked, the card cannot be used. As a result, all transactions or operations you try using the card will be rejected. This can be used when a cardholder has lost their card but does not want to oppose it yet or when the card issuer has doubts on the card. 

To request to unblock a card, use [`POST /accounts/{cardId}/unblock`](https://api.skaleet.com/docs/api/t5ru3nqdpl41i-request-a-card-unblock). The unblocking process is the same as the blocking one, except it is represented by a `card_unblocking` operation. If it succeeds, the card status is changed to `ACTIVE`, and an event is then emitted: *card.status.unblocked*, which informs that a card has been unblocked.

If an error occurs during the card unblocking or if the processor refuses the card unblocking, the card status stays as `BLOCKED`.


### Card Opposing

You can request to oppose a card with the `ACTIVE` status using [`POST /cards/{cardId}/oppose`](https://api.skaleet.com/docs/api/vsip7gx44fegt-request-a-card-opposition) and indicating the reason of this opposition : stolen card (`STOLEN`), lost card (`LOST`), fraudulent use of the card (`ABUSE`), card not distributed (`NOT-DISTRIBUTED`) and the card is a counterfeit (`COUNTERFEIT`).

When the card opposition is requested and pass Skaleet controls, an operation is initiated: `card_opposition`. The processor will then have to manage the card operation as described in the "Card Lifecycle Operations" section (section above).

When the card opposition is accepted, the card status is changed to `OPPOSED` and the event *card.status.opposed* is emitted. With this status the card cannot be used for payments.

If an error occurs during the card opposition or if the processor refuses the card opposition, the card status stays as `ACTIVE`.

Once opposed, a card cannot be reactivated. 

### Card Replacement

You can request to replace a card with the status `ACTIVE`, `PENDING`, `EXPIRED` or `OPPOSED` using [`POST /cards/{cardId}/refabricate`](https://api.skaleet.com/docs/api/nshkqktno8eye-request-a-card-refabrication) and indicating the reason of this refabrication : stolen card (`STOLEN`), lost card (`LOST`), fraudulent use of the card (`ABUSE`), card not distributed (`NOT-DISTRIBUTED`), card is opposed (`OPPOSED`), card has expired (`EXPIRED`) and card was damaged (`DAMAGED`).

When the card refabrication is requested and pass Skaleet controls, a new card is created with the status `NEW`. The old card is referred as the "parent card" for the new one.
Simultaneously, an operation is initiated: `refabrication`. The processor will then have to manage the card operation as described in the "Card Lifecycle Operations" section (section above).

When the card refabrication is accepted, the status of the parent card (the card to refabricate)  is changed to `REMOVED` and cannot be used anymore, while the status of the new card is changed to `PENDING`.

If an error occurs during the card refabrication or if the processor refuses the card refabrication, the parent card and new card are not updated.

### Card Pincode Reissuing

You can request to reissue a card pincode with the status `ACTIVE` using [`POST /cards/{cardId}/pinCodeReissuing`](https://api.skaleet.com/docs/api/5yv7xl587ps90-request-a-pin-code-reissue).

When the card pincode reissuing is requested and pass Skaleet controls, an operation is initiated: `card_opposition`. The processor will then have to manage the card operation as described in the "Card Lifecycle Operations" section (section above).

When the card pincode reissuing is accepted, the card pincode is updated according to the request.

If an error occurs during the card pincode reissuing or if the processor refuses the card pincode reissuing, the card pincode is not updated.

### Card Features Update

You can request to block or unblock one of the card features using [`PATCH /cards/{cardId}/features`](https://api.skaleet.com/docs/api/37elim3jubhz2-request-a-card-feature-change).
The blocking status of all features is represented by a boolean value: true when the feature is activated and false when it is blocked.

When the card feature update is requested on the platform, an operation is initiated: `card_features_update`. The processor will then have to manage the card operation as described in the "Card Lifecycle Operations" section (section above).

When the card feature update is accepted, the card feature is activated or deactivated depending on the request.

If an error occurs during the card feature update or if the processor refuses the card feature update, the card feature is not updated.

### Card Limits Update  

You can request to update the card limits using [`PATCH /cards/{cardId}/features`](https://api.skaleet.com/docs/api/cgtouojbiro3w-request-a-card-limit-change).

When the card limit update is requested on the platform, an operation is initiated: `card_limits_update`. The processor will then have to manage the card operation as described in the "Card Lifecycle Operations" section (section above).

When the card limit update is accepted, the card limit is edited depending on the request.

If an error occurs during the card limit update or if the processor refuses the card limit update, the card limit is not updated.

### Card Outstandings

For each card with configured limits, you can retrieve the list of defined maximums and the amount already consumed by the cardholder in the set period using [`GET /cards/{cardId}/outstandings`](https://api.skaleet.com/docs/api/1dyvqvab1b2ns-get-card-outstandings).

## Card Payments

Card payments are reflected in the account that the card has been paired with during creation.

### Reserved Amount
A card authorization is the result of a successful card payment. When a card authorization has occurred, it is visible on the account as a 'reserved amount.' Funds have been reserved for the amount of the payment to be made or for another amount. Funds are reserved until they are settled/consumed or released in the case of expiration or cancellation.

Card authorizations can have the following states: `PENDING`, `CONSUMED`, `CANCELED` and `EXPIRED`.

You can list the authorization holds of a given card using [`GET /card-authorization-holds`](https://api.skaleet.com/docs/api/qh1jq548czvry-list-all-authorization-holds-for-a-card)).

After listing them and retrieveing their id, an authorization hold with the `PENDING` status can be cancelled using [`POST /card-authorization-holds/{id}`](https://api.skaleet.com/docs/api/5785z5esjfkvi-cancel-a-specific-authorization-hold-for-a-card).

For more information about card authorization, refer to 🔒[Manage Card Authorizations](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2858221690).

### Settled Amount
Card settlement is the process of transferring funds from the cardholder's account to the merchant's account for completed transactions.

Once a card payment is settled, it is viewable as any other transaction. 

To search transactions you can use [`GET /transactions`] (https://api.skaleet.com/docs/api/rc3cm1qslh2f5-retrieve-accounting-entries).

For more information about card authorization, refer to 🔒[Manage Card Clearing and Settlement](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2858058293).
.
