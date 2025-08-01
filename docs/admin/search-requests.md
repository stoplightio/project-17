---
stoplight-id: amxuvfjkkur02
---

# Search requests

By default all search endpoints accept a search request in the request body.

Some HTTP clients cannot handle such queries when using the `GET` method. 

In this case, you can provide the search request through an URI parameter called `search`.

A search request is a JSON object, containing 3 attributes : `filter`, `orders`, `pager`

```json
{
  "filter" : {},
  "orders" : [],
  "pager" : {}
}
```

### Filter
A `filter` object can be provided to filter data according to a combination of criteria.
  
A filter object could be of 4 types:
* Criteria
```json
{
  "type" : "CRITERIA",
  "attribute" : "my_attributeName",
  "operator" : "=",
  "value" : 42
}
```

* AND / OR
```json
{
  "type" : "AND", # Could be "OR"
  "children" : [
    # Other filter objects
  ]
}
```

* NOT
```json
{
  "type" : "NOT",
  "child" : null # Other filter object
}
```

You can then combine filters as you wish.
The following example generate the following expression:

`my_attributeName = 42 AND my_otherAttributeName in [13, 37] AND NOT(my_thirdAttributeName starts with "Hello" OR my_thirdAttributeName ends with "World")`

```json
{
  "type" : "AND",
  "children" : [
      {
        "type" : "CRITERIA",
        "attribute" : "my_attributeName",
        "operator" : "=",
        "value" : 42
      },
      {
        "type" : "CRITERIA",
        "attribute" : "my_otherAttributeName",
        "operator" : "[]",
        "value" : [13, 37]
      },
      {
        "type": "NOT",
        "child" :
          {
            "type" : "OR",
            "children": [
              {
                  "type" : "CRITERIA",
                  "attribute" : "my_thirdAttributeName",
                  "operator" : "^",
                  "value" : "Hello"
              },
              {
                  "type" : "CRITERIA",
                  "attribute" : "my_thirdAttributeName",
                  "operator" : "$",
                  "value" : "World"
              }
            ]
          }
      }
  ]
}
```

##### Operators

Allowed operators are :

| Operator | Description | Note |
|---|---|---|
| = | Equals |  |
| > | Greater than |  |
| gte | Greater than or equals |  |
| < | Lower than |  |
| lte | Lower than or equals |  |
| neq | Not equals |  |
| null | Is null |  |
| !null | Is not null |  |
| [] | In | Provide an array of values |
| [\/] | Not in | Provide an array of values |
| bt | Is between | Provide an array of two values |
| * | Is like |  |
| ^ | Begins with |  |
| $ | Ends with |  |
| // | Regular expression |  |

### Order
An `order` can be provided to sort data returned by the server. 
It is a JSON object with 2 attributes : 
  * `attribute` : the attribute id to sort
  * `direction` : the sort direction : `ASC` or `DESC`

You can provide multiple orders in the search request

### Pager
A `pager` can be provided to paginate data returned by the server.
It is a JSON object with 2 attributes : 
  * `from` : the offset applied to data (starting from 0)
  * `size` : number of results returned by the server
