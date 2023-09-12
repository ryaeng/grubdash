# GrubDash

This is the GrubDash backend. The entire project is written in Node.js using Express. 

There are two Urls to be concerned with. /dishes and /orders. /dishes returns dishes that users may add to their order. 
/orders returns orders that have been placed by the users with the aformentioned dishes embedded.

**/dishes methods:**
- list
- create

**/:dishId methods:**
- read
- update

**/orders methods:**
- list
- create

**/:orderId methods:**
- delete
- read
- update

**/dishes object examples:**
```
{
    "data": {
        "id": "3c637d011d844ebab1205fef8a7e36ea",
        "name": "Broccoli and beetroot stir fry",
        "description": "Crunchy stir fry featuring fresh broccoli and beetroot",
        "price": 15,
        "image_url": "https://images.pexels.com/photos/4144234/pexels-photo-4144234.jpeg?h=530&w=350"
    }
}
```

**/orders object example:**
```
{
    "data": {
        "deliverTo": "72 Park Dr SW, Apt A, Concord, NC 28027",
        "mobileNumber": "(980) 521-2297",
        "status": "test",
        "dishes": [
            {
                "id": "90c3d873684bf381dfab29034b5bba73",
                "name": "Falafel and tahini bagel",
                "description": "A warm bagel filled with falafel and tahini",
                "image_url": "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
                "price": 200,
                "quantity": 1
            }
        ]
    }
}
```
