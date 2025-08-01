---
stoplight-id: rxqw2bkrwa0pg
---

# Building your backend

You should develop a backend for your web and mobile clients to access platform features. Your backend system will manage both communication to the Distributor API and internal operations such as user authentication, and custom security features like SMS validation (once the SMS is confirmed you can send the request to platform to transfer money).

You should also store a copy of certain data relating to platform to decrease latency and increase resiliency when users review previous transfers they made or recipients they sent funds to. The extent of what you store will depend on your integration.