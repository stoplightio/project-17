---
stoplight-id: cpjmhmhud9xvl
---

# Advices concerning the API client User-Agent

API client is free to use any format of User-Agent.

However, Skom It Bank master saves the API client User-Agent on each request. Even if the history of this value is not recorded (only the value of the last request), it could be useful to respect the following rules to show the maximum amount of data in TagPay back-office interface (WebAdmin).

In order to do so, the expected format of User-Agent is:

`${application name and version}; ${not empty value}; (${manufacturer}; ${device model}; ${OS name}; ${OS version})`

*Example*:  
`MWallet / 20.05(1140); com.package.installer; (motorola; MotoG3; Android; 6.0.1)`

**Attention**: values must not contain any semi-colon. The User-Agent detection is based on semi-colon separators.

Additionally, the User-Agent leads to Device Profile detection. Here is the table of expected value and Profile detection result associated:

| Searched values | Detected profile result |
| --- | --- |
| `Dalvik ; Android ; okhttp` | Android |
| `iPhone ; Darwin` | iOS |

The detection occurs on the whole User-Agent value and is case-insensitive.  
If none of these values are detected, the Profile used is "Custom".
