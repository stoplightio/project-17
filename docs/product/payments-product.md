---
stoplight-id: 7qd0m8ajgbp4b
tags: [product, Payments]
---

# Payments

A payment is a concept that brings together all the activities by which ultimately and at a given moment, an exchange of money will be carried out between two stakeholders. One will be credited, the other will be debited.

# Payment Request Types 
Skaleet's Core Banking System (CBS) modules support several forms of payment requests. Among them are:
* Credit Transfer 
* Direct Debits

# Payment Network
Network parameters configuration enables you to connect to external networks or institutions and carry out interbank transfers and direct debit transactions with them. The management of closed days and cut-offs is also configurable in the networks, this allows, in particular, to be able to take snapshots and to decide how interbank remittances are managed (bulk, unit, instant). 

You can list all the configured networks using [`GET /payment-networks/configuration`](https://api.skaleet.com/docs/api/0ad67359ab65e-get-activated-networks-configuration). With this you can have the service level of all the configured networks. You can then retrieve one specific network with its service level using [`GET /payment-networks/{serviceLevel}/configuration`](https://api.skaleet.com/docs/api/251655bf08046-get-network-configuration).

Network configuration can updated using [`PATCH /payment-networks/{serviceLevel}/configuration`](https://api.skaleet.com/docs/api/7e6714348a5bd-update-network-configuration). It is possible to modify the structure of accepted addresses, the chart of accounts, as well as the management of interbank remittances.

For more information about payment network configuration, refer to 🔒[Configure Payment Networks](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2873230417).

# Credit Transfers

A credit transfer is a type of financial transaction that involves the transfer of funds from one bank account to another. It allows individuals or businesses to send money electronically to another party. Controlling interbank transfers from start to finish, including processing and settlement, is possible with Skaleet's CBS.

|Credit Transfers Types||
|---|---|
|**Inward Credit Transfer**| When an external party (the debtor) sends money to an internal user of the platform (the creditor).|
|**Outward Credit Transfer**| When an internal user of the platform (the debtor) sends money to an external party (the creditor).||


A credit transfer request from a customer is represented in a **customer remittance/instructions**.
A customer instruction is made of one or more payment transactions.
The payments in a customer instruction are homogeneous: they share the same payment instrument (direct debit or transfer), payment object (salary payment, supplier payment,etc.), ordering party, date of execution and network.
Customer instructions only exist for outward credit transfers.
The customer instruction lifecycle represents the status of progress of the payment from initiation to processing.

## Initiate Credit Transfers
### Manage Customer Instructions
#### Create Customer Instruction
Creating a single or multiple customer instruction is the initial step in issuing. You can **create a customer instruction** using [`POST /customer-instructions/credit-transfers`](https://api.skaleet.com/docs/api/52b5a832e4ef8-initiate-a-customer-instruction). 
The customer instruction is created with the status `INI_STARTED`.
Validity controls are realised on the sent customer instruction to make sure that :
- The initiating party exist in Skaleet repository and is neither closed nor blocked.
- The requested execution date has not already occured.
If these validity controls pass, the customer instruction status is changed to `INI_IS_VALID`, and if they fail, to the status `INI_NOT_IS_VALID`.

Then, internal controls are realised on the sent customer instruction to make sure that :
- The currency, the country of the initiating party and debtor are configured in the platform.
- The debtor and its account exist in Skaleet repository and is neither closed nor blocked.
- The debtor account is linked to the debtor and has a transfer issuance contract.
If these internal controls pass, the customer instruction status is changed to `INI_INT_CTRL_PASSED`, and if they fail, to the status `INI_INT_CTRL_FAILED`.
If the customer instruction is in the status `INI_INT_CTRL_PASSED` it is automatically changed to `INITIATED`.

> Statuses `INI_STARTED`,`INI_IS_VALID` and `INI_INT_CTRL_PASSED` are internal statuses, customer instruction should not be returned with one of these.

#### Search Customer Instruction
When the customer instruction is created, an identifier is automatically generated, the 'customer instruction id', which can be used to perform actions on it.

Using this identifier, you can **retrieve the customer instruction** information using [`GET /customer-instructions/credit-transfers/{customerInstructionId}`](https://api.skaleet.com/docs/api/82c71efb58d39-view-a-customer-instruction).

You can **search customer instructions** using [`GET /customer-instructions`](https://api.skaleet.com/docs/api/863045a472555-retrieve-all-customer-instructions) and limit your search using the multiple criteria available. The response contains a list of customer instructions matching these criteria. 

#### Edit Customer Instruction

With the id you can **edit the customer instruction** using [`PATCH /customer-instructions/credit-transfers/{customerInstructionId}`](https://api.skaleet.com/docs/api/86b1b813488ae-update-a-customer-instruction-of-credit-transfers), if the status is an initiated one (`INI_STARTED`, `INI_NOT_IS_VALID`, `INI_IS_VALID`, `INI_INT_CTRL_PASSED`, `INI_INT_CTRL_FAILED`, `INITIATED`). 
When a customer instruction is edited, it undergoes the same controls as it did for its creation. Hence, its status will be: `INI_NOT_IS_VALID`, or `INI_INT_CTRL_FAILED`, or `INITIATED` depending on the validity and internal control results.

> Statuses `INI_STARTED`,`INI_IS_VALID` and `INI_INT_CTRL_PASSED` are internal statuses, customer instruction should not be returned with one of these.

#### Delete Customer Instruction
If the customer instruction has an initiated status (`INI_STARTED`, `INI_NOT_IS_VALID`, `INI_IS_VALID`, `INI_INT_CTRL_PASSED`, `INI_INT_CTRL_FAILED`, `INITIATED`) and no payment transaction is linked to it, you can **delete the customer instruction** using [`DELETE /customer-instructions/credit-transfers/{customerInstructionId}`](https://api.skaleet.com/docs/api/7f3f6d65af242-delete-a-customer-instruction-of-credit-transfers-before-submission).

For more information about credit transfer initiation, refer to 🔒[Credit Transfer Initiation](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2873295038).

### Manage Payment Transactions
Once a customer instruction has been initiated, one or more payment transactions must be linked to it. The  customer instruction carries global information that does not need to be recalled in each payment transaction, such as who the initiator of the payment or the debtor is.

#### Create Payment Transaction
The payment transactions can be initiated and linked to a customer instruction with the status `INITIATED` using [`POST /customer-instructions/credit-transfers/{customerInstructionId}/payment-transactions`](https://api.skaleet.com/docs/api/b39ac3da9bc17-initiate-a-payment-transaction-and-associate-to-existing-customer-instruction-of-credit-transfers).

The payment transaction is created with the status `INI_STARTED`.
Validity controls are realised on the sent payment transactions to make sure that the instructed date has not already occured.
If these validity controls pass, the payment transaction status is changed to `INI_IS_VALID`, and if they fail, to the status `INI_NOT_IS_VALID`.

Then, internal controls are realised on the sent payment transaction to make sure that :
- The creditor and its account exist in Skaleet repository and is neither closed nor blocked.
- The creditor account is linked to the debtor and has a transfer issuance contract.
- If the creditor is not in the platform, the service level is indicated.
If these internal controls pass, the payment transaction status is changed to `INI_INT_CTRL_PASSED`, and if they fail, to the status `INI_INT_CTRL_FAILED`.
If the payment transaction is in the status `INI_INT_CTRL_PASSED` it is automatically changed to `INITIATED`.

When the payment transaction is created, an identifier is automatically generated, the 'payment transaction id', which can be used to perform actions on it.

> Statuses `INI_STARTED`,`INI_IS_VALID` and `INI_INT_CTRL_PASSED` are internal statuses, payment transaction should not be returned with one of these.

#### Search Payment Transaction
Using this identifier, you can **retrieve the payment transaction** information using [`GET /payment-transactions/{paymentTransactionId}`](https://api.skaleet.com/docs/api/f33e8efb7d311-view-a-payment-transaction).

You can **search payment transactions** using the [`GET /payment-transactions`](https://api.skaleet.com/docs/api/c9bb9f162ca26-load-payment-transactions) endpoint and limit your search using the multiple criteria available. The response contains a list of payment transactions matching these criteria. 

To **find all the payment transactions associated to a customer instruction** you can choose to:
- Retrieve a detailed list of all these payment transactions using [`GET /customer-instructions/{customerInstructionId}/detailed-payment-transactions`](https://api.skaleet.com/docs/api/bb69c3721fa9e-load-detailed-payment-transactions-associated-to-customer-instruction).
- Retrieve a minified list of all these payment transactions (only essentials payment transaction information) using [`GET //customer-instructions/{customerInstructionId}/payment-transactions`](https://api.skaleet.com/docs/api/468edac643d0c-load-minified-payment-transactions-associated-to-customer-instruction).

#### Edit Payment Transaction
With the payment transaction id, you can **edit the payment transaction** using [`PATCH /customer-instructions/credit-transfers/payment-transactions/{paymentTransactionId}`](https://api.skaleet.com/docs/api/ec9ecea33c573-update-a-payment-transaction-associated-to-a-customer-instruction-of-credit-transfers) if the status is an initiated one (`INI_STARTED`, `INI_NOT_IS_VALID`, `INI_IS_VALID`, `INI_INT_CTRL_PASSED`, `INI_INT_CTRL_FAILED`, `INITIATED`). 
When a payment transaction is edited, it undergoes the same controls as it did for its creation. Hence, its status will be: `INI_NOT_IS_VALID`, or `INI_INT_CTRL_FAILED`, or `INITIATED` depending on the validity and internal control results.

> Statuses `INI_STARTED`,`INI_IS_VALID` and `INI_INT_CTRL_PASSED` are internal statuses, payment transaction should not be returned with one of these.

#### Delete Payment Transaction
If the payment transaction has an initiated status(`INI_STARTED`, `INI_NOT_IS_VALID`, `INI_IS_VALID`, `INI_INT_CTRL_PASSED`, `INI_INT_CTRL_FAILED`, `INITIATED`), you can **delete the payment transaction** using[`DELETE /customer-instructions/credit-transfers/payment-transactions/{paymentTransactionId}`](https://api.skaleet.com/docs/api/88c8f255e5a47-delete-a-payment-transaction-associated-to-a-customer-instruction-of-credit-transfers-before-submission).

## Submit Credit Transfers
Once created and correclty defined, the credit transfer can be submitted using [`POST /customer-instructions/credit-transfers/{customerInstructionId}/submit`](https://api.skaleet.com/docs/api/a652ab7ece052-submit-a-credit-transfer).

When submitted, validity and internal controls will be performed on the customer instruction and on the payment transactions. The status of these two elements will depend on the result of these controls.

|Customer Instruction Status|Payment Transaction Status||
|---|---|---|
|`INITIATED`|`INITIATED`|Both customer instruction and payment transaction are ready to be submitted.|
|`SUB_REQUIRED`|`SUBMITTED`|Both customer instruction and payment transaction were submitted successfully (validity and internal controls passed).|
|`SUB_REQUIRED`|`SUB_NOT_IS_VALID`|The customer instruction was submitted successfully and payment transaction did not pass validity controls.|
|`SUB_REQUIRED`|`SUB_INT_CTRL_FAILED`|The customer instruction was submitted successfully and payment transaction did not pass internal controls.|
|`SUB_NOT_IS_VALID`|`C_INSTRUCTION_SUB_NOT_PASSED`|The customer instruction did not pass validity controls.|
|`SUB_INT_CTRL_FAILED`|`C_INSTRUCTION_SUB_NOT_PASSED`|The customer instruction did not pass internal controls.|

When the customer instruction is `SUB_REQUIRED` and the payment transaction is `SUBMITTED`, the submission then automatically undergoes a validation for processing, the status of the customer instruction will depend on the results of this control:
*If the settlement date of the customer instruction is reached, its status is `READY_FOR_PROCESSING`.
*If the settlement date has been reached yet, its status is `WAREHOUSED`.
*If the processing validation fails, its status is `P_INSTRUCTION_SUB_NOT_PASSED`.

A job is run daily to initiate the process of warehoused customer instruction for which the settlement date is reached.

For more information about credit transfer submission, refer to 🔒[Credit Transfer Submission](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2872607846).

## Submit Directly Credit Transfers

The direct submission of credit transfers is the process of initiating and submitting a credit transfer in a single step. In this one process the customer instruction is initiated, the payment transaction is initiated and associated to the customer instruction and the customer instruction is subimtted. 

You can submit a credit transfer with a single payment using [`POST /customer-instructions/credit-transfers/submit`](https://api.skaleet.com/docs/api/fe7781ad5b729-submit-a-credit-transfer-single-payment).

For more information about credit transfer direct submission, refer to 🔒[Credit Transfer Direct Submission](https://tagpay.atlassian.net/servicedesk/customer/portal/1/article/2873295061).


# Interbank Network Connection With Skaleet Payment Baseframe

Skaleet payment baseframe aims to standardize the processing of a payment.
Anything that goes out on an interbank network must be included in an interbank remittance: a **payment instruction**. Network specificities are managed by the connector. 
An outward instruction is when an internal user of the platform emits a payment instruction impacting an external party.
An inward insrcution is when an external party emits a payment instruction impacting an internal user of the platform.

## Manage Outward Payment
Outward payments are initiated with customer instructions. Customers instructions are initiated and submitted with the previous process described in "Credit Transfers":
- The Credit Transfer Customer Instruction is initiated.
- Payment Transaction(s) is(are) initiated and associated to the customer instruction.
- The Credit Transfer Customer Instruction is submitted.
The system process the payment transaction(s) and creates a payment instruction gathering all the payment transactions for the same interbank network and stellement date.

### Submit Payment Instruction
If no cut-off dates are configured, then the connector can inform Skaleet that the customer instruction is submitted using [`POST /outward-payment-instructions/{paymentInstructionId}/submit`](https://api.skaleet.com/docs/api/f03f1a7968fe2-submit-payment-instruction).

If a cut-off date is configured, then when it is reached, the payment instruction is closed and internally submitted and the event *outward_payment_instruction.submitted* is emitted.

### Retrieve Payment Instruction Informations
The connector can subscribe to this event which contains the id of the payment instruction in its payload. With this id, you can retrieve the payment instruction ready to be submitted using [`GET /payment-instructions/{paymentInstructionId}`](https://api.skaleet.com/docs/api/40d9f508a6e10-load-payment-instruction-information).

You can search payment instructions using the [`GET /payment-instructions`](https://api.skaleet.com/docs/api/6c767e073f766-list-all-payment-instructions) endpoint and limit your search using the multiple criteria available. The response contains a list of payment instructions matching these criteria.

With the payment instruction id you can also retrieve the information of the payment transactions associated to it :
- Using [`GET /payment-instructions/{paymentInstructionId}/payment-transactions`](https://api.skaleet.com/docs/api/6cbdc004f74ca-load-minified-payment-transactions-associated-to-payment-instruction) to retrieve the essentials informations of these payment transactions.
- Using [`GET /payment-instructions/{paymentInstructionId}/detailed-payment-transactions`](https://api.skaleet.com/docs/api/14f0a0bc27712-load-detailed-payment-transactions-associated-to-payment-instruction) to retrieve the detailed informations of these payment transactions.

### Confirm/Refuse Payment Instruction Informations
With these informations, the connector can generate the file to transfer this payment instruction to the interbank network. The connector then receives a result indicating if the exchange was executed successfully or was refused.
These execution results has to be transferred to Skaleet :
- If all the payment transactions of the payment intruction were exchanged successfully, you can use [`POST /outward-payment-instructions/{paymentInstructionId}/exchange`](https://api.skaleet.com/docs/api/dc4f70fc97f96-exchange-payment-instruction).
- If all the payment transactions of the payment intruction were refused, you can use [`POST /outward-payment-instructions/{paymentInstructionId}/refuse`](https://api.skaleet.com/docs/api/6c8da6578c392-refuse-payment-instruction).
- If some payment transactions were exchanged and other were refused, you can use [`POST /outward-payment-instructions/payment-transactions/{paymentTransactionInternalId}/exchange`](https://api.skaleet.com/docs/api/01fdeb9353f6e-exchange-a-payment-transaction) for the exchanged ones and [`POST /outward-payment-instructions/payment-transactions/{paymentTransactionInternalId}/refuse`](https://api.skaleet.com/docs/api/de0ae184f7c09-refuse-a-payment-transaction) for the refused ones.

## Manage Inward Payment
When a transaction coming from the interbank connector has to impact one of the platform customer, the connector receives the transactions informations.
### Manage Payment Instruction
The connector can then initiate an inward payment instruction using [`POST /inward-payment-instructions/credit-transfers`](https://api.skaleet.com/docs/api/d9bd340e6fafc-initiate-a-payment-instruction).

The created payment instruction has an id which can be used to edit it using [`PATCH /inward-payment-instructions/credit-transfers/{paymentInstructionId}`](https://api.skaleet.com/docs/api/8e5c072997758-update-payment-instruction) or to delete it using [`DELETE /inward-payment-instructions/credit-transfers/{paymentInstructionId}`](https://api.skaleet.com/docs/api/64f188b4c4b16-delete-a-payment-instruction).

### Manage Payment Transactions

Then payment transactions can be created and associated to the payment instruction using [`POST /inward-payment-instructions/credit-transfers/{paymentInstructionId}/payment-transactions`](https://api.skaleet.com/docs/api/3ec19d2c1450d-initiate-a-payment-transaction-and-associate-it-to-a-payment-instruction).
These payment transactions can be edited using [`PATCH /inward-payment-instructions/credit-transfers/payment-transactions/{paymentTransactionId}`](https://api.skaleet.com/docs/api/cfb2585fdb476-update-a-payment-transaction-associated-to-a-payment-instruction) and deleted using [`DELETE /inward-payment-instructions/credit-transfers/payment-transactions/{paymentTransactionId}`](https://api.skaleet.com/docs/api/ac0e3798eb496-delete-a-payment-transaction-associated-to-a-payment-instruction).

### Submit Inward Payment Instruction
Then the payment instruction can be submitted using [`POST /inward-payment-instructions/{paymentInstructionId}/submit`](https://api.skaleet.com/docs/api/6dcea1bc99a11-submit-an-inward-payment-instruction). When submitting the instruction, Skaleet will validate the transactions. If the validation pass, the transactions will be processed and a success reponse will be returned. 

### Single Inward Payment Instruction
For a single payment transaction, the steps can be condensed into one using [`POST /inward-payment-instructions/credit-transfers/submit`](https://api.skaleet.com/docs/api/3ed9c9defc0cc-submit-an-inward-payment-instruction-with-a-single-payment-transaction) with which you can initiate the payment instruction, create the payment transaction, asscoiate the payment transaction to the payment instruction and submit the payment instruction in a single step.

## Manage Reject or Refund Payment
Third-party impacted by the transactions can request to reject or refund the transactions. In this case, the reject or refund are representend by R-Operations.
R-Operations can be inward or outward depending on the request emitter: the creditor bank or the network for inward and the platform customer for the outward.

### Manage Inward R-Operations

Rejects and refunds can be emitted by the network or the creditor bank, in this case they are represented by inward R-Operations. 
The connector receives these requests and transfer them to Skaleet by initiating an inward payment instruction using [`POST /inward-payment-instructions/credit-transfers`](https://api.skaleet.com/docs/api/d9bd340e6fafc-initiate-a-payment-instruction).
For each reject or refund request, you can create a r-payment transaction and associate it to the payment instruction using [`POST /inward-payment-instructions/credit-transfers/{paymentInstructionId}/payment-r-transactions`](https://api.skaleet.com/docs/api/7f093d6e3a745-initiate-a-payment-r-transaction-and-associate-it-to-a-payment-instruction). Multiple r-payment transactions can be associated to one payment instruction.

You can retrieve these r-transactions using [`GET /payment-r-transactions/{paymentRTransactionId}`](https://api.skaleet.com/docs/api/b854cfb8113cb-view-a-payment-r-transaction).

You can search payment r-transactions using the [`GET /payment-r-transactions`](https://api.skaleet.com/docs/api/65369898c3e6f-load-payment-r-transactions) endpoint and limit your search using the multiple criteria available. The response contains a list of payment instructions matching these criteria.

To **find the r-operation associated to a payment instruction** you can choose to:
- Retrieve a detailed list of these r-operations using [`GET /payment-instructions/{paymentInstructionId}/detailed-payment-r-transactions`](https://api.skaleet.com/docs/api/d695906dcca68-load-detailed-payment-r-transactions-associated-to-payment-instruction).
- Retrieve a minified list of all these r-operations (only essentials r-operations information) using [`GET /payment-instructions/{paymentInstructionId}/payment-r-transactions`](https://api.skaleet.com/docs/api/73363dbd35cef-load-minified-payment-r-transactions-associated-to-payment-instruction).

These r-payment transactions can be edited using [`PATCH /inward-payment-instructions/credit-transfers/payment-r-transactions/{paymentRTransactionId}`](https://api.skaleet.com/docs/api/r67ws3mb3v7n7-update-a-payment-r-transaction-associated-to-a-payment-instruction) and deleted using [`DELETE /inward-payment-instructions/credit-transfers/payment-r-transactions/{paymentRTransactionId}`](https://api.skaleet.com/docs/api/zwmkmevrsro6n-delete-a-payment-r-transaction-associated-to-a-payment-instruction).

The payment instruction can be submitted using [`POST /inward-payment-instructions/{paymentInstructionId}/submit`](https://api.skaleet.com/docs/api/6dcea1bc99a11-submit-an-inward-payment-instruction) to initiate the r-transactions processing.

### Manage Outward R-Operations

The platform customer can request to return a payment, in this case these operations they are represented by outward R-Operations.

When the customer request to return the payment, you have to submit it directly using [`POST /customer-instructions/r-credit-transfers/submit`](https://api.skaleet.com/docs/api/eec8ee788b8c8-submit-a-credit-transfer-single-payment-r-transaction), the customer instruction and the r-operation will be created, associated together and submitted in a single step.

You can retrieve these r-transactions using [`GET /payment-r-transactions/{paymentRTransactionId}`](https://api.skaleet.com/docs/api/b854cfb8113cb-view-a-payment-r-transaction).

You can search payment r-transactions using the [`GET /payment-r-transactions`](https://api.skaleet.com/docs/api/65369898c3e6f-load-payment-r-transactions) endpoint and limit your search using the multiple criteria available. The response contains a list of payment instructions matching these criteria.

To **find the r-operation associated to a customer instruction** you can choose to:
- Retrieve a detailed list of these r-operations using [`GET /customer-instructions/{customerInstructionId}/payment-r-transactions`](https://api.skaleet.com/docs/api/bb69c3721fa9e-load-detailed-payment-transactions-associated-to-customer-instruction).
- Retrieve a minified list of all these r-operations (only essentials r-operations information) using [`GET /customer-instructions/{customerInstructionId}/payment-transactions`](https://api.skaleet.com/docs/api/468edac643d0c-load-minified-payment-transactions-associated-to-customer-instruction).

These customer instructions are then processed and if they need to be sent to an interbank network, they will be associated to an outward payment instruction (see above for the management of an outward payment instruction).

To **find the r-operation associated to a payment instruction** you can choose to:
- Retrieve a detailed list of these r-operations using [`GET /payment-instructions/{paymentInstructionId}/detailed-payment-r-transactions`](https://api.skaleet.com/docs/api/d695906dcca68-load-detailed-payment-r-transactions-associated-to-payment-instruction).
- Retrieve a minified list of all these r-operations (only essentials r-operations information) using [`GET /payment-instructions/{paymentInstructionId}/payment-r-transactions`](https://api.skaleet.com/docs/api/73363dbd35cef-load-minified-payment-r-transactions-associated-to-payment-instruction).

When the connector has submitted the payment instruction it receives a result indicating if the exchange was executed successfully or was refused.
These **execution results has to be transferred** to Skaleet :
- If the payment r-transaction was exchanged successfully, you can use [`POST /outward-payment-instructions/payment-r-transactions/{paymentRTransactionInternalId}/exchange`](https://api.skaleet.com/docs/api/89b6fa2973d5c-exchange-a-payment-r-transaction).
- If the payment r-transaction was refused, you can use [`POST /outward-payment-instructions/payment-r-transactions/{paymentRTransactionInternalId}/refuse`](https://api.skaleet.com/docs/api/c6136d2292a04-refuse-a-payment-r-transaction).