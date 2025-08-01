---
stoplight-id: kcq4baa72d5gy
---

# Data Types Representations

To use the Skaleet APIs, it is necessary to respect the requested formats for the following type of data (unless explicitly indicated otherwise in the API documentation).


| Data type | Description |
| ---------|----------|
| **Country identification** | Countries are designated by their ISO 3166-1 alpha-2 codes (DE, FR, US, GB...).<br />Read more at https://fr.wikipedia.org/wiki/ISO_3166-2 |
| **Language** | Languages are modelized with IETF Language Tags (e.g. fr_FR, en_US, en_GB...).<br />_Notice:_ The `Accept-Language` HTTP header use dash instead of underscore in the language tags (e.g. fr-fr instead of fr_FR). |
| **Currency** | Currencies are designated by their ISO 4217 3-letters codes (EUR, USD, GBP...).<br />Read more at https://fr.wikipedia.org/wiki/ISO_4217 |
| **Amount modelization** | All API requests require amounts to be specified in a currency's smallest denomination. For instance, to process a charge of $1 USD, the amount should be entered as 100 (which represents 100 cents in USD). For currencies that do not use decimal places, amounts should still be input as an integer, but there's no need to multiply by 100. For example, to charge 100 JPY, you would directly input an amount of 100. |
| **Phone**| E.164 format [country code][area code][local phone number] no plus sign (e.g. 33612345678).<br />Read more at https://en.wikipedia.org/wiki/E.164 |
| **Date and time** | Date and time are formatted according to [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) (also known as Atom date-time format) (e.g. 2018-11-19T17:13:38Z). Time part can be omitted if only a date is needed. |
| **Documents** | Documents (files) are encoded in base64 format. You can download or upload a document as a base64 string and decode to its original file format (png, pdf, etc.) |

