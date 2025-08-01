---
stoplight-id: y50zkrf12bxiv
---

# Virtual keyboard mechanism for client secret code management

Each time the client is required to authenticate with their secret code, you must ask for a so-called “virtual keyboard” to the server. 

Your application will need to call the `GET /keyboard` endpoint to get a keyboard and a keyboard identifier. The keyboard is an ordered list of 16 images:
* 10 of them represent digits (from 0 to 9),
* 6 of them are blank. 

You can give parameters for font, size and color to adapt the keyboard to your application design. 

From this list of images you will need to:
* construct and display a keyboard to the user, 
* save the position in the list of the images selected by the user,
* send the positions back to the server with the keyboard identifier in the endpoint that requires the secret code authentication.

The length of the secret code is available in the `GET /configuration` in the `pincode` field of the response. It gives the min and max length of the secret code. 

### Handling PINCODE input type

On some endpoints, you will have to handle some Inputs objects.

Inputs have types, especially the PINCODE type.

When you have to handle PINCODE input, you have to call the `GET /keyboard` endpoint to generate a new virtual keyboard and ID.

Then you will have to format the input returned value as following:

```
{
    "id": "<virtual keyboard id>",
    "value": [<array of position selected by user>]
}
```

Example:  
With: 
* `foobar` as input ID,
* `30cd1845-c427-4761-a848-adb3e1ab5108` as keyboard ID,
* and user selected positions 1, 13, 6 and 4

```
{
    "foobar": {
        "id": "30cd1845-c427-4761-a848-adb3e1ab5108",
        "value": [1,13,6,4]
    }
}
```
