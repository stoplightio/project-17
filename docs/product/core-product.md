---
stoplight-id: iwfi54xur0p8y
tags: [core, product]
---

# Core Configurations

The core assets essential for a fully functional banking platform such as Skaleet, encompass a diverse range of inventories and repositories that necessitate meticulous configuration. These assets are the backbone of the platform, ensuring seamless operations and delivering value to both financial institutions and their customers. 

Among these core assets are the product directory, essential information about financial products and services; the payment execution engine, responsible for processing transactions securely and efficiently; documents and templates for regulatory compliance and customer communication; API management tools for seamless integration with external systems; job scheduling capabilities for automated tasks; and customizable configurations tailored to meet specific banking requirements. 

# Documents Configuration
Document configuration in a Skaleet platform plays a crucial role in ensuring regulatory compliance, data accuracy, and efficient customer communication. By configuring document management effectively, skaleet can enhance operational efficiency, reduce errors, and maintain a high level of transparency and compliance with regulatory standards.
refer to 🔒[Document Configuration](https://tagpay.atlassian.net/wiki/spaces/BAB/pages/3046408530/Document+Configuration#Introduction-to-Document-Configuration).

## Document Types
There are several types of documents on the platform that can be configured so that they are required for a user (natural or legal person) to open an account. These types of documents are predefined and allow you to qualify prospects or customers.

KYC documents can be created and configured, in this case they are called customised as opposed to the predefined documents of the platform which are present initially without manual intervention.
### Create a document type
Configure a new document type	POST	/document-types:
### Search a document type
Search configured document types	GET	/document-types:
Get document type	GET	/document-types/ `(https://api.skaleet.com/docs/api/oly49dc45o7zu-get-document-type)`
### Update a document type
Modify an existing document type	PATCH	/document-types/`(https://api.skaleet.com/docs/api/to8cwl4ugr3ne-modify-an-existing-document-type)`

## Document Packages
Document types must be grouped in batches to be associated with a KYC profile. These batches are called document packages.

### Create a document package
Configure a new document package	POST	/document-packages:
### Search a document package
Search configured document packages	GET	/document-packages:
Get one document package	GET	/document-packages/{packageCode}
### Configure document types associted to document packages
Associate a document type to a package	POST	/document-packages/{packageCode}/types
Remove association between document type and a package	DELETE	/document-packages/{packageCode}/types/{typeCode}
Increase order of association between document type and a package	PATCH	/document-packages/{packageCode}/types/{typeCode}/increase
Decrease order of association between document type and a package	PATCH	/document-packages/{packageCode}/types/{typeCode}/decrease
### Update a document package
Modify an existing document package	PUT	/document-packages/{packageCode}

## Users Documents

### Add a document to a user
Send a document	POST	/documents:
### Retrieve users document
Retrieve a document	GET	/documents/{documentId}
Retrieve a document's content	GET	/documents/{documentId}/content
Retrieve a document''s preview content, with a max width of 200px'	GET	/documents/{documentId}/preview
List user's documents	GET	/identities/{identityId}/documents
