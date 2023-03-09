# Endpoints

<!-- router.get('/', controller.getParameters);
router.get('/:id', controller.getParameter);
router.post('/', controller.createParameters);
router.put('/:id', controller.updateParameter);
router.delete('/:id', controller.deleteParameter); -->

### /parameters/ - GET - get all parameters 

### /parameters/:id - GET - get parameter by id

### /parameters/ - POST - create parameter(s)

```json

{
    "name": "Test rig",
    "description": "Test rigfamily parameter",
    "datatype": "str",
    "modified_date": "2023-01-28T22:00:00.000Z",
    "comment": "Test Comment",
    "min": 0,
    "max": 9999,
    "decimals": 2,
    "unit": {
        "name": "%"
    },
    "rigfamily": {
        "name": "GOT_FP;GOT_LP"
    },
    "images": {
        "name": "lorem picsum;lorem picsum",
        "url": "https://picsum.photos/200;https://picsum.photos/200/300"
    }
},
{
    "name": "Test",
    "description": "Test parameter",
    "datatype": "str",
    "modified_date": "2023-01-28T22:00:00.000Z",
    "comment": "Test Comment",
    "unit": {
        "name": "°"
    },
    "rigfamily": {
        "name": "GOT_FP"
    },
    "images": {
        "name": "lorem picsum;lorem picsum",
        "url": "https://picsum.photos/200;https://picsum.photos/200/300"
    }
}
```


### /parameters/:id - PUT - update parameter by id | ***TODO***

### /parameters/:id - DELETE - delete parameter by id | ***TODO***




