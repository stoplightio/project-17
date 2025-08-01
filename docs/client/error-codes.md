---
stoplight-id: 9xddxaqdjxvoy
---

# API error codes signification

The Client API uses consistent error representation across all the endpoints.  
Here is a list of Common errors that could lead an API client to suggest actions to the final user.

| API Error code | Description | Endpoints that could return this error |
|:---:|---|---|
| 20029 | The client account is blocked. | Transaction endpoints and all endpoint that verify a secret code |
| 30222 | Bad client secret code, [N] attempts left. [N] is 1 or 2  | All endpoints that accept a secret code |
| 30229 | Account blocked because of 3 secret code wrong attempts | All endpoints that accept a secret code |
| 30242 | Client secret code must be changed | All endpoints that accept Client secret code in parameters (except secret code update) |
| 31013 | Passcode error, 3 remaining trials. Returned when the virtual keyboard is not valid (bad pincode id). | All endpoints that accept a secret code |
| 30315 | Unknown client recipient | All endpoints that accept a RecipientId string in request |
| 30234 | Client already exists and cannot be created | Enrollment endpoints |
