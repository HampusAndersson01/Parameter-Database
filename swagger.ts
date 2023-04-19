const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parameter Database API",
      version: "1.0.0",
      description: "API for the Parameter Database",
    },
    components: {
      schemas: {
        Parameter: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "Unique identifier of the parameter.",
              },
              name: {
                type: "string",
                description: "Name of the parameter.",
              },
              description: {
                type: "string",
                description: "Description of the parameter.",
              },
              datatype: {
                type: "string",
                description: "Data type of the parameter.",
              },
              decimals: {
                type: "integer",
                description: "Number of decimal places for the parameter.",
              },
              min: {
                type: "number",
                description: "Minimum value for the parameter.",
              },
              max: {
                type: "number",
                description: "Maximum value for the parameter.",
              },
              creation_date: {
                type: "string",
                format: "date-time",
                description: "Date and time the parameter was created.",
              },
              modified_date: {
                type: "string",
                format: "date-time",
                description: "Date and time the parameter was last modified.",
              },
              created_by: {
                type: "string",
                description: "Username of the user who created the parameter.",
              },
              modified_by: {
                type: "string",
                description:
                  "Username of the user who last modified the parameter.",
              },
              comment: {
                type: "string",
                description:
                  "Additional comments or notes about the parameter.",
              },
              unit_name: {
                type: "string",
                description: "Name of the unit used for the parameter.",
              },
              unit_description: {
                type: "string",
                description: "Description of the unit used for the parameter.",
              },
              rigfamily_name: {
                type: "string",
                description:
                  "Name of the rig family where the parameter is used.",
              },
              rigfamily_description: {
                type: "string",
                description:
                  "Description of the rig family where the parameter is used.",
              },
              image_name: {
                type: "string",
                description: "Name of an associated image for the parameter.",
              },
              image_description: {
                type: "string",
                description:
                  "Description of the associated image for the parameter.",
              },
              image_urls: {
                type: "string",
                description:
                  "URL(s) of the associated image(s) for the parameter.",
              },
              possible_values: {
                type: "string",
                description: "Possible values for the parameter.",
              },
              possible_values_description: {
                type: "string",
                description:
                  "Description of the possible values for the parameter.",
              },
            },
            required: [
              "id",
              "name",
              "datatype",
              "decimals",
              "min",
              "max",
              "modified_date",
              "modified_by",
              "unit_name",
              "rigfamily_name",
            ],
          },
        },
        CreateParameter: {
          type: "object",
          properties: {
            name: { type: "string", description: "The name of the parameter." },
            description: {
              type: "string",
              description: "A description of the parameter.",
            },
            datatype: {
              type: "string",
              description: "The data type of the parameter.",
            },
            comment: {
              type: "string",
              description: "A comment about the parameter.",
            },
            min: {
              type: "number",
              description: "The minimum value of the parameter.",
            },
            max: {
              type: "number",
              description: "The maximum value of the parameter.",
            },
            decimals: {
              type: "number",
              description: "The number of decimals of the parameter.",
            },
            unit: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name of the unit of measurement for the parameter.",
                },
                description: {
                  type: "string",
                  description:
                    "A description of the unit of measurement for the parameter.",
                },
              },
            },
            rigfamily: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the rig family for the parameter.",
                },
                description: {
                  type: "string",
                  description:
                    "A description of the rig family for the parameter.",
                },
              },
            },
            images: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the image(s) for the parameter.",
                },
                url: {
                  type: "string",
                  description: "The URL(s) of the image(s) for the parameter.",
                },
              },
            },
            possible_values: {
              type: "object",
              properties: {
                value: {
                  type: "string",
                  description: "The possible values for the parameter.",
                },
                description: {
                  type: "string",
                  description:
                    "A description of the possible values for the parameter.",
                },
              },
            },
          },
          required: [
            "name",
            "description",
            "datatype",
            "modified_date",
            "min",
            "max",
            "decimals",
            "unit",
            "rigfamily",
            "images",
            "possible_values",
          ],
        },
        UpdateParameter: {
          type: "object",
          properties: {
            name: { type: "string", description: "The name of the parameter." },
            description: {
              type: "string",
              description: "A description of the parameter.",
            },
            datatype: {
              type: "string",
              description: "The data type of the parameter.",
            },
            decimals: {
              type: "number",
              description: "The number of decimals of the parameter.",
            },
            min: {
              type: "number",
              description: "The minimum value of the parameter.",
            },
            max: {
              type: "number",
              description: "The maximum value of the parameter.",
            },
            creation_date: {
              type: "string",
              format: "date",
              description: "The date when the parameter was created.",
            },
            modified_date: {
              type: "string",
              format: "date",
              description: "The date when the parameter was last modified.",
            },
            created_by: {
              type: "string",
              description: "The name of the user who created the parameter.",
            },
            modified_by: {
              type: "string",
              description:
                "The name of the user who last modified the parameter.",
            },
            comment: {
              type: "string",
              description: "A comment about the parameter.",
            },
            unit: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name of the unit of measurement for the parameter.",
                },
                description: {
                  type: "string",
                  description:
                    "A description of the unit of measurement for the parameter.",
                },
              },
            },
            rigfamily: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name of the rig families for the parameter. Seperated by semicolon (;).",
                },
                description: {
                  type: "string",
                  description:
                    "A description of the rig families for the parameter. Seperated by semicolon (;).",
                },
              },
            },
            images: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name of the image(s) for the parameter. Seperated by semicolon (;).",
                },
                description: {
                  type: "string",
                  description:
                    "A description of the image(s) for the parameter. Seperated by semicolon (;).",
                },
                url: {
                  type: "string",
                  description:
                    "The URL(s) of the image(s) for the parameter. Seperated by semicolon (;).",
                },
              },
            },
            possible_values: {
              type: "object",
              properties: {
                value: {
                  type: "string",
                  description:
                    "The possible values for the parameter. Seperated by semicolon (;).",
                },
                description: {
                  type: "string",
                  description:
                    "A description of the possible values for the parameter. Seperated by semicolon (;).",
                },
              },
            },
          },
        },
        Unit: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "Unique identifier of the unit.",
              },
              name: {
                type: "string",
                description: "Name of the unit.",
              },
              description: {
                type: "string",
                description: "Description of the unit.",
              },
            },
            required: ["id", "name", "description"],
          },
        },
        RigFamily: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "Unique identifier of the rig family.",
              },
              name: {
                type: "string",
                description: "Name of the rig family.",
              },
              description: {
                type: "string",
                description: "Description of the rig family.",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
