---
stoplight-id: epwoaun6zzof6
tags: [product, users]
---

# Users

Users refer to the different individuals or systems using the Skaleet platform.

- Individuals include consumer or corporate customers (including BAAS / B2B2X customers), bank users, and employees.
- Systems include card processors, SEPA lead managers, AML systems, and integrators.

## User Roles

In Skaleet, Users have different roles, and they are modeled quite differently based on this role. Roles only apply to customers and individual (Person) users.

For customers, the available roles are:

- Clients - Consumer customers (natural person)
- Companies - Corporate customers
- Merchants - Corporate customers selling goods or services and therefore accepting payments.
- Agents - Independent agents or employees that can distribute services of the finance institution.
- Distributor - PI Agent or EMI distributor ([to know more](https://api.skaleet.com/docs/api/lmcnxzlbdavdx-about-the-api))

For users that are not customers, the available roles are:

- Non-Customers - Individuals or entities that are not users but are recorded in the platform because they relate to one of the customers.
- Delegate Users - Individuals that are not customers but represent them (act on behalf of).

For more details about the roles, refer to 🔒 [Users](https://tagpay.atlassian.net/servicedesk/customer/portal/1/topic/27e3449a-734a-4068-bcda-27b9133258b5/article/2851834958).

## User Legal Types

Each users have a precise legal type which will affect their relations with other users and their profile (defined below). Not every role can accommodate all legal type.
A user can either be a "Natural Person" or a "Legal Entity".
The legal type is either implied by the role or the profile or defined at user creation.

- Clients and Delegate Users are always natural persons.
- Companies are always legal entities.
- Merchants, Agents and Non-Customers can be natural persons or legal entities and their legal type is defined at creation.

## User Profiles

Customers and Delegate Users are grouped within profiles which define the products they are entitled to, the rights & permissions that are bound to them and rules applied for their operations.

In particular, the user profiles define:

- The required KYC (data + documents) for the customers that needs to be submitted before the finance institution can agree or refuse to open the customer account.
- The products the customer is eligible too (incl. the ones that are to be included right from the onboarding)
- The rights & permissions the customer has on these products.
- The pricing and taxes the customer is submitted to
- The limits applied to their account balances and operations amount.

For more details about user profiles, refer to 🔒 [Manage User Profiles](https://tagpay.atlassian.net/servicedesk/customer/portal/1/topic/27e3449a-734a-4068-bcda-27b9133258b5/article/2851834958).

## User Status

Users hold a status which represent the status of their relationship with the financial institution: `NEW`, `INITIATED`, `PENDING`, `OPEN`, `BLOCKED`, `CLOSED`.

## User Creation

To create a new customer, you must know the profile you want to create them in.

To get access to all profiles that are available you can use [`GET /profiles`](https://skaleet.stoplight.io/docs/api/iiokmvfwi3r5y-list-user-profiles). To know what are the KYC required for a given profile, you can use `GET /profiles/{profileId}` (not yet implemented).

Then, to create a new user (natural person or legal entity), using [`POST /identities`](https://skaleet.stoplight.io/docs/api/sl5l6h03oke1e-create-identity) (or `POST /users`).

To create a legal entity user and since legal entities necessarily have at least one board member, you have to

- First create a board member as an identity
- Then create the legal entity using the board member identifier returned at board member creation and passing it into the mandatory `HAS_FOR_BOARD_MEMBER` relation.

If this works well, the customer is created in `PENDING` status, which means the finance institution needs to review them before they can actually start using the services.

On the required KYC, the format and how to use them is defined the the 'Getting Started' section.

The way the [`POST /identities`](https://skaleet.stoplight.io/docs/api/sl5l6h03oke1e-create-identity) behaves depends on the configuration that has been done. There are 2 main behaviors:

**Behavior 1: Products have been set by default for the user profile selected**

In this scenario, products are created automatically for the user upon creation. For example, a current account and a card are automatically created for the customer.

For more details about product automatic creation, refer to 🔒 [Manage Products](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2902426005).

**Behavior 2: No product has been set by default for the user profile selected**

In this scenario, you’ll have to add the products to the customer after they have been created.

## Customer Onboarding

Customer onboarding is slightly different from customer creation as you do not need to provide all KYC required when creating the user but can do it gradually.

An onboarding file represents the customer onboarding and gather all the information previously filled in. The progress of this process is signified by the onboarding file status.

For more details about customer onboarding, refer to 🔒 [Manage Onboarding](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2852619868).

### Initiate customer onboarding

To start onboarding a customer, use the [`POST /retail-customer-onboarding/initiate`](https://skaleet.stoplight.io/docs/api/5fbthj244ene0-initiate-natural-person-onboarding) which will result in having both the customer and their onboarding file created in `INITIATED` status.

Using [`GET /identities/{identityId}/onboarding-file`](https://skaleet.stoplight.io/docs/api/fs7he9x4zo64l-get-party-onboarding-file), you then get the status of the onboarding file as well as the list of KYC and documents required to finalize the onboarding and the way the form should be structured for the customer to fill in their information (steps information). The latter can be used by a mobile or web application to define the customer journey.

### Update customer onboarding

While a potential customer is in `INITIATED` status, it is possible to update the onboarding file (KYC or documents) using [`PATCH /identities/{identityId}/onboarding-file`](https://skaleet.stoplight.io/docs/api/mnlterfrmqv41-update-onboarding-file).

- The onboarding file status is changed to `COMPLETION_PENDING` as soon as there are some KYC and / or documents that have been added to it. These KYC and documents previously submitted are returned using [`GET /identities/{identityId}/onboarding-file`](https://skaleet.stoplight.io/docs/api/fs7he9x4zo64l-get-party-onboarding-file).

Once all the mandatory KYC and documents have been set for the customer, the onboarding file status is automatically updated to `READY_TO_SUBMIT`.

### Submit customer onboarding

Once in `READY_TO_SUBMIT` status, an onboarding file can be submitted using [`POST /identities/{identityId}/onboaring-file/submit`](https://skaleet.stoplight.io/docs/api/1b5ve9x7hthnt-submit-onboarding-file). The onboarding file is then `SUBMITTED` and the customer status is set to `PENDING`.

Note that you can subscribe to the event `identity.onboarding.submitted` to get notify each time an onboarding file is submitted.

## Customer Validation

Once a customer is in `PENDING` status, it is up to a bank user to define whether they want to open or refuse the opening of the customer account.

If the process goes well - meaning KYC verifications are successful as well as potential scoring or screening - then the customer status will move to `ACTIVE` and they will gain access to the services they have subscribed to.

If the process is blocked because of missing information on the customer, it is possible for the bank user to revert the customer status to `INITIATED` which will change the onboarding file status back to `COMPLETION_PENDING` (or `READY_TO_SUBMIT`)

Note that you can subscribe to the event `identity.information_update.required` to get notified every time a bank user is requesting the update of an onboarding file.

The customer information is updated with the same endpoint [`PATCH /identities/{identityId}/onboaring-file`](https://skaleet.stoplight.io/docs/api/mnlterfrmqv41-update-onboarding-file).

Once the onboarding file has been updated in accordance with the bank user request, it can be submitted again the same way it was submitted first.

## User Management

### Search users

You can search users using [`GET /identities`](https://skaleet.stoplight.io/docs/api/hwxpmddq5to7a-list-identities) and limit your search using the multiple criteria available. The response contains a list of users matching these criteria.

Detailed information on a specific user can be retrieved using [`GET /identities/{identityId}`](https://skaleet.stoplight.io/docs/api/bxmcb0ofej0oc-retrieve-one-identity).

For users that are Companies, a KYC "Number of employees" enables to specify if the company is an employer. You can identity the employers with at least one employee with the endpoint [`GET/available-employers`](https://skaleet.stoplight.io/docs/api/bklev2ny93n2b-load-collection-of-employers-with-at-least-one-employee).

### Update customers

Customer status can be changed but not all transitions are authorized. Using [`GET /identities/{identityId}/available-statuses`](https://skaleet.stoplight.io/docs/api/q7x2pizmd7fcv-get-list-of-statuses-available-for-identity-update), you can view the authorized status transitions for a given user, allowing you to accurately update the identity's status through the [`GET /identities/{identityId}/change-status`](https://skaleet.stoplight.io/docs/api/5bwwurc0jp27m-change-identity-status).

For more details about customer statuses, refer to 🔒 [Manage User Status](https://tagpay.atlassian.net/wiki/spaces/CCC/pages/2851867751/Manage+User+Compliance+Lifecycle?parentProduct=JSM-Portal\&parentProductContentContainerId=10110\&initialAllowedFeatures=disable-login-flow.disable-share\&locale=fr-FR#Manage-User-Status).

Customer KYC can otherwise be updated using [`PATCH /identities/{identityId}`](https://skaleet.stoplight.io/docs/api/td0zplkjryjye-update-identity).

#### KYC expiration

Given that customer KYC are usually bound to an expiration date (e.g. national card id expiration or mandatory renewal after a couple of years, usually based on the customer score), note that:

- It is possible to update the expiration date of KYC using [`PUT /identities/{identityId}/kyc-renewable-date`](https://skaleet.stoplight.io/docs/api/dlesglds84k6w-update-the-renewable-kyc-renewal-date);
- It is possible to search users based on the KYC renewal date.

For more details about renewable KYC, refer to 🔒 [Manage KYC Package](https://tagpay.atlassian.net/wiki/spaces/CCC/pages/2854095764/Manage+KYC?parentProduct=JSM-Portal\&parentProductContentContainerId=10110\&initialAllowedFeatures=disable-login-flow.disable-share\&locale=fr-FR#Manage-KYC-Renewability).

#### Required actions

To signify that a user has to complete a task and to keep track of the task to complete, you can use required actions. Required actions have a type and the list of types is defined by the finance institution.

To manage required actions for a user, you can

- Retrieve the list of required actions types using [`GET /required-actions-types`](https://skaleet.stoplight.io/docs/api/fguokm7axwcnx-get-required-action-types-list);
- Add a new required action using [`PUT /identities/{identityId}/required-actions`](https://skaleet.stoplight.io/docs/api/wjvhofucyyd1f-add-required-action);
- Retrieve the list of required actions for a given user using the endpoint (not yet implemented);
- Delete a required action once completed using [`DELETE /identities/{identityId}/required-actions`](https://skaleet.stoplight.io/docs/api/tnaxi295my44k-deleted-required-action).

Note that it is also possible to search users based on whether they have pending required actions or not.

### Manage external references of customers

When there are multiple systems involved where customers are not identified the same way, it is possible to refer customers using external references. External references have a type and you can have as many references as you wish, one per type. The list of types is configured by the finance institution.

To add an external reference to a customer, you need to know what type of external reference to use. The `GET /external-reference-types` endpoint (not yet implemented) will allow you to get the list of types. Then you can add a reference  using [`POST /identities/{identityId}/external-references`](https://skaleet.stoplight.io/docs/api/nw7yf5c732yi8-add-external-references-for-party).

The endpoint [`GET /external-references`](https://skaleet.stoplight.io/docs/api/hrud8uaw1iyn8-get-external-references-for-party) enables you to search external references by types, values or customers.

For more details about customer external references, refer to 🔒 [User External Reference Management](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2883716050).

## User Relations

Relations between users enable to relate users one to another. Some are used for regulatory purposes, but others may be used for administrative or even marketing purposes. Relations have a type and you can as many relations as you wish. The list of types is configured by the finance institution, on top of some that exist by default.

To manage user relations, you can:

- Retrieve the types of relation configured by the finance institution using [`GET /relation-natures`](https://skaleet.stoplight.io/docs/api/y4ssqhvyn3k45-get-available-relation-natures);
- Add a new relation using [`POST /identities/{identityId}/relations`](https://skaleet.stoplight.io/docs/api/j7quvg6c7qx1k-create-a-new-relation-for-given-identity);
- Retrieve the list of relations for a given user using [`GET /identities/{identityId}/relations`](https://skaleet.stoplight.io/docs/api/hdmjjkrz6s7ay-get-identity-s-relations);
- Delete a relation using [`DELETE /identities/{identityId}/relations/{relationsId}`](https://skaleet.stoplight.io/docs/api/x0pkafpyeadqc-delete-a-relation);

Four types of relations are configured by default and will always be returned:

| Nature           | Description                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| BOARD_MEMBER     | Designates a board member of a legal entity. A board member can be both a natural person or a legal entity |
| BENEFICIAL_OWNER | Designates a beneficial owner of a legal entity. A beneficial owner can only be a natural person           |
| EMPLOYEE         | Designates employees of a legal entity. An employee can only be a natural person                           |

> Delegate Users are managed as a complete role to date and not as a relation. Therefore, you can't add a delegate user as a relation unless a custom relation has been created to do so.

For more details about user relations, refer to 🔒 [Management Users Relations](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2851835579).

## User Devices

User can hold different devices in the system for various reasons and purposes.

One such device is a customer's phone. All SMS will be sent to this phone after it has been linked with a client.

> A **phone device** is not similar to the contact phone (KYC) of a user. For a user to receive SMS through the platform, it is mandatory that the user has a phone device or that won't receive the SMS as intended.

To pair a phone device to a customer, you can use [`POST /identities/{identityId}/phones`](https://skaleet.stoplight.io/docs/api/lpncqlwbrgfhp-associate-a-new-phone-to-an-identity).

To date, phone devices must be unique, meaning you cant' have 2 customers with the same phone devices. Exceptions to the rule are the following:

- Users with same phone device don't have the same role (e.g. customer 1 is a client and customer 2 a delegate user)
- Users with same phone device don't belong to the same distributor (not yet implemented)
- Users with same phone device are delegates of different entities (not yet implemented)

## User Credentials

In multiple cases, users have a pincode they need to use to authenticate when requesting operations. You can reset the pincode of a user using [`POST /identities/{identityId}/credentials/reset-pincode`](https://skaleet.stoplight.io/docs/api/5kwzvxaz1vvi5-reset-identity-pincode).

As explained in the introduction of this document, Delegate Users are individuals that are not customers but represent them and/or act on their behalf (connect on a web portal to execute an operation for example).

These users are created using [`POST /delegated-accesses`](https://skaleet.stoplight.io/docs/api/t9tzdmz1xg6rp-create-new-party-with-delegated-access-to-another) by defining their profile, the user they will represent and the credentials they will use to connect: a login and an email to receive a temporary password. The uniqueness of the delegate users' access is determined by their login, which is verified upon creation.

Once the delegate user has been created, its password can be reset using [`POST /delegated-accesses/{delegateIdentityId}/reset`](https://skaleet.stoplight.io/docs/api/evw61ca5ixuql-reset-delegate-user-password).

Eventually, a delegate user's access can be deactivated with [`POST /delegated-accesses/{delegateIdentityId}/deactivate`](https://skaleet.stoplight.io/docs/api/nc11ffl4l6gat-deactivate-delegate-user), disabling the delegate user from performing any actions using this login.

## User Recipients

Beneficiaries, also known as recipients, are the individuals whom a user in order to transfer money and avoid having to type down their bank account information each time they want to execute out a transaction.

Recipients can be of different types:

| Type|Description|
| --------------------- | ------- |
| IBAN                  | Most common designation, works internationally and using any network / scheme                                                                 |
| ACCOUNT NUMBER (BBAN) | In some countries Account Number + BIC are more widely used than IBAN                                                                         |
| PHONE NUMBER          | For mobile money transfers mainly, phone numbers may be easier to use. Registered mobile number need to be on the phone devices in that case. |

To manage user recipients, you can:

- List a user's recipient using [`GET/identities/{identityId}/recipients`](https://skaleet.stoplight.io/docs/api/dfdacmgjvz3bt-list-recipients-of-an-identity);
- Add a new recipient using [`POST /identities/{identityId}/recipients`](https://skaleet.stoplight.io/docs/api/lj7rdrielyafy-create-a-recipient-for-an-identity);
- Edit a recipient (name) using [`PATCH /identities/{identityId}/recipients/{recipientId}`](https://skaleet.stoplight.io/docs/api/t7r6zujb2dmn9-update-one-recipient-for-an-identity);
- Delete a recipient using [`DELETE /identities/{identityId}/recipients/{recipientId}`](https://skaleet.stoplight.io/docs/api/vdsnhr7f0ug0o-delete-one-recipient-for-an-identity);
