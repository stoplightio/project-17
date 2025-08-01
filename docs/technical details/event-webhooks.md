---
stoplight-id: fszdsklt9qspj
---
# Events and Webhooks

The Skaleet platform is capable of triggering HTTPS requests based on events that occur during its operation.


Use webhooks to receive notifications about events occurring within an account managed by our platform. Webhooks are particularly beneficial for being informed about asynchronous events, such as disputed charges or received credit transfers, which do not result from direct API requests. (For further information on webhooks, please refer to the relevant [Wikipedia page](https://en.wikipedia.org/wiki/Webhook)). 

Webhooks are triggered by actions or changes in a system, and sent to user-specified endpoints (URLs). Each webhook is associated with a specific event, and provides contextual information on the action performed or change made. You will find below a list of the webhooks available, with their Descriptions and examples of associated data. Using Skaleet APIs, you can then retrieve the event that triggered the webhook.

To subscribe to these notifications, your application can provide a webhook URL (e.g., https://api.mywebsite.com/webhook). Upon the occurrence of an event, the API generates an Event object and sends it to the specified webhook.

Examples of events include:

- Account changes (e.g., KYC validation, account blockage, or reaching a limit)
- Transactions (e.g., pending, settled, or refused transactions), such as received Incoming SCTs or refused Outgoing SCTs.

>**Important**: To confirm the successful receipt of a webhook, your endpoint must return a `204 No Content` HTTP status code. If any events are missed, you can make inquiries at the `GET /events` to reconcile your data.

You can find available webhooks technical specification here: [Webhooks Reference](webhooks.yml)