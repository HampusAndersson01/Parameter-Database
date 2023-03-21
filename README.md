# Development

### Run server in development mode

```bash
npm run dev
```


# Endpoints

<!-- router.get('/', controller.getParameters);
router.get('/:id', controller.getParameter);
router.post('/', controller.createParameters);
router.put('/:id', controller.updateParameter);
router.delete('/:id', controller.deleteParameter); -->

## Parameters

### /parameters/ - GET - get all parameters

### /parameters/:id - GET - get parameter by id

### /parameters/ - POST - create parameter(s)

```json
[
    {
        "name": "Test rig",
        "description": "Test rigfamily parameter",
        "datatype": "str",
        "modified_date": "2023-01-28",
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
        "modified_date": "2023-01-28",
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
]
```

### /parameters/:id - PUT - update parameter by id

```json
{
  "name": "065X",
  "description": "OFY+ flag from PDP-rigs = 1 when Vol_Oil",
  "datatype": "f",
  "decimals": 1,
  "min": -3,
  "max": 3,
  "creation_date": null,
  "modified_date": null,
  "created_by": null,
  "modified_by": null,
  "comment": null,
  "unit": {
    "name": "-",
    "description": ""
  },
  "rigfamily": {
    "name": "GOT_LP;GOT_FP",
    "description": "Gothenburg Endurance test cells;Gothenburg Function test cells"
  },
  "images": {
    "name": "lorem picsum",
    "description": null,
    "url": "https://picsum.photos/400"
  }
}
```

### /parameters/:id - DELETE - delete parameter by id

## Rigfamilies

### /rigfamilies/ - GET - get all rigfamilies
