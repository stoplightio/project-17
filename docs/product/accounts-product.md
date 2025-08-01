---
stoplight-id: bjlrlrwsrrjo2
tags: [product, accounts]
---

# Customer Accounts

The term "Customer Account" refers to the specific deposit facility that enables individuals or corporate clients to hold and manage their funds within the financial institution. These accounts serve as the central point for a number of financial activities, especially making deposits and withdrawals, earning interest, receiving payments, and paying bills.

Customer accounts materialize products customers subscribe to and differ from internal bank accounts that reflect a ledger account. 

An account is always linked to a currency ([more details](https://api.skaleet.com/docs/api/j5e4mk4stmtr7-data-types-representations) about currencies format).

In general, the customer account lifetime consists of the subsequent steps:
- Create an account.
- Update an account.
- Change status of an account.
- Close an account.

## Account Characteristics

### Account Identification
Each banking account is uniquely recognised by its Basic Bank Account Number (BBAN), generated at creation. In addition to this BBAN, accounts can also be recognised by their IBAN and, in certain circumstances, a phone number (the account holder's phone number) can be used.
 
 > IBAN are mandatory for accounts which are designed to send and receive payments outside from the bank.

You can also identify your account adding and managing external references. 

For more details about the IBAN, refer to 🔒 [Configure IBAN](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2854947029).

### Account Types

In Skaleet, each account has a type that describes its intended function. 

|Type|Description/Use|
|----|----|
|CURRENT|Account that holds balances in a given currency, can have fees and limits (in particular payment accounts that can't have overdrafts)|
|TECHNICAL|Account related to an electronic money account or to a "virtual"|
|COMMISSION|Account where an Agent earns the interests earned while accepting transactions|
|SUB|Account with a number, which can be used for payments on top of a current account|
|SAVINGS|Account where the customer accumulates interest on funds|
|MONEYPOT|Account holding contributions of participants to a moneypot|

The main type being used is the `Current Account`. To date, a given customer can only subscribe to one current account. This limit does not apply to other types of account.  

### Account Balances

An accounting and an available balance are kept for each account. After every debit and credit transaction has been balanced, the amount that remains accessible to the account holder is known as the accounting balance.

The Available Balance is calculated as follows: 

`Available Balance = Accounting Balance - Funds Reservation + Overdraft Threshold`

Where: 
- Funds Reservations is a transaction authorization in which the balance is unavailable to the account holder until it is either settled or cancelled.
- Overdraft Threshold is an amount that can be overdrawn on an account with the permission of the bank.

These two balances can be retrieved for a given account using [`GET/accounts/{accountId}/balances`](https://skaleet.stoplight.io/docs/api/wmpt6f8pgbhko-read-an-account-s-balances).

### Account Statements

Bank statements track the account details and activity over time. 

- Account details enable the account holder to download and use / share details of their account for others to use (e.g. French RIB) it can be downloaded using [`GET/accounts/{accountId}/bank-account-details/download`](https://skaleet.stoplight.io/docs/api/nm5ndnng0cejs-download-bank-account-details).
- Account statements track the account activity over a certain period of time—typically one month; the account holder can get the records of all their transactions — both incoming and outgoing.
  - To download an account statement, you need first to retrieve the list of all the account statement for a given account using [`GET /accounts/{accountId}/statements`](https://skaleet.stoplight.io/docs/api/5f5kdsl0lobrr-list-all-account-statements).
  - You can then request the downloading of an account statement using [`GET /accounts/{accountId}/statements/{statementId}/download`](https://skaleet.stoplight.io/docs/api/j9jraij69h0zu-download-an-account-s-statement).
  - You may also generate and download a statement for a defined period using [`GET /accounts/{accountId}/statements/generate`](https://skaleet.stoplight.io/docs/api/6exjyj91jrmaq-generate-and-download-a-statement-of-account-for-a-defined-period).

For more details about statements, refer to 🔒 [Configure Account and Fees Statements](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2856255814).

## Account Lifecycle
The customer account lifecycle in banking is a systematic process that commences when an individual or business opens an account with a financial institution. It continues throughout the account's existence until it eventually terminated. Accounts holds a status which represents their relationship status with the financial institution: `OPEN`, `BLOCKED`, `DEBIT BLOCKED`, `CREDIT BLOCKED`, `DEBIT BLOCKED` and `CLOSED`.

Note that events `account.status.opened`, `account.status.blocked`, `account.status.debitBlocked`, `account.status.creditBlocked`, `account.status.closed` are respectively emitted when an account status is changed to one them. The event `account.status.unblocked` is emitted when an account status is changed from one of the three blocked status.

For more details about accounts lifecycle, refer to 🔒 [Manage Account Statuses](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2872967858).

### Account Creation

You can open an account using [`POST /accounts`](https://skaleet.stoplight.io/docs/api/temd91fsl414v-create-an-account), providing the product and holder the account will belong to. Accounts are created with the status `OPEN`.


### Account Blocking

You can block/unblock an account using [`POST /accounts/{accountId}/block`](https://skaleet.stoplight.io/docs/api/ridd6ofmdfn9b-block-an-account). As a result, all transactions or operations you try on the account will be rejected.

To unblock the account, use the [`POST /accounts/{accountId}/unblock`](https://skaleet.stoplight.io/docs/api/wkiaqspnzguan-unblock-an-account). 


### Account Closing

You can close an account using [`POST /accounts/{accountId}/close`](https://skaleet.stoplight.io/docs/api/zz58gykjbqc29-close-an-account).

Conditions for the accounts to be closable: 

- No funds reservation
- No overdraft
- No related savings
- No unprocessed payments
- No standing orders

Once closed, an account cannot be reopened.

### Account Management
#### Search accounts

You can search accounts using [`GET/accounts`](https://skaleet.stoplight.io/docs/api/i4wo2sf8kzzjd-read-account-list) limit your search using the multiple criteria available. The response contains the list of accounts matching these criteria.

With the BBAN of a given account, you can: 
- Retrieve its detailed information using [`GET/accounts/{accountId}`](https://skaleet.stoplight.io/docs/api/b7kqlvbe1rzm7-retrieve-an-account).

#### Manage accounts external references

When they are multiple systems involved where accounts are not identified the same way, it is possible to refer to an account using external references. External references have a type, you can have as many references as you wish, one per type. The list of types is configured by the financial institution.

To add an external reference to an account, you need to know what type of external reference to use. The `GET /external-reference-types`(not yet implemented) endpoint will allow you to get the list of types. Then you can add a reference  using [`POST /accounts/{accountId}/external-references`](https://skaleet.stoplight.io/docs/api/e8ju3a2abkh3p-create-external-reference-for-an-account).

Once created, you can:
- Retrieve the list of all the external references of an account using [`GET /accounts/{accountId}/external-references`](https://skaleet.stoplight.io/docs/api/tcalf985e3oo4-get-all-external-references-for-an-account).
- Replace all external references for an account by a list of other references using [`PUT /accounts/{accountId}/external-references`](https://skaleet.stoplight.io/docs/api/ow5et13aildml-replace-all-external-references-for-an-account).
- Delete an external reference for an account using [`DELETE /accounts/{accountId}/external-references`](https://skaleet.stoplight.io/docs/api/94lu06448ccyj-delete-an-external-reference-for-an-account).
- Update an external reference for an account using [`PATCH /accounts/{accountId}/external-references/{type}/{reference}`](https://skaleet.stoplight.io/docs/api/fozyj4cb1q94r-update-an-external-reference-for-an-account).

> **External references** and **external ID** can serve similar purposes, but an account can have multiple external references and only one external ID. **External data** and external references can also serve similar purposes, but external data consists of one structured item with keys and values, whereas external references are multiple items each defined by a specific type and a value.

#### Manage accounts additional data

To have more precise information about a user and its account, additional data based on KYC can be attached to an account. These KYC can be customized by the financial institution and then gathered in a package linked to a product. 
To retrieve the list of additional data configurable and set for an account, you can use [`GET /accounts/{accountId}/additional-data`](https://skaleet.stoplight.io/docs/api/78527e9ea5e90-retrieve-an-account-additional-data). Then to update these data you can use [`PATCH /accounts/{accountId}/additional-data`](https://skaleet.stoplight.io/docs/api/600678fa6492f-update-the-additional-data-of-an-account).

Thanks to the [`GET /kyc-data-packages`](https://skaleet.stoplight.io/docs/api/6n9vkp4ht88mu-search-additional-data-packages), you can get the list of all the KYC packages and their id. With their id, you can retrieve the list of KYC data gathered in these packages using [`GET /kyc-data-packages/{id}`](https://skaleet.stoplight.io/docs/api/ltfaq2ist5osd-get-an-additional-data-package-by-id). 

With the name of the KYC data you can then retrieve the format and its parameters (length limit, regular expression) using [`GET /kyc-data/{id}`](https://skaleet.stoplight.io/docs/api/lb3l4dwumx00r-get-an-additional-data).

#### Update accounts information

Multiple information of an account can be updated: 
- The IBAN, the international bank account number used to identify the account for payments with other financial institutions using [`PATCH /accounts/{accountId}/iban`](https://skaleet.stoplight.io/docs/api/40ub7312jswkk-update-an-account-s-iban).
- The external id, the account identifier in an external system using [`PATCH /accounts/{accountId}/externalId`](https://skaleet.stoplight.io/docs/api/dh6hpxeipx3cb-update-an-account-s-external-id).
- The external data, the account information in an external system using [`PATCH /accounts/{accountId}/external-data`](https://skaleet.stoplight.io/docs/api/uf6mpljnqarue-update-the-external-data-of-an-account).
- The name, the label of the account using [`PATCH /accounts/{accountId}/name`](https://skaleet.stoplight.io/docs/api/3fv9tr59qph6q-update-an-account-s-name).

#### Manage accounts overdrafts

Limits of an account can be configured on the product configuration or on the profile configuration. An authorized overdraft can be configured for a specific account using [`PATCH /accounts/{accountId}/authorizedOverdraft`](https://skaleet.stoplight.io/docs/api/ef95121f081e3-update-an-account-s-discretionary-overdraft). 

Once created, you can: 
- Update it using the same endpoint used for creation.
- Retrieve the authorized overdrafts configured for a given account using  [`GET /accounts/{accountId}/authorizedOverdraft`](https://skaleet.stoplight.io/docs/api/5e2f1709f5ca4-get-authorized-overdraft-for-an-account).
- Delete an authorized overdraft for a given account using [`DELETE /accounts/{accountId}/authorizedOverdraft`](https://skaleet.stoplight.io/docs/api/9ae09ff1f5259-delete-discretionary-overdraft-for-an-account).

For more details about authorized overdraft, refer to 🔒 [Configure Authorized Overdrafts](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2856485049).

#### Manage accounts access

Accounts are always to a user and by definition this customer is the only one authorized to execute actions impacting this account. However, delegate users may be authorized to act on it as well. 

To authorize and unauthorize a delegate user to have access to a specific account, you can link the delegate user to the account using [`POST/accounts/{accountId}/link`](https://skaleet.stoplight.io/docs/api/jfgsbzm7jxw3t-link-delegate-users-to-an-account) and unlink them using [`POST/accounts/{accountId}/unlink`](https://skaleet.stoplight.io/docs/api/avynbl8ear5uk-unlink-account-s-delegate-users).
