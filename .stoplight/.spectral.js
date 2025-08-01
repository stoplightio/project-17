import { oas2, oas3_1, extractDraftVersion, oas3_0, oas3 } from '@stoplight/spectral-formats';
import { schema, unreferencedReusableObject, truthy, pattern, alphabetical, length, undefined as undefined$1, xor } from '@stoplight/spectral-functions';
import * as spectralCore from '@stoplight/spectral-core';
import { createRulesetFunction } from '@stoplight/spectral-core';
import { isPlainObject, pointerToPath } from 'https://cdn.skypack.dev/@stoplight/json';
import traverse from 'https://cdn.skypack.dev/json-schema-traverse';
import { printValue } from '@stoplight/spectral-runtime';

function isObject$9(value) {
  return value !== null && typeof value === 'object';
}

const oasDiscriminator = (schema, _opts, { path }) => {
  /**
   * This function verifies:
   *
   * 1. The discriminator property name is defined at this schema.
   * 2. The discriminator property is in the required property list.
   */

  if (!isObject$9(schema)) return;

  if (typeof schema.discriminator !== 'string') return;

  const discriminatorName = schema.discriminator;

  const results = [];

  if (!isObject$9(schema.properties) || !Object.keys(schema.properties).some(k => k === discriminatorName)) {
    results.push({
      message: `The discriminator property must be defined in this schema.`,
      path: [...path, 'properties'],
    });
  }

  if (!Array.isArray(schema.required) || !schema.required.some(n => n === discriminatorName)) {
    results.push({
      message: `The discriminator property must be in the required property list.`,
      path: [...path, 'required'],
    });
  }

  return results;
};

const OAS_2 = {
  title: 'A JSON Schema for Swagger 2.0 API.',
  $id: 'http://swagger.io/v2/schema.json#',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['swagger', 'info', 'paths'],
  additionalProperties: false,
  patternProperties: {
    '^x-': {
      $ref: '#/definitions/vendorExtension',
    },
  },
  properties: {
    swagger: {
      type: 'string',
      enum: ['2.0'],
      description: 'The Swagger version of this document.',
    },
    info: {
      $ref: '#/definitions/info',
    },
    host: {
      type: 'string',
      pattern: '^[^{}/ :\\\\]+(?::\\d+)?$',
      description: "The host (name or ip) of the API. Example: 'swagger.io'",
    },
    basePath: {
      type: 'string',
      pattern: '^/',
      description: "The base path to the API. Example: '/api'.",
    },
    schemes: {
      $ref: '#/definitions/schemesList',
    },
    consumes: {
      description: 'A list of MIME types accepted by the API.',
      allOf: [
        {
          $ref: '#/definitions/mediaTypeList',
        },
      ],
    },
    produces: {
      description: 'A list of MIME types the API can produce.',
      allOf: [
        {
          $ref: '#/definitions/mediaTypeList',
        },
      ],
    },
    paths: {
      $ref: '#/definitions/paths',
    },
    definitions: {
      $ref: '#/definitions/definitions',
    },
    parameters: {
      $ref: '#/definitions/parameterDefinitions',
    },
    responses: {
      $ref: '#/definitions/responseDefinitions',
    },
    security: {
      $ref: '#/definitions/security',
    },
    securityDefinitions: {
      $ref: '#/definitions/securityDefinitions',
    },
    tags: {
      type: 'array',
      items: {
        $ref: '#/definitions/tag',
      },
      uniqueItems: true,
    },
    externalDocs: {
      $ref: '#/definitions/externalDocs',
    },
  },
  definitions: {
    info: {
      type: 'object',
      description: 'General information about the API.',
      required: ['version', 'title'],
      additionalProperties: false,
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      properties: {
        title: {
          type: 'string',
          description: 'A unique and precise title of the API.',
        },
        version: {
          type: 'string',
          description: 'A semantic version number of the API.',
        },
        description: {
          type: 'string',
          description:
            'A longer description of the API. Should be different from the title.  GitHub Flavored Markdown is allowed.',
        },
        termsOfService: {
          type: 'string',
          description: 'The terms of service for the API.',
        },
        contact: {
          $ref: '#/definitions/contact',
        },
        license: {
          $ref: '#/definitions/license',
        },
      },
    },
    contact: {
      type: 'object',
      description: 'Contact information for the owners of the API.',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
          description: 'The identifying name of the contact person/organization.',
        },
        url: {
          type: 'string',
          description: 'The URL pointing to the contact information.',
          format: 'uri',
        },
        email: {
          type: 'string',
          description: 'The email address of the contact person/organization.',
          format: 'email',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    license: {
      type: 'object',
      required: ['name'],
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
          description: "The name of the license type. It's encouraged to use an OSI compatible license.",
        },
        url: {
          type: 'string',
          description: 'The URL pointing to the license.',
          format: 'uri',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    paths: {
      type: 'object',
      description: "Relative paths to the individual endpoints. They must be relative to the 'basePath'.",
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
        '^/': {
          $ref: '#/definitions/pathItem',
        },
      },
      additionalProperties: false,
    },
    definitions: {
      type: 'object',
      additionalProperties: {
        $ref: '#/definitions/schema',
      },
      description: 'One or more JSON objects describing the schemas being consumed and produced by the API.',
    },
    parameterDefinitions: {
      type: 'object',
      additionalProperties: {
        $ref: '#/definitions/parameter',
      },
      description: 'One or more JSON representations for parameters',
    },
    responseDefinitions: {
      type: 'object',
      additionalProperties: {
        $ref: '#/definitions/response',
      },
      description: 'One or more JSON representations for responses',
    },
    externalDocs: {
      type: 'object',
      additionalProperties: false,
      description: 'information about external documentation',
      required: ['url'],
      properties: {
        description: {
          type: 'string',
        },
        url: {
          type: 'string',
          format: 'uri',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    examples: {
      type: 'object',
      additionalProperties: true,
    },
    mimeType: {
      type: 'string',
      description: 'The MIME type of the HTTP message.',
    },
    operation: {
      type: 'object',
      required: ['responses'],
      additionalProperties: false,
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      properties: {
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true,
        },
        summary: {
          type: 'string',
          description: 'A brief summary of the operation.',
        },
        description: {
          type: 'string',
          description: 'A longer description of the operation, GitHub Flavored Markdown is allowed.',
        },
        externalDocs: {
          $ref: '#/definitions/externalDocs',
        },
        operationId: {
          type: 'string',
          description: 'A unique identifier of the operation.',
        },
        produces: {
          description: 'A list of MIME types the API can produce.',
          allOf: [
            {
              $ref: '#/definitions/mediaTypeList',
            },
          ],
        },
        consumes: {
          description: 'A list of MIME types the API can consume.',
          allOf: [
            {
              $ref: '#/definitions/mediaTypeList',
            },
          ],
        },
        parameters: {
          $ref: '#/definitions/parametersList',
        },
        responses: {
          $ref: '#/definitions/responses',
        },
        schemes: {
          $ref: '#/definitions/schemesList',
        },
        deprecated: {
          type: 'boolean',
          default: false,
        },
        security: {
          $ref: '#/definitions/security',
        },
      },
    },
    pathItem: {
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      properties: {
        $ref: {
          type: 'string',
        },
        get: {
          $ref: '#/definitions/operation',
        },
        put: {
          $ref: '#/definitions/operation',
        },
        post: {
          $ref: '#/definitions/operation',
        },
        delete: {
          $ref: '#/definitions/operation',
        },
        options: {
          $ref: '#/definitions/operation',
        },
        head: {
          $ref: '#/definitions/operation',
        },
        patch: {
          $ref: '#/definitions/operation',
        },
        parameters: {
          $ref: '#/definitions/parametersList',
        },
      },
    },
    responses: {
      type: 'object',
      description: "Response objects names can either be any valid HTTP status code or 'default'.",
      minProperties: 1,
      additionalProperties: false,
      patternProperties: {
        '^([0-9]{3})$|^(default)$': {
          $ref: '#/definitions/responseValue',
        },
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      not: {
        type: 'object',
        additionalProperties: false,
        patternProperties: {
          '^x-': {
            $ref: '#/definitions/vendorExtension',
          },
        },
      },
    },
    responseValue: {
      oneOf: [
        {
          $ref: '#/definitions/response',
        },
        {
          $ref: '#/definitions/jsonReference',
        },
      ],
    },
    response: {
      type: 'object',
      required: ['description'],
      properties: {
        description: {
          type: 'string',
        },
        schema: {
          oneOf: [
            {
              $ref: '#/definitions/schema',
            },
            {
              $ref: '#/definitions/fileSchema',
            },
          ],
        },
        headers: {
          $ref: '#/definitions/headers',
        },
        examples: {
          $ref: '#/definitions/examples',
        },
      },
      additionalProperties: false,
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    headers: {
      type: 'object',
      additionalProperties: {
        $ref: '#/definitions/header',
      },
    },
    header: {
      type: 'object',
      additionalProperties: false,
      required: ['type'],
      properties: {
        type: {
          type: 'string',
          enum: ['string', 'number', 'integer', 'boolean', 'array'],
        },
        format: {
          type: 'string',
        },
        items: {
          $ref: '#/definitions/primitivesItems',
        },
        collectionFormat: {
          $ref: '#/definitions/collectionFormat',
        },
        default: {
          $ref: '#/definitions/default',
        },
        maximum: {
          $ref: '#/definitions/maximum',
        },
        exclusiveMaximum: {
          $ref: '#/definitions/exclusiveMaximum',
        },
        minimum: {
          $ref: '#/definitions/minimum',
        },
        exclusiveMinimum: {
          $ref: '#/definitions/exclusiveMinimum',
        },
        maxLength: {
          $ref: '#/definitions/maxLength',
        },
        minLength: {
          $ref: '#/definitions/minLength',
        },
        pattern: {
          $ref: '#/definitions/pattern',
        },
        maxItems: {
          $ref: '#/definitions/maxItems',
        },
        minItems: {
          $ref: '#/definitions/minItems',
        },
        uniqueItems: {
          $ref: '#/definitions/uniqueItems',
        },
        enum: {
          $ref: '#/definitions/enum',
        },
        multipleOf: {
          $ref: '#/definitions/multipleOf',
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    vendorExtension: {
      description: 'Any property starting with x- is valid.',
      additionalProperties: true,
      additionalItems: true,
    },
    bodyParameter: {
      type: 'object',
      required: ['name', 'in', 'schema'],
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      properties: {
        description: {
          type: 'string',
          description:
            'A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.',
        },
        name: {
          type: 'string',
          description: 'The name of the parameter.',
        },
        in: {
          type: 'string',
          description: 'Determines the location of the parameter.',
          enum: ['body'],
        },
        required: {
          type: 'boolean',
          description: 'Determines whether or not this parameter is required or optional.',
          default: false,
        },
        schema: {
          $ref: '#/definitions/schema',
        },
      },
      additionalProperties: false,
    },
    headerParameterSubSchema: {
      additionalProperties: false,
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      properties: {
        required: {
          type: 'boolean',
          description: 'Determines whether or not this parameter is required or optional.',
          default: false,
        },
        in: {
          type: 'string',
          description: 'Determines the location of the parameter.',
          enum: ['header'],
        },
        description: {
          type: 'string',
          description:
            'A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.',
        },
        name: {
          type: 'string',
          description: 'The name of the parameter.',
        },
        type: {
          type: 'string',
          enum: ['string', 'number', 'boolean', 'integer', 'array'],
        },
        format: {
          type: 'string',
        },
        items: {
          $ref: '#/definitions/primitivesItems',
        },
        collectionFormat: {
          $ref: '#/definitions/collectionFormat',
        },
        default: {
          $ref: '#/definitions/default',
        },
        maximum: {
          $ref: '#/definitions/maximum',
        },
        exclusiveMaximum: {
          $ref: '#/definitions/exclusiveMaximum',
        },
        minimum: {
          $ref: '#/definitions/minimum',
        },
        exclusiveMinimum: {
          $ref: '#/definitions/exclusiveMinimum',
        },
        maxLength: {
          $ref: '#/definitions/maxLength',
        },
        minLength: {
          $ref: '#/definitions/minLength',
        },
        pattern: {
          $ref: '#/definitions/pattern',
        },
        maxItems: {
          $ref: '#/definitions/maxItems',
        },
        minItems: {
          $ref: '#/definitions/minItems',
        },
        uniqueItems: {
          $ref: '#/definitions/uniqueItems',
        },
        enum: {
          $ref: '#/definitions/enum',
        },
        multipleOf: {
          $ref: '#/definitions/multipleOf',
        },
      },
    },
    queryParameterSubSchema: {
      additionalProperties: false,
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      properties: {
        required: {
          type: 'boolean',
          description: 'Determines whether or not this parameter is required or optional.',
          default: false,
        },
        in: {
          type: 'string',
          description: 'Determines the location of the parameter.',
          enum: ['query'],
        },
        description: {
          type: 'string',
          description:
            'A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.',
        },
        name: {
          type: 'string',
          description: 'The name of the parameter.',
        },
        allowEmptyValue: {
          type: 'boolean',
          default: false,
          description: 'allows sending a parameter by name only or with an empty value.',
        },
        type: {
          type: 'string',
          enum: ['string', 'number', 'boolean', 'integer', 'array'],
        },
        format: {
          type: 'string',
        },
        items: {
          $ref: '#/definitions/primitivesItems',
        },
        collectionFormat: {
          $ref: '#/definitions/collectionFormatWithMulti',
        },
        default: {
          $ref: '#/definitions/default',
        },
        maximum: {
          $ref: '#/definitions/maximum',
        },
        exclusiveMaximum: {
          $ref: '#/definitions/exclusiveMaximum',
        },
        minimum: {
          $ref: '#/definitions/minimum',
        },
        exclusiveMinimum: {
          $ref: '#/definitions/exclusiveMinimum',
        },
        maxLength: {
          $ref: '#/definitions/maxLength',
        },
        minLength: {
          $ref: '#/definitions/minLength',
        },
        pattern: {
          $ref: '#/definitions/pattern',
        },
        maxItems: {
          $ref: '#/definitions/maxItems',
        },
        minItems: {
          $ref: '#/definitions/minItems',
        },
        uniqueItems: {
          $ref: '#/definitions/uniqueItems',
        },
        enum: {
          $ref: '#/definitions/enum',
        },
        multipleOf: {
          $ref: '#/definitions/multipleOf',
        },
      },
    },
    formDataParameterSubSchema: {
      additionalProperties: false,
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      properties: {
        required: {
          type: 'boolean',
          description: 'Determines whether or not this parameter is required or optional.',
          default: false,
        },
        in: {
          type: 'string',
          description: 'Determines the location of the parameter.',
          enum: ['formData'],
        },
        description: {
          type: 'string',
          description:
            'A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.',
        },
        name: {
          type: 'string',
          description: 'The name of the parameter.',
        },
        allowEmptyValue: {
          type: 'boolean',
          default: false,
          description: 'allows sending a parameter by name only or with an empty value.',
        },
        type: {
          type: 'string',
          enum: ['string', 'number', 'boolean', 'integer', 'array', 'file'],
        },
        format: {
          type: 'string',
        },
        items: {
          $ref: '#/definitions/primitivesItems',
        },
        collectionFormat: {
          $ref: '#/definitions/collectionFormatWithMulti',
        },
        default: {
          $ref: '#/definitions/default',
        },
        maximum: {
          $ref: '#/definitions/maximum',
        },
        exclusiveMaximum: {
          $ref: '#/definitions/exclusiveMaximum',
        },
        minimum: {
          $ref: '#/definitions/minimum',
        },
        exclusiveMinimum: {
          $ref: '#/definitions/exclusiveMinimum',
        },
        maxLength: {
          $ref: '#/definitions/maxLength',
        },
        minLength: {
          $ref: '#/definitions/minLength',
        },
        pattern: {
          $ref: '#/definitions/pattern',
        },
        maxItems: {
          $ref: '#/definitions/maxItems',
        },
        minItems: {
          $ref: '#/definitions/minItems',
        },
        uniqueItems: {
          $ref: '#/definitions/uniqueItems',
        },
        enum: {
          $ref: '#/definitions/enum',
        },
        multipleOf: {
          $ref: '#/definitions/multipleOf',
        },
      },
    },
    pathParameterSubSchema: {
      additionalProperties: false,
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      required: ['required'],
      properties: {
        required: {
          type: 'boolean',
          enum: [true],
          description: 'Determines whether or not this parameter is required or optional.',
        },
        in: {
          type: 'string',
          description: 'Determines the location of the parameter.',
          enum: ['path'],
        },
        description: {
          type: 'string',
          description:
            'A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.',
        },
        name: {
          type: 'string',
          description: 'The name of the parameter.',
        },
        type: {
          type: 'string',
          enum: ['string', 'number', 'boolean', 'integer', 'array'],
        },
        format: {
          type: 'string',
        },
        items: {
          $ref: '#/definitions/primitivesItems',
        },
        collectionFormat: {
          $ref: '#/definitions/collectionFormat',
        },
        default: {
          $ref: '#/definitions/default',
        },
        maximum: {
          $ref: '#/definitions/maximum',
        },
        exclusiveMaximum: {
          $ref: '#/definitions/exclusiveMaximum',
        },
        minimum: {
          $ref: '#/definitions/minimum',
        },
        exclusiveMinimum: {
          $ref: '#/definitions/exclusiveMinimum',
        },
        maxLength: {
          $ref: '#/definitions/maxLength',
        },
        minLength: {
          $ref: '#/definitions/minLength',
        },
        pattern: {
          $ref: '#/definitions/pattern',
        },
        maxItems: {
          $ref: '#/definitions/maxItems',
        },
        minItems: {
          $ref: '#/definitions/minItems',
        },
        uniqueItems: {
          $ref: '#/definitions/uniqueItems',
        },
        enum: {
          $ref: '#/definitions/enum',
        },
        multipleOf: {
          $ref: '#/definitions/multipleOf',
        },
      },
    },
    nonBodyParameter: {
      type: 'object',
      required: ['name', 'in', 'type'],
      oneOf: [
        {
          $ref: '#/definitions/headerParameterSubSchema',
        },
        {
          $ref: '#/definitions/formDataParameterSubSchema',
        },
        {
          $ref: '#/definitions/queryParameterSubSchema',
        },
        {
          $ref: '#/definitions/pathParameterSubSchema',
        },
      ],
    },
    parameter: {
      oneOf: [
        {
          $ref: '#/definitions/bodyParameter',
        },
        {
          $ref: '#/definitions/nonBodyParameter',
        },
      ],
    },
    schema: {
      type: 'object',
      description: 'A deterministic version of a JSON Schema object.',
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      properties: {
        $ref: {
          type: 'string',
        },
        format: {
          type: 'string',
        },
        title: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/title',
        },
        description: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/description',
        },
        default: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/default',
        },
        multipleOf: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/multipleOf',
        },
        maximum: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/maximum',
        },
        exclusiveMaximum: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/exclusiveMaximum',
        },
        minimum: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/minimum',
        },
        exclusiveMinimum: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/exclusiveMinimum',
        },
        maxLength: {
          $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveInteger',
        },
        minLength: {
          $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0',
        },
        pattern: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/pattern',
        },
        maxItems: {
          $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveInteger',
        },
        minItems: {
          $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0',
        },
        uniqueItems: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/uniqueItems',
        },
        maxProperties: {
          $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveInteger',
        },
        minProperties: {
          $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0',
        },
        required: {
          $ref: 'http://json-schema.org/draft-04/schema#/definitions/stringArray',
        },
        enum: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/enum',
        },
        additionalProperties: {
          anyOf: [
            {
              $ref: '#/definitions/schema',
            },
            {
              type: 'boolean',
            },
          ],
          default: {},
        },
        type: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/type',
        },
        items: {
          anyOf: [
            {
              $ref: '#/definitions/schema',
            },
            {
              type: 'array',
              minItems: 1,
              items: {
                $ref: '#/definitions/schema',
              },
            },
          ],
          default: {},
        },
        allOf: {
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/definitions/schema',
          },
        },
        oneOf: {
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/definitions/schema',
          },
        },
        anyOf: {
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/definitions/schema',
          },
        },
        properties: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/schema',
          },
          default: {},
        },
        discriminator: {
          type: 'string',
        },
        readOnly: {
          type: 'boolean',
          default: false,
        },
        xml: {
          $ref: '#/definitions/xml',
        },
        externalDocs: {
          $ref: '#/definitions/externalDocs',
        },
        example: {},
      },
      additionalProperties: false,
    },
    fileSchema: {
      type: 'object',
      description: 'A deterministic version of a JSON Schema object.',
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
      required: ['type'],
      properties: {
        format: {
          type: 'string',
        },
        title: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/title',
        },
        description: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/description',
        },
        default: {
          $ref: 'http://json-schema.org/draft-04/schema#/properties/default',
        },
        required: {
          $ref: 'http://json-schema.org/draft-04/schema#/definitions/stringArray',
        },
        type: {
          type: 'string',
          enum: ['file'],
        },
        readOnly: {
          type: 'boolean',
          default: false,
        },
        externalDocs: {
          $ref: '#/definitions/externalDocs',
        },
        example: {},
      },
      additionalProperties: false,
    },
    primitivesItems: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: {
          type: 'string',
          enum: ['string', 'number', 'integer', 'boolean', 'array'],
        },
        format: {
          type: 'string',
        },
        items: {
          $ref: '#/definitions/primitivesItems',
        },
        collectionFormat: {
          $ref: '#/definitions/collectionFormat',
        },
        default: {
          $ref: '#/definitions/default',
        },
        maximum: {
          $ref: '#/definitions/maximum',
        },
        exclusiveMaximum: {
          $ref: '#/definitions/exclusiveMaximum',
        },
        minimum: {
          $ref: '#/definitions/minimum',
        },
        exclusiveMinimum: {
          $ref: '#/definitions/exclusiveMinimum',
        },
        maxLength: {
          $ref: '#/definitions/maxLength',
        },
        minLength: {
          $ref: '#/definitions/minLength',
        },
        pattern: {
          $ref: '#/definitions/pattern',
        },
        maxItems: {
          $ref: '#/definitions/maxItems',
        },
        minItems: {
          $ref: '#/definitions/minItems',
        },
        uniqueItems: {
          $ref: '#/definitions/uniqueItems',
        },
        enum: {
          $ref: '#/definitions/enum',
        },
        multipleOf: {
          $ref: '#/definitions/multipleOf',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    security: {
      type: 'array',
      items: {
        $ref: '#/definitions/securityRequirement',
      },
      uniqueItems: true,
    },
    securityRequirement: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string',
        },
        uniqueItems: true,
      },
    },
    xml: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
        },
        namespace: {
          type: 'string',
        },
        prefix: {
          type: 'string',
        },
        attribute: {
          type: 'boolean',
          default: false,
        },
        wrapped: {
          type: 'boolean',
          default: false,
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    tag: {
      type: 'object',
      additionalProperties: false,
      required: ['name'],
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        externalDocs: {
          $ref: '#/definitions/externalDocs',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    securityDefinitions: {
      type: 'object',
      additionalProperties: {
        oneOf: [
          {
            $ref: '#/definitions/basicAuthenticationSecurity',
          },
          {
            $ref: '#/definitions/apiKeySecurity',
          },
          {
            $ref: '#/definitions/oauth2ImplicitSecurity',
          },
          {
            $ref: '#/definitions/oauth2PasswordSecurity',
          },
          {
            $ref: '#/definitions/oauth2ApplicationSecurity',
          },
          {
            $ref: '#/definitions/oauth2AccessCodeSecurity',
          },
        ],
      },
      errorMessage: {
        properties: {
          basic: 'Invalid basic authentication security definition',
          apiKey: 'Invalid apiKey authentication security definition',
          oauth2: 'Invalid oauth2 authentication security definition',
        },
        _: 'Invalid security securityDefinitions',
      },
    },
    basicAuthenticationSecurity: {
      type: 'object',
      additionalProperties: false,
      required: ['type'],
      properties: {
        type: {
          type: 'string',
          enum: ['basic'],
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    apiKeySecurity: {
      type: 'object',
      additionalProperties: false,
      required: ['type', 'name', 'in'],
      properties: {
        type: {
          type: 'string',
          enum: ['apiKey'],
        },
        name: {
          type: 'string',
        },
        in: {
          type: 'string',
          enum: ['header', 'query'],
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    oauth2ImplicitSecurity: {
      type: 'object',
      additionalProperties: false,
      required: ['type', 'flow', 'authorizationUrl', 'scopes'],
      properties: {
        type: {
          type: 'string',
          enum: ['oauth2'],
        },
        flow: {
          type: 'string',
          enum: ['implicit'],
        },
        scopes: {
          $ref: '#/definitions/oauth2Scopes',
        },
        authorizationUrl: {
          type: 'string',
          format: 'uri',
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    oauth2PasswordSecurity: {
      type: 'object',
      additionalProperties: false,
      required: ['type', 'flow', 'tokenUrl', 'scopes'],
      properties: {
        type: {
          type: 'string',
          enum: ['oauth2'],
        },
        flow: {
          type: 'string',
          enum: ['password'],
        },
        scopes: {
          $ref: '#/definitions/oauth2Scopes',
        },
        tokenUrl: {
          type: 'string',
          format: 'uri',
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    oauth2ApplicationSecurity: {
      type: 'object',
      additionalProperties: false,
      required: ['type', 'flow', 'tokenUrl', 'scopes'],
      properties: {
        type: {
          type: 'string',
          enum: ['oauth2'],
        },
        flow: {
          type: 'string',
          enum: ['application'],
        },
        scopes: {
          $ref: '#/definitions/oauth2Scopes',
        },
        tokenUrl: {
          type: 'string',
          format: 'uri',
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    oauth2AccessCodeSecurity: {
      type: 'object',
      additionalProperties: false,
      required: ['type', 'flow', 'authorizationUrl', 'tokenUrl', 'scopes'],
      properties: {
        type: {
          type: 'string',
          enum: ['oauth2'],
        },
        flow: {
          type: 'string',
          enum: ['accessCode'],
        },
        scopes: {
          $ref: '#/definitions/oauth2Scopes',
        },
        authorizationUrl: {
          type: 'string',
          format: 'uri',
        },
        tokenUrl: {
          type: 'string',
          format: 'uri',
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {
          $ref: '#/definitions/vendorExtension',
        },
      },
    },
    oauth2Scopes: {
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
    },
    mediaTypeList: {
      type: 'array',
      items: {
        $ref: '#/definitions/mimeType',
      },
      uniqueItems: true,
    },
    parametersList: {
      type: 'array',
      description: 'The parameters needed to send a valid API call.',
      additionalItems: false,
      items: {
        oneOf: [
          {
            $ref: '#/definitions/parameter',
          },
          {
            $ref: '#/definitions/jsonReference',
          },
        ],
      },
      uniqueItems: true,
    },
    schemesList: {
      type: 'array',
      description: 'The transfer protocol of the API.',
      items: {
        type: 'string',
        enum: ['http', 'https', 'ws', 'wss'],
      },
      uniqueItems: true,
    },
    collectionFormat: {
      type: 'string',
      enum: ['csv', 'ssv', 'tsv', 'pipes'],
      default: 'csv',
    },
    collectionFormatWithMulti: {
      type: 'string',
      enum: ['csv', 'ssv', 'tsv', 'pipes', 'multi'],
      default: 'csv',
    },
    title: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/title',
    },
    description: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/description',
    },
    default: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/default',
    },
    multipleOf: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    maximum: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/maximum',
    },
    exclusiveMaximum: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/exclusiveMaximum',
    },
    minimum: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/minimum',
    },
    exclusiveMinimum: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/exclusiveMinimum',
    },
    maxLength: {
      $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveInteger',
    },
    minLength: {
      $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0',
    },
    pattern: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/pattern',
    },
    maxItems: {
      $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveInteger',
    },
    minItems: {
      $ref: 'http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0',
    },
    uniqueItems: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/uniqueItems',
    },
    enum: {
      $ref: 'http://json-schema.org/draft-04/schema#/properties/enum',
    },
    jsonReference: {
      type: 'object',
      required: ['$ref'],
      additionalProperties: false,
      properties: {
        $ref: {
          type: 'string',
        },
      },
    },
  },
};

const OAS_3 = {
  $id: 'https://spec.openapis.org/oas/3.0/schema/2019-04-02',
  $schema: 'http://json-schema.org/draft-07/schema#',
  description: 'Validation schema for OpenAPI Specification 3.0.X.',
  type: 'object',
  required: ['openapi', 'info', 'paths'],
  properties: {
    openapi: {
      type: 'string',
      pattern: '^3\\.0\\.\\d(-.+)?$',
    },
    info: {
      $ref: '#/definitions/Info',
    },
    externalDocs: {
      $ref: '#/definitions/ExternalDocumentation',
    },
    servers: {
      type: 'array',
      items: {
        $ref: '#/definitions/Server',
      },
    },
    security: {
      type: 'array',
      items: {
        $ref: '#/definitions/SecurityRequirement',
      },
    },
    tags: {
      type: 'array',
      items: {
        $ref: '#/definitions/Tag',
      },
      uniqueItems: true,
    },
    paths: {
      $ref: '#/definitions/Paths',
    },
    components: {
      $ref: '#/definitions/Components',
    },
  },
  patternProperties: {
    '^x-': {},
  },
  additionalProperties: false,
  definitions: {
    Reference: {
      type: 'object',
      required: ['$ref'],
      patternProperties: {
        '^\\$ref$': {
          type: 'string',
          format: 'uri-reference',
        },
      },
    },
    Info: {
      type: 'object',
      required: ['title', 'version'],
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        termsOfService: {
          type: 'string',
          format: 'uri-reference',
        },
        contact: {
          $ref: '#/definitions/Contact',
        },
        license: {
          $ref: '#/definitions/License',
        },
        version: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Contact: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        url: {
          type: 'string',
          format: 'uri-reference',
        },
        email: {
          type: 'string',
          format: 'email',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    License: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
        },
        url: {
          type: 'string',
          format: 'uri-reference',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Server: {
      type: 'object',
      required: ['url'],
      properties: {
        url: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        variables: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/ServerVariable',
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    ServerVariable: {
      type: 'object',
      required: ['default'],
      properties: {
        enum: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        default: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Components: {
      type: 'object',
      properties: {
        schemas: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Schema',
                },
                {
                  $ref: '#/definitions/Reference',
                },
              ],
            },
          },
        },
        responses: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Reference',
                },
                {
                  $ref: '#/definitions/Response',
                },
              ],
            },
          },
        },
        parameters: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Reference',
                },
                {
                  $ref: '#/definitions/Parameter',
                },
              ],
            },
          },
        },
        examples: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Reference',
                },
                {
                  $ref: '#/definitions/Example',
                },
              ],
            },
          },
        },
        requestBodies: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Reference',
                },
                {
                  $ref: '#/definitions/RequestBody',
                },
              ],
            },
          },
        },
        headers: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Reference',
                },
                {
                  $ref: '#/definitions/Header',
                },
              ],
            },
          },
        },
        securitySchemes: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Reference',
                },
                {
                  $ref: '#/definitions/SecurityScheme',
                },
              ],
            },
          },
        },
        links: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Reference',
                },
                {
                  $ref: '#/definitions/Link',
                },
              ],
            },
          },
        },
        callbacks: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z0-9\\.\\-_]+$': {
              oneOf: [
                {
                  $ref: '#/definitions/Reference',
                },
                {
                  $ref: '#/definitions/Callback',
                },
              ],
            },
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        multipleOf: {
          type: 'number',
          exclusiveMinimum: 0,
        },
        maximum: {
          type: 'number',
        },
        exclusiveMaximum: {
          type: 'boolean',
          default: false,
        },
        minimum: {
          type: 'number',
        },
        exclusiveMinimum: {
          type: 'boolean',
          default: false,
        },
        maxLength: {
          type: 'integer',
          minimum: 0,
        },
        minLength: {
          type: 'integer',
          minimum: 0,
          default: 0,
        },
        pattern: {
          type: 'string',
          format: 'regex',
        },
        maxItems: {
          type: 'integer',
          minimum: 0,
        },
        minItems: {
          type: 'integer',
          minimum: 0,
          default: 0,
        },
        uniqueItems: {
          type: 'boolean',
          default: false,
        },
        maxProperties: {
          type: 'integer',
          minimum: 0,
        },
        minProperties: {
          type: 'integer',
          minimum: 0,
          default: 0,
        },
        required: {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
          uniqueItems: true,
        },
        enum: {
          type: 'array',
          items: {},
          minItems: 1,
          uniqueItems: false,
        },
        type: {
          type: 'string',
          enum: ['array', 'boolean', 'integer', 'number', 'object', 'string'],
        },
        not: {
          oneOf: [
            {
              $ref: '#/definitions/Schema',
            },
            {
              $ref: '#/definitions/Reference',
            },
          ],
        },
        allOf: {
          type: 'array',
          items: {
            oneOf: [
              {
                $ref: '#/definitions/Schema',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
        oneOf: {
          type: 'array',
          items: {
            oneOf: [
              {
                $ref: '#/definitions/Schema',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
        anyOf: {
          type: 'array',
          items: {
            oneOf: [
              {
                $ref: '#/definitions/Schema',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
        items: {
          oneOf: [
            {
              $ref: '#/definitions/Schema',
            },
            {
              $ref: '#/definitions/Reference',
            },
          ],
        },
        properties: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              {
                $ref: '#/definitions/Schema',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
        additionalProperties: {
          oneOf: [
            {
              $ref: '#/definitions/Schema',
            },
            {
              $ref: '#/definitions/Reference',
            },
            {
              type: 'boolean',
            },
          ],
          default: true,
        },
        description: {
          type: 'string',
        },
        format: {
          type: 'string',
        },
        default: {},
        nullable: {
          type: 'boolean',
          default: false,
        },
        discriminator: {
          $ref: '#/definitions/Discriminator',
        },
        readOnly: {
          type: 'boolean',
          default: false,
        },
        writeOnly: {
          type: 'boolean',
          default: false,
        },
        example: {},
        externalDocs: {
          $ref: '#/definitions/ExternalDocumentation',
        },
        deprecated: {
          type: 'boolean',
          default: false,
        },
        xml: {
          $ref: '#/definitions/XML',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Discriminator: {
      type: 'object',
      required: ['propertyName'],
      properties: {
        propertyName: {
          type: 'string',
        },
        mapping: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      },
    },
    XML: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        namespace: {
          type: 'string',
          format: 'uri',
        },
        prefix: {
          type: 'string',
        },
        attribute: {
          type: 'boolean',
          default: false,
        },
        wrapped: {
          type: 'boolean',
          default: false,
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Response: {
      type: 'object',
      required: ['description'],
      properties: {
        description: {
          type: 'string',
        },
        headers: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              {
                $ref: '#/definitions/Header',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
        content: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/MediaType',
          },
        },
        links: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              {
                $ref: '#/definitions/Link',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    MediaType: {
      type: 'object',
      properties: {
        schema: {
          oneOf: [
            {
              $ref: '#/definitions/Schema',
            },
            {
              $ref: '#/definitions/Reference',
            },
          ],
        },
        example: {},
        examples: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              {
                $ref: '#/definitions/Example',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
        encoding: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/Encoding',
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
      allOf: [
        {
          $ref: '#/definitions/ExampleXORExamples',
        },
      ],
    },
    Example: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        value: {},
        externalValue: {
          type: 'string',
          format: 'uri-reference',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Header: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
        },
        required: {
          type: 'boolean',
          default: false,
        },
        deprecated: {
          type: 'boolean',
          default: false,
        },
        allowEmptyValue: {
          type: 'boolean',
          default: false,
        },
        style: {
          type: 'string',
          enum: ['simple'],
          default: 'simple',
        },
        explode: {
          type: 'boolean',
        },
        allowReserved: {
          type: 'boolean',
          default: false,
        },
        schema: {
          oneOf: [
            {
              $ref: '#/definitions/Schema',
            },
            {
              $ref: '#/definitions/Reference',
            },
          ],
        },
        content: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/MediaType',
          },
          minProperties: 1,
          maxProperties: 1,
        },
        example: {},
        examples: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              {
                $ref: '#/definitions/Example',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
      allOf: [
        {
          $ref: '#/definitions/ExampleXORExamples',
        },
        {
          $ref: '#/definitions/SchemaXORContent',
        },
      ],
    },
    Paths: {
      type: 'object',
      patternProperties: {
        '^\\/': {
          $ref: '#/definitions/PathItem',
        },
        '^x-': {},
      },
      additionalProperties: false,
    },
    PathItem: {
      type: 'object',
      properties: {
        $ref: {
          type: 'string',
        },
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        servers: {
          type: 'array',
          items: {
            $ref: '#/definitions/Server',
          },
        },
        parameters: {
          type: 'array',
          items: {
            oneOf: [
              {
                $ref: '#/definitions/Parameter',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
          uniqueItems: true,
        },
      },
      patternProperties: {
        '^(get|put|post|delete|options|head|patch|trace)$': {
          $ref: '#/definitions/Operation',
        },
        '^x-': {},
      },
      additionalProperties: false,
    },
    Operation: {
      type: 'object',
      required: ['responses'],
      properties: {
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        externalDocs: {
          $ref: '#/definitions/ExternalDocumentation',
        },
        operationId: {
          type: 'string',
        },
        parameters: {
          type: 'array',
          items: {
            oneOf: [
              {
                $ref: '#/definitions/Parameter',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
          uniqueItems: true,
        },
        requestBody: {
          oneOf: [
            {
              $ref: '#/definitions/RequestBody',
            },
            {
              $ref: '#/definitions/Reference',
            },
          ],
        },
        responses: {
          $ref: '#/definitions/Responses',
        },
        callbacks: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              {
                $ref: '#/definitions/Callback',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
        deprecated: {
          type: 'boolean',
          default: false,
        },
        security: {
          type: 'array',
          items: {
            $ref: '#/definitions/SecurityRequirement',
          },
        },
        servers: {
          type: 'array',
          items: {
            $ref: '#/definitions/Server',
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Responses: {
      type: 'object',
      properties: {
        default: {
          oneOf: [
            {
              $ref: '#/definitions/Response',
            },
            {
              $ref: '#/definitions/Reference',
            },
          ],
        },
      },
      patternProperties: {
        '^[1-5](?:\\d{2}|XX)$': {
          oneOf: [
            {
              $ref: '#/definitions/Response',
            },
            {
              $ref: '#/definitions/Reference',
            },
          ],
        },
        '^x-': {},
      },
      minProperties: 1,
      additionalProperties: false,
    },
    SecurityRequirement: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
    Tag: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        externalDocs: {
          $ref: '#/definitions/ExternalDocumentation',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    ExternalDocumentation: {
      type: 'object',
      required: ['url'],
      properties: {
        description: {
          type: 'string',
        },
        url: {
          type: 'string',
          format: 'uri-reference',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    ExampleXORExamples: {
      description: 'Example and examples are mutually exclusive',
      not: {
        required: ['example', 'examples'],
      },
    },
    SchemaXORContent: {
      description: 'Schema and content are mutually exclusive, at least one is required',
      not: {
        required: ['schema', 'content'],
      },
      oneOf: [
        {
          required: ['schema'],
        },
        {
          required: ['content'],
          description: 'Some properties are not allowed if content is present',
          allOf: [
            {
              not: {
                required: ['style'],
              },
            },
            {
              not: {
                required: ['explode'],
              },
            },
            {
              not: {
                required: ['allowReserved'],
              },
            },
            {
              not: {
                required: ['example'],
              },
            },
            {
              not: {
                required: ['examples'],
              },
            },
          ],
        },
      ],
    },
    Parameter: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        in: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        required: {
          type: 'boolean',
          default: false,
        },
        deprecated: {
          type: 'boolean',
          default: false,
        },
        allowEmptyValue: {
          type: 'boolean',
          default: false,
        },
        style: {
          type: 'string',
        },
        explode: {
          type: 'boolean',
        },
        allowReserved: {
          type: 'boolean',
          default: false,
        },
        schema: {
          oneOf: [
            {
              $ref: '#/definitions/Schema',
            },
            {
              $ref: '#/definitions/Reference',
            },
          ],
        },
        content: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/MediaType',
          },
          minProperties: 1,
          maxProperties: 1,
        },
        example: {},
        examples: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              {
                $ref: '#/definitions/Example',
              },
              {
                $ref: '#/definitions/Reference',
              },
            ],
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
      required: ['name', 'in'],
      allOf: [
        {
          $ref: '#/definitions/ExampleXORExamples',
        },
        {
          $ref: '#/definitions/SchemaXORContent',
        },
        {
          $ref: '#/definitions/ParameterLocation',
        },
      ],
    },
    ParameterLocation: {
      description: 'Parameter location',
      oneOf: [
        {
          description: 'Parameter in path',
          required: ['required'],
          properties: {
            in: {
              enum: ['path'],
            },
            style: {
              enum: ['matrix', 'label', 'simple'],
              default: 'simple',
            },
            required: {
              enum: [true],
            },
          },
        },
        {
          description: 'Parameter in query',
          properties: {
            in: {
              enum: ['query'],
            },
            style: {
              enum: ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
              default: 'form',
            },
          },
        },
        {
          description: 'Parameter in header',
          properties: {
            in: {
              enum: ['header'],
            },
            style: {
              enum: ['simple'],
              default: 'simple',
            },
          },
        },
        {
          description: 'Parameter in cookie',
          properties: {
            in: {
              enum: ['cookie'],
            },
            style: {
              enum: ['form'],
              default: 'form',
            },
          },
        },
      ],
    },
    RequestBody: {
      type: 'object',
      required: ['content'],
      properties: {
        description: {
          type: 'string',
        },
        content: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/MediaType',
          },
        },
        required: {
          type: 'boolean',
          default: false,
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    SecurityScheme: {
      oneOf: [
        {
          $ref: '#/definitions/APIKeySecurityScheme',
        },
        {
          $ref: '#/definitions/HTTPSecurityScheme',
        },
        {
          $ref: '#/definitions/OAuth2SecurityScheme',
        },
        {
          $ref: '#/definitions/OpenIdConnectSecurityScheme',
        },
      ],
    },
    APIKeySecurityScheme: {
      type: 'object',
      required: ['type', 'name', 'in'],
      properties: {
        type: {
          type: 'string',
          enum: ['apiKey'],
        },
        name: {
          type: 'string',
        },
        in: {
          type: 'string',
          enum: ['header', 'query', 'cookie'],
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    HTTPSecurityScheme: {
      type: 'object',
      required: ['scheme', 'type'],
      properties: {
        scheme: {
          type: 'string',
        },
        bearerFormat: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: ['http'],
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
      oneOf: [
        {
          description: 'Bearer',
          properties: {
            scheme: {
              enum: ['bearer'],
            },
          },
        },
        {
          description: 'Non Bearer',
          not: {
            required: ['bearerFormat'],
          },
          properties: {
            scheme: {
              not: {
                enum: ['bearer'],
              },
            },
          },
        },
      ],
    },
    OAuth2SecurityScheme: {
      type: 'object',
      required: ['type', 'flows'],
      properties: {
        type: {
          type: 'string',
          enum: ['oauth2'],
        },
        flows: {
          $ref: '#/definitions/OAuthFlows',
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    OpenIdConnectSecurityScheme: {
      type: 'object',
      required: ['type', 'openIdConnectUrl'],
      properties: {
        type: {
          type: 'string',
          enum: ['openIdConnect'],
        },
        openIdConnectUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        description: {
          type: 'string',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    OAuthFlows: {
      type: 'object',
      properties: {
        implicit: {
          $ref: '#/definitions/ImplicitOAuthFlow',
        },
        password: {
          $ref: '#/definitions/PasswordOAuthFlow',
        },
        clientCredentials: {
          $ref: '#/definitions/ClientCredentialsFlow',
        },
        authorizationCode: {
          $ref: '#/definitions/AuthorizationCodeOAuthFlow',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    ImplicitOAuthFlow: {
      type: 'object',
      required: ['authorizationUrl', 'scopes'],
      properties: {
        authorizationUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        refreshUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        scopes: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    PasswordOAuthFlow: {
      type: 'object',
      required: ['tokenUrl', 'scopes'],
      properties: {
        tokenUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        refreshUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        scopes: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    ClientCredentialsFlow: {
      type: 'object',
      required: ['tokenUrl', 'scopes'],
      properties: {
        tokenUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        refreshUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        scopes: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    AuthorizationCodeOAuthFlow: {
      type: 'object',
      required: ['authorizationUrl', 'tokenUrl', 'scopes'],
      properties: {
        authorizationUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        tokenUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        refreshUrl: {
          type: 'string',
          format: 'uri-reference',
        },
        scopes: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
    },
    Link: {
      type: 'object',
      properties: {
        operationId: {
          type: 'string',
        },
        operationRef: {
          type: 'string',
          format: 'uri-reference',
        },
        parameters: {
          type: 'object',
          additionalProperties: {},
        },
        requestBody: {},
        description: {
          type: 'string',
        },
        server: {
          $ref: '#/definitions/Server',
        },
      },
      patternProperties: {
        '^x-': {},
      },
      additionalProperties: false,
      not: {
        description: 'Operation Id and Operation Ref are mutually exclusive',
        required: ['operationId', 'operationRef'],
      },
    },
    Callback: {
      type: 'object',
      additionalProperties: {
        $ref: '#/definitions/PathItem',
      },
      patternProperties: {
        '^x-': {},
      },
    },
    Encoding: {
      type: 'object',
      properties: {
        contentType: {
          type: 'string',
        },
        headers: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/Header',
          },
        },
        style: {
          type: 'string',
          enum: ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
        },
        explode: {
          type: 'boolean',
        },
        allowReserved: {
          type: 'boolean',
          default: false,
        },
      },
      additionalProperties: false,
    },
  },
};

const OAS_3_1 = {
  $id: 'https://spec.openapis.org/oas/3.1/schema/2021-09-28',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    openapi: {
      type: 'string',
      pattern: '^3\\.1\\.\\d+(-.+)?$',
    },
    info: {
      $ref: '#/$defs/info',
    },
    jsonSchemaDialect: {
      type: 'string',
      format: 'uri',
      default: 'https://spec.openapis.org/oas/3.1/dialect/base',
    },
    servers: {
      type: 'array',
      items: {
        $ref: '#/$defs/server',
      },
    },
    paths: {
      $ref: '#/$defs/paths',
    },
    webhooks: {
      type: 'object',
      additionalProperties: {
        $ref: '#/$defs/path-item-or-reference',
      },
    },
    components: {
      $ref: '#/$defs/components',
    },
    security: {
      type: 'array',
      items: {
        $ref: '#/$defs/security-requirement',
      },
    },
    tags: {
      type: 'array',
      items: {
        $ref: '#/$defs/tag',
      },
    },
    externalDocs: {
      $ref: '#/$defs/external-documentation',
    },
  },
  required: ['openapi', 'info'],
  anyOf: [
    {
      required: ['paths'],
      errorMessage: 'The document must have either "paths", "webhooks" or "components"',
    },
    {
      required: ['components'],
    },
    {
      required: ['webhooks'],
    },
  ],
  $ref: '#/$defs/specification-extensions',
  unevaluatedProperties: false,
  $defs: {
    info: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        termsOfService: {
          type: 'string',
        },
        contact: {
          $ref: '#/$defs/contact',
        },
        license: {
          $ref: '#/$defs/license',
        },
        version: {
          type: 'string',
        },
      },
      required: ['title', 'version'],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    contact: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    license: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        identifier: {
          type: 'string',
        },
        url: {
          type: 'string',
          format: 'uri',
        },
      },
      required: ['name'],
      oneOf: [
        {
          required: ['identifier'],
        },
        {
          required: ['url'],
        },
      ],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    server: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          format: 'uri-template',
        },
        description: {
          type: 'string',
        },
        variables: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/server-variable',
          },
        },
      },
      required: ['url'],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'server-variable': {
      type: 'object',
      properties: {
        enum: {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
        },
        default: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
      required: ['default'],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    components: {
      type: 'object',
      properties: {
        schemas: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/schema',
          },
        },
        responses: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/response-or-reference',
          },
        },
        parameters: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/parameter-or-reference',
          },
        },
        examples: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/example-or-reference',
          },
        },
        requestBodies: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/request-body-or-reference',
          },
        },
        headers: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/header-or-reference',
          },
        },
        securitySchemes: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/security-scheme-or-reference',
          },
        },
        links: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/link-or-reference',
          },
        },
        callbacks: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/callbacks-or-reference',
          },
        },
        pathItems: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/path-item-or-reference',
          },
        },
      },
      patternProperties: {
        '^(schemas|responses|parameters|examples|requestBodies|headers|securitySchemes|links|callbacks|pathItems)$': {
          $comment:
            'Enumerating all of the property names in the regex above is necessary for unevaluatedProperties to work as expected',
          propertyNames: {
            pattern: '^[a-zA-Z0-9._-]+$',
          },
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    paths: {
      type: 'object',
      patternProperties: {
        '^/': {
          $ref: '#/$defs/path-item',
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'path-item': {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        servers: {
          type: 'array',
          items: {
            $ref: '#/$defs/server',
          },
        },
        parameters: {
          type: 'array',
          items: {
            $ref: '#/$defs/parameter-or-reference',
          },
        },
      },
      patternProperties: {
        '^(get|put|post|delete|options|head|patch|trace)$': {
          $ref: '#/$defs/operation',
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'path-item-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/path-item',
      },
    },
    operation: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        externalDocs: {
          $ref: '#/$defs/external-documentation',
        },
        operationId: {
          type: 'string',
        },
        parameters: {
          type: 'array',
          items: {
            $ref: '#/$defs/parameter-or-reference',
          },
        },
        requestBody: {
          $ref: '#/$defs/request-body-or-reference',
        },
        responses: {
          $ref: '#/$defs/responses',
        },
        callbacks: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/callbacks-or-reference',
          },
        },
        deprecated: {
          default: false,
          type: 'boolean',
        },
        security: {
          type: 'array',
          items: {
            $ref: '#/$defs/security-requirement',
          },
        },
        servers: {
          type: 'array',
          items: {
            $ref: '#/$defs/server',
          },
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'external-documentation': {
      type: 'object',
      properties: {
        description: {
          type: 'string',
        },
        url: {
          type: 'string',
          format: 'uri',
        },
      },
      required: ['url'],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    parameter: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        in: {
          enum: ['query', 'header', 'path', 'cookie'],
        },
        description: {
          type: 'string',
        },
        required: {
          default: false,
          type: 'boolean',
        },
        deprecated: {
          default: false,
          type: 'boolean',
        },
        allowEmptyValue: {
          default: false,
          type: 'boolean',
        },
        schema: {
          $ref: '#/$defs/schema',
        },
        content: {
          $ref: '#/$defs/content',
        },
      },
      required: ['in'],
      oneOf: [
        {
          required: ['schema'],
        },
        {
          required: ['content'],
        },
      ],
      dependentSchemas: {
        schema: {
          properties: {
            style: {
              type: 'string',
            },
            explode: {
              type: 'boolean',
            },
            allowReserved: {
              default: false,
              type: 'boolean',
            },
          },
          allOf: [
            {
              $ref: '#/$defs/examples',
            },
            {
              $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-path',
            },
            {
              $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-header',
            },
            {
              $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-query',
            },
            {
              $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-cookie',
            },
            {
              $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-form',
            },
          ],
          $defs: {
            'styles-for-path': {
              if: {
                properties: {
                  in: {
                    const: 'path',
                  },
                },
                required: ['in'],
              },
              then: {
                properties: {
                  name: {
                    pattern: '[^/#?]+$',
                  },
                  style: {
                    default: 'simple',
                    enum: ['matrix', 'label', 'simple'],
                  },
                  required: {
                    const: true,
                  },
                },
                required: ['required'],
              },
            },
            'styles-for-header': {
              if: {
                properties: {
                  in: {
                    const: 'header',
                  },
                },
                required: ['in'],
              },
              then: {
                properties: {
                  style: {
                    default: 'simple',
                    const: 'simple',
                  },
                },
              },
            },
            'styles-for-query': {
              if: {
                properties: {
                  in: {
                    const: 'query',
                  },
                },
                required: ['in'],
              },
              then: {
                properties: {
                  style: {
                    default: 'form',
                    enum: ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
                  },
                },
              },
            },
            'styles-for-cookie': {
              if: {
                properties: {
                  in: {
                    const: 'cookie',
                  },
                },
                required: ['in'],
              },
              then: {
                properties: {
                  style: {
                    default: 'form',
                    const: 'form',
                  },
                },
              },
            },
            'styles-for-form': {
              if: {
                properties: {
                  style: {
                    const: 'form',
                  },
                },
                required: ['style'],
              },
              then: {
                properties: {
                  explode: {
                    default: true,
                  },
                },
              },
              else: {
                properties: {
                  explode: {
                    default: false,
                  },
                },
              },
            },
          },
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'parameter-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/parameter',
      },
    },
    'request-body': {
      type: 'object',
      properties: {
        description: {
          type: 'string',
        },
        content: {
          $ref: '#/$defs/content',
        },
        required: {
          default: false,
          type: 'boolean',
        },
      },
      required: ['content'],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'request-body-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/request-body',
      },
    },
    content: {
      type: 'object',
      additionalProperties: {
        $ref: '#/$defs/media-type',
      },
      propertyNames: {
        format: 'media-range',
      },
    },
    'media-type': {
      type: 'object',
      properties: {
        schema: {
          $ref: '#/$defs/schema',
        },
        encoding: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/encoding',
          },
        },
      },
      allOf: [
        {
          $ref: '#/$defs/specification-extensions',
        },
        {
          $ref: '#/$defs/examples',
        },
      ],
      unevaluatedProperties: false,
    },
    encoding: {
      type: 'object',
      properties: {
        contentType: {
          type: 'string',
          format: 'media-range',
        },
        headers: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/header-or-reference',
          },
        },
        style: {
          default: 'form',
          enum: ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
        },
        explode: {
          type: 'boolean',
        },
        allowReserved: {
          default: false,
          type: 'boolean',
        },
      },
      allOf: [
        {
          $ref: '#/$defs/specification-extensions',
        },
        {
          $ref: '#/$defs/encoding/$defs/explode-default',
        },
      ],
      unevaluatedProperties: false,
      $defs: {
        'explode-default': {
          if: {
            properties: {
              style: {
                const: 'form',
              },
            },
            required: ['style'],
          },
          then: {
            properties: {
              explode: {
                default: true,
              },
            },
          },
          else: {
            properties: {
              explode: {
                default: false,
              },
            },
          },
        },
      },
    },
    responses: {
      type: 'object',
      properties: {
        default: {
          $ref: '#/$defs/response-or-reference',
        },
      },
      patternProperties: {
        '^[1-5](?:[0-9]{2}|XX)$': {
          $ref: '#/$defs/response-or-reference',
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    response: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
        },
        headers: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/header-or-reference',
          },
        },
        content: {
          $ref: '#/$defs/content',
        },
        links: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/link-or-reference',
          },
        },
      },
      required: ['description'],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'response-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/response',
      },
    },
    callbacks: {
      type: 'object',
      $ref: '#/$defs/specification-extensions',
      additionalProperties: {
        $ref: '#/$defs/path-item-or-reference',
      },
    },
    'callbacks-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/callbacks',
      },
    },
    example: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        value: true,
        externalValue: {
          type: 'string',
          format: 'uri',
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'example-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/example',
      },
    },
    link: {
      type: 'object',
      properties: {
        operationRef: {
          type: 'string',
          format: 'uri-reference',
        },
        operationId: true,
        parameters: {
          $ref: '#/$defs/map-of-strings',
        },
        requestBody: true,
        description: {
          type: 'string',
        },
        body: {
          $ref: '#/$defs/server',
        },
      },
      oneOf: [
        {
          required: ['operationRef'],
        },
        {
          required: ['operationId'],
        },
      ],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'link-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/link',
      },
    },
    header: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
        },
        required: {
          default: false,
          type: 'boolean',
        },
        deprecated: {
          default: false,
          type: 'boolean',
        },
        schema: {
          $ref: '#/$defs/schema',
        },
        content: {
          $ref: '#/$defs/content',
        },
      },
      oneOf: [
        {
          required: ['schema'],
        },
        {
          required: ['content'],
        },
      ],
      dependentSchemas: {
        schema: {
          properties: {
            style: {
              default: 'simple',
              const: 'simple',
            },
            explode: {
              default: false,
              type: 'boolean',
            },
          },
          $ref: '#/$defs/examples',
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    'header-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/header',
      },
    },
    tag: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        externalDocs: {
          $ref: '#/$defs/external-documentation',
        },
      },
      required: ['name'],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
    },
    reference: {
      type: 'object',
      properties: {
        $ref: {
          type: 'string',
          format: 'uri-reference',
        },
        summary: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
      unevaluatedProperties: false,
    },
    schema: {
      $dynamicAnchor: 'meta',
      type: ['object', 'boolean'],
    },
    'security-scheme': {
      type: 'object',
      properties: {
        type: {
          enum: ['apiKey', 'http', 'mutualTLS', 'oauth2', 'openIdConnect'],
        },
        description: {
          type: 'string',
        },
      },
      required: ['type'],
      allOf: [
        {
          $ref: '#/$defs/specification-extensions',
        },
        {
          $ref: '#/$defs/security-scheme/$defs/type-apikey',
        },
        {
          $ref: '#/$defs/security-scheme/$defs/type-http',
        },
        {
          $ref: '#/$defs/security-scheme/$defs/type-http-bearer',
        },
        {
          $ref: '#/$defs/security-scheme/$defs/type-oauth2',
        },
        {
          $ref: '#/$defs/security-scheme/$defs/type-oidc',
        },
      ],
      unevaluatedProperties: false,
      $defs: {
        'type-apikey': {
          if: {
            properties: {
              type: {
                const: 'apiKey',
              },
            },
            required: ['type'],
          },
          then: {
            properties: {
              name: {
                type: 'string',
              },
              in: {
                enum: ['query', 'header', 'cookie'],
              },
            },
            required: ['name', 'in'],
          },
        },
        'type-http': {
          if: {
            properties: {
              type: {
                const: 'http',
              },
            },
            required: ['type'],
          },
          then: {
            properties: {
              scheme: {
                type: 'string',
              },
            },
            required: ['scheme'],
          },
        },
        'type-http-bearer': {
          if: {
            properties: {
              type: {
                const: 'http',
              },
              scheme: {
                type: 'string',
                pattern: '^[Bb][Ee][Aa][Rr][Ee][Rr]$',
              },
            },
            required: ['type', 'scheme'],
          },
          then: {
            properties: {
              bearerFormat: {
                type: 'string',
              },
            },
          },
        },
        'type-oauth2': {
          if: {
            properties: {
              type: {
                const: 'oauth2',
              },
            },
            required: ['type'],
          },
          then: {
            properties: {
              flows: {
                $ref: '#/$defs/oauth-flows',
              },
            },
            required: ['flows'],
          },
        },
        'type-oidc': {
          if: {
            properties: {
              type: {
                const: 'openIdConnect',
              },
            },
            required: ['type'],
          },
          then: {
            properties: {
              openIdConnectUrl: {
                type: 'string',
                format: 'uri',
              },
            },
            required: ['openIdConnectUrl'],
          },
        },
      },
    },
    'security-scheme-or-reference': {
      if: {
        type: 'object',
        required: ['$ref'],
      },
      then: {
        $ref: '#/$defs/reference',
      },
      else: {
        $ref: '#/$defs/security-scheme',
      },
    },
    'oauth-flows': {
      type: 'object',
      properties: {
        implicit: {
          $ref: '#/$defs/oauth-flows/$defs/implicit',
        },
        password: {
          $ref: '#/$defs/oauth-flows/$defs/password',
        },
        clientCredentials: {
          $ref: '#/$defs/oauth-flows/$defs/client-credentials',
        },
        authorizationCode: {
          $ref: '#/$defs/oauth-flows/$defs/authorization-code',
        },
      },
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
      $defs: {
        implicit: {
          type: 'object',
          properties: {
            authorizationUrl: {
              type: 'string',
            },
            refreshUrl: {
              type: 'string',
            },
            scopes: {
              $ref: '#/$defs/map-of-strings',
            },
          },
          required: ['authorizationUrl', 'scopes'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        password: {
          type: 'object',
          properties: {
            tokenUrl: {
              type: 'string',
            },
            refreshUrl: {
              type: 'string',
            },
            scopes: {
              $ref: '#/$defs/map-of-strings',
            },
          },
          required: ['tokenUrl', 'scopes'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'client-credentials': {
          type: 'object',
          properties: {
            tokenUrl: {
              type: 'string',
            },
            refreshUrl: {
              type: 'string',
            },
            scopes: {
              $ref: '#/$defs/map-of-strings',
            },
          },
          required: ['tokenUrl', 'scopes'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'authorization-code': {
          type: 'object',
          properties: {
            authorizationUrl: {
              type: 'string',
            },
            tokenUrl: {
              type: 'string',
            },
            refreshUrl: {
              type: 'string',
            },
            scopes: {
              $ref: '#/$defs/map-of-strings',
            },
          },
          required: ['authorizationUrl', 'tokenUrl', 'scopes'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
      },
    },
    'security-requirement': {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
    'specification-extensions': {
      patternProperties: {
        '^x-': true,
      },
    },
    examples: {
      properties: {
        example: true,
        examples: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/example-or-reference',
          },
        },
      },
    },
    'map-of-strings': {
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
    },
  },
};

const OAS_SCHEMAS = {
  '2.0': OAS_2,
  '3.0': OAS_3,
  3.1: OAS_3_1,
};

function shouldIgnoreError(error) {
  return (
    // oneOf is a fairly error as we have 2 options to choose from for most of the time.
    error.keyword === 'oneOf' ||
    // the required $ref is entirely useless, since oas-schema rules operate on resolved content, so there won't be any $refs in the document
    (error.keyword === 'required' && error.params.missingProperty === '$ref')
  );
}

// this is supposed to cover edge cases we need to cover manually, when it's impossible to detect the most appropriate error, i.e. oneOf consisting of more than 3 members, etc.
// note,  more errors can be included if certain messages reported by AJV are not quite meaningful
const ERROR_MAP = [
  {
    path: /^components\/securitySchemes\/[^/]+$/,
    message: 'Invalid security scheme',
  },
];

// The function removes irrelevant (aka misleading, confusing, useless, whatever you call it) errors.
// There are a few exceptions, i.e. security components I covered manually,
// yet apart from them we usually deal with a relatively simple scenario that can be literally expressed as: "either proper value of $ref property".
// The $ref part is never going to be interesting for us, because both oas-schema rules operate on resolved content, so we won't have any $refs left.
// As you can see, what we deal here wit is actually not really oneOf anymore - it's always the first member of oneOf we match against.
// That being said, we always strip both oneOf and $ref, since we are always interested in the first error.
function prepareResults(errors) {
  // Update additionalProperties errors to make them more precise and prevent them from being treated as duplicates
  for (const error of errors) {
    if (error.keyword === 'additionalProperties') {
      error.instancePath = `${error.instancePath}/${String(error.params['additionalProperty'])}`;
    }
  }

  for (let i = 0; i < errors.length; i++) {
    const error = errors[i];

    if (i + 1 < errors.length && errors[i + 1].instancePath === error.instancePath) {
      errors.splice(i + 1, 1);
      i--;
    } else if (i > 0 && shouldIgnoreError(error) && errors[i - 1].instancePath.startsWith(error.instancePath)) {
      errors.splice(i, 1);
      i--;
    }
  }
}

function applyManualReplacements(errors) {
  for (const error of errors) {
    if (error.path === void 0) continue;

    const joinedPath = error.path.join('/');

    for (const mappedError of ERROR_MAP) {
      if (mappedError.path.test(joinedPath)) {
        error.message = mappedError.message;
        break;
      }
    }
  }
}

var oasDocumentSchema = createRulesetFunction(
  {
    input: null,
    options: null,
  },
  function oasDocumentSchema(targetVal, opts, context) {
    const formats = context.document.formats;
    if (formats === null || formats === void 0) return;

    const schema$1 = formats.has(oas2)
      ? OAS_SCHEMAS['2.0']
      : formats.has(oas3_1)
      ? OAS_SCHEMAS['3.1']
      : OAS_SCHEMAS['3.0'];

    const errors = schema(targetVal, { allErrors: true, schema: schema$1, prepareResults }, context);

    if (Array.isArray(errors)) {
      applyManualReplacements(errors);
    }

    return errors;
  },
);

const MEDIA_VALIDATION_ITEMS = {
  2: [
    {
      field: 'examples',
      multiple: true,
      keyed: false,
    },
  ],
  3: [
    {
      field: 'example',
      multiple: false,
      keyed: false,
    },
    {
      field: 'examples',
      multiple: true,
      keyed: true,
    },
  ],
};

const SCHEMA_VALIDATION_ITEMS = {
  2: ['example', 'x-example', 'default'],
  3: ['example', 'default'],
};

function isObject$8(value) {
  return value !== null && typeof value === 'object';
}

function rewriteNullable$1(schema, errors) {
  for (const error of errors) {
    if (error.keyword !== 'type') continue;
    const value = getSchemaProperty$1(schema, error.schemaPath);
    if (isPlainObject(value) && value.nullable === true) {
      error.message += ',null';
    }
  }
}

const visitOAS2$1 = schema => {
  if (schema['x-nullable'] === true) {
    schema.nullable = true;
    delete schema['x-nullable'];
  }
};

function getSchemaProperty$1(schema, schemaPath) {
  const path = pointerToPath(schemaPath);
  let value = schema;

  for (const fragment of path.slice(0, -1)) {
    if (!isPlainObject(value)) {
      return;
    }

    value = value[fragment];
  }

  return value;
}

const oasSchema$1 = createRulesetFunction(
  {
    input: null,
    options: {
      type: 'object',
      properties: {
        schema: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
  },
  function oasSchema(targetVal, opts, context) {
    const formats = context.document.formats;

    let { schema: schema$1 } = opts;

    let dialect = 'draft4';
    let prepareResults;

    if (!formats) {
      dialect = 'auto';
    } else if (formats.has(oas3_1)) {
      if (isPlainObject(context.document.data) && typeof context.document.data.jsonSchemaDialect === 'string') {
        dialect = extractDraftVersion(context.document.data.jsonSchemaDialect) ?? 'draft2020-12';
      } else {
        dialect = 'draft2020-12';
      }
    } else if (formats.has(oas3_0)) {
      prepareResults = rewriteNullable$1.bind(null, schema$1);
    } else if (formats.has(oas2)) {
      const clonedSchema = JSON.parse(JSON.stringify(schema$1));
      traverse(clonedSchema, visitOAS2$1);
      schema$1 = clonedSchema;
      prepareResults = rewriteNullable$1.bind(null, clonedSchema);
    }

    return schema(
      targetVal,
      {
        ...opts,
        schema: schema$1,
        prepareResults,
        dialect,
      },
      context,
    );
  },
);

function* getMediaValidationItems(items, targetVal, givenPath, oasVersion) {
  for (const { field, keyed, multiple } of items) {
    if (!(field in targetVal)) {
      continue;
    }

    const value = targetVal[field];

    if (multiple) {
      if (!isObject$8(value)) continue;

      for (const exampleKey of Object.keys(value)) {
        const exampleValue = value[exampleKey];
        if (oasVersion === 3 && keyed && (!isObject$8(exampleValue) || 'externalValue' in exampleValue)) {
          // should be covered by oas3-examples-value-or-externalValue
          continue;
        }

        const targetPath = [...givenPath, field, exampleKey];

        if (keyed) {
          targetPath.push('value');
        }

        yield {
          value: keyed && isObject$8(exampleValue) ? exampleValue.value : exampleValue,
          path: targetPath,
        };
      }

      return;
    } else {
      return yield {
        value,
        path: [...givenPath, field],
      };
    }
  }
}

function* getSchemaValidationItems(fields, targetVal, givenPath) {
  for (const field of fields) {
    if (!(field in targetVal)) {
      continue;
    }

    yield {
      value: targetVal[field],
      path: [...givenPath, field],
    };
  }
}

var oasExample = createRulesetFunction(
  {
    input: {
      type: 'object',
    },
    options: {
      type: 'object',
      properties: {
        oasVersion: {
          type: 'number'
        },
        schemaField: {
          type: 'string',
        },
        type: {
          enum: ['media', 'schema'],
        },
      },
      additionalProperties: false,
    },
  },
  function oasExample(targetVal, opts, context) {
    const formats = context.document.formats;
    const schemaOpts = {
      schema: opts.schemaField === '$' ? targetVal : targetVal[opts.schemaField],
    };

    let results = void 0;
    let oasVersion = parseInt(opts.oasVersion);

    const validationItems =
      opts.type === 'schema'
        ? getSchemaValidationItems(SCHEMA_VALIDATION_ITEMS[oasVersion], targetVal, context.path)
        : getMediaValidationItems(MEDIA_VALIDATION_ITEMS[oasVersion], targetVal, context.path, oasVersion);

    if (formats?.has(oas2) && 'required' in schemaOpts.schema && typeof schemaOpts.schema.required === 'boolean') {
      schemaOpts.schema = { ...schemaOpts.schema };
      delete schemaOpts.schema.required;
    }

    for (const validationItem of validationItems) {
      const result = oasSchema$1(validationItem.value, schemaOpts, {
        ...context,
        path: validationItem.path,
      });

      if (Array.isArray(result)) {
        if (results === void 0) results = [];
        results.push(...result);
      }
    }

    return results;
  },
);

function isObject$7(value) {
  return value !== null && typeof value === 'object';
}

const validConsumeValue = /(application\/x-www-form-urlencoded|multipart\/form-data)/;

const oasOpFormDataConsumeCheck = targetVal => {
  if (!isObject$7(targetVal)) return;

  const parameters = targetVal.parameters;
  const consumes = targetVal.consumes;

  if (!Array.isArray(parameters) || !Array.isArray(consumes)) {
    return;
  }

  if (parameters.some(p => isObject$7(p) && p.in === 'formData') && !validConsumeValue.test(consumes?.join(','))) {
    return [
      {
        message: 'Consumes must include urlencoded, multipart, or form-data media type when using formData parameter.',
      },
    ];
  }

  return;
};

function isObject$6(value) {
  return value !== null && typeof value === 'object';
}

const validOperationKeys$2 = ['get', 'head', 'post', 'put', 'patch', 'delete', 'options', 'trace'];

function* getAllOperations$2(paths) {
  if (!isPlainObject(paths)) {
    return;
  }

  const item = {
    path: '',
    operation: '',
    value: null,
  };

  for (const path of Object.keys(paths)) {
    const operations = paths[path];
    if (!isPlainObject(operations)) {
      continue;
    }

    item.path = path;

    for (const operation of Object.keys(operations)) {
      if (!isPlainObject(operations[operation]) || !validOperationKeys$2.includes(operation)) {
        continue;
      }

      item.operation = operation;
      item.value = operations[operation];

      yield item;
    }
  }
}

const oasOpIdUnique = targetVal => {
  if (!isObject$6(targetVal) || !isObject$6(targetVal.paths)) return;

  const results = [];

  const { paths } = targetVal;

  const seenIds = [];

  for (const { path, operation } of getAllOperations$2(paths)) {
    const pathValue = paths[path];

    if (!isObject$6(pathValue)) continue;

    const operationValue = pathValue[operation];

    if (!isObject$6(operationValue) || !('operationId' in operationValue)) {
      continue;
    }

    const { operationId } = operationValue;

    if (seenIds.includes(operationId)) {
      results.push({
        message: 'operationId must be unique.',
        path: ['paths', path, operation, 'operationId'],
      });
    } else {
      seenIds.push(operationId);
    }
  }

  return results;
};

function isObject$5(value) {
  return value !== null && typeof value === 'object';
}

function computeFingerprint(param) {
  return `${String(param.in)}-${String(param.name)}`;
}

const oasOpParams = (params, _opts, { path }) => {
  /**
   * This function verifies:
   *
   * 1. Operations must have unique `name` + `in` parameters.
   * 2. Operation cannot have both `in:body` and `in:formData` parameters
   * 3. Operation must have only one `in:body` parameter.
   */

  if (!Array.isArray(params)) return;

  if (params.length < 2) return;

  const results = [];

  const count = {
    body: [],
    formData: [],
  };
  const list = [];
  const duplicates = [];

  let index = -1;

  for (const param of params) {
    index++;

    if (!isObject$5(param)) continue;

    // skip params that are refs
    if ('$ref' in param) continue;

    // Operations must have unique `name` + `in` parameters.
    const fingerprint = computeFingerprint(param);
    if (list.includes(fingerprint)) {
      duplicates.push(index);
    } else {
      list.push(fingerprint);
    }

    if (typeof param.in === 'string' && param.in in count) {
      count[param.in].push(index);
    }
  }

  if (duplicates.length > 0) {
    for (const i of duplicates) {
      results.push({
        message: 'A parameter in this operation already exposes the same combination of "name" and "in" values.',
        path: [...path, i],
      });
    }
  }

  if (count.body.length > 0 && count.formData.length > 0) {
    results.push({
      message: 'Operation must not have both "in:body" and "in:formData" parameters.',
    });
  }

  if (count.body.length > 1) {
    for (let i = 1; i < count.body.length; i++) {
      results.push({
        message: 'Operation must not have more than a single instance of the "in:body" parameter.',
        path: [...path, count.body[i]],
      });
    }
  }

  return results;
};

function isObject$4(value) {
  return value !== null && typeof value === 'object';
}

const validOperationKeys$1 = ['get', 'head', 'post', 'put', 'patch', 'delete', 'options', 'trace'];

function* getAllOperations$1(paths) {
  if (!isPlainObject(paths)) {
    return;
  }

  const item = {
    path: '',
    operation: '',
    value: null,
  };

  for (const path of Object.keys(paths)) {
    const operations = paths[path];
    if (!isPlainObject(operations)) {
      continue;
    }

    item.path = path;

    for (const operation of Object.keys(operations)) {
      if (!isPlainObject(operations[operation]) || !validOperationKeys$1.includes(operation)) {
        continue;
      }

      item.operation = operation;
      item.value = operations[operation];

      yield item;
    }
  }
}

function _get(value, path) {
  for (const segment of path) {
    if (!isObject$4(value)) {
      break;
    }

    value = value[segment];
  }

  return value;
}

var oasOpSecurityDefined = createRulesetFunction(
  {
    input: {
      type: 'object',
      properties: {
        paths: {
          type: 'object',
        },
        security: {
          type: 'array',
        },
      },
    },
    options: {
      type: 'object',
      properties: {
        schemesPath: {
          type: 'array',
          items: {
            type: ['string', 'number'],
          },
        },
      },
    },
  },
  function oasOpSecurityDefined(targetVal, { schemesPath }) {
    const { paths } = targetVal;

    const results = [];

    const schemes = _get(targetVal, schemesPath);
    const allDefs = isObject$4(schemes) ? Object.keys(schemes) : [];

    // Check global security requirements

    const { security } = targetVal;

    if (Array.isArray(security)) {
      for (const [index, value] of security.entries()) {
        if (!isObject$4(value)) {
          continue;
        }

        const securityKeys = Object.keys(value);

        for (const securityKey of securityKeys) {
          if (!allDefs.includes(securityKey)) {
            results.push({
              message: `API "security" values must match a scheme defined in the "${schemesPath.join('.')}" object.`,
              path: ['security', index, securityKey],
            });
          }
        }
      }
    }

    for (const { path, operation, value } of getAllOperations$1(paths)) {
      if (!isObject$4(value)) continue;

      const { security } = value;

      if (!Array.isArray(security)) {
        continue;
      }

      for (const [index, value] of security.entries()) {
        if (!isObject$4(value)) {
          continue;
        }

        const securityKeys = Object.keys(value);

        for (const securityKey of securityKeys) {
          if (!allDefs.includes(securityKey)) {
            results.push({
              message: `Operation "security" values must match a scheme defined in the "${schemesPath.join(
                '.',
              )}" object.`,
              path: ['paths', path, operation, 'security', index, securityKey],
            });
          }
        }
      }
    }

    return results;
  },
);

const oasOpSuccessResponse = createRulesetFunction(
  {
    input: {
      type: 'object',
    },
    options: null,
  },
  (input, opts, context) => {
    const isOAS3X = context.document.formats?.has(oas3) === true;

    for (const response of Object.keys(input)) {
      if (isOAS3X && (response === '2XX' || response === '3XX')) {
        return;
      }

      if (Number(response) >= 200 && Number(response) < 400) {
        return;
      }
    }

    return [
      {
        message: 'Operation must define at least a single 2xx or 3xx response',
      },
    ];
  },
);

function isObject$3(value) {
  return value !== null && typeof value === 'object';
}

const pathRegex = /(\{;?\??[a-zA-Z0-9_-]+\*?\})/g;

const isNamedPathParam = p => {
  return p.in !== void 0 && p.in === 'path' && p.name !== void 0;
};

const isUnknownNamedPathParam = (p, path, results, seen) => {
  if (!isNamedPathParam(p)) {
    return false;
  }

  if (p.required !== true) {
    results.push(generateResult(requiredMessage(p.name), path));
  }

  if (p.name in seen) {
    results.push(generateResult(uniqueDefinitionMessage(p.name), path));
    return false;
  }

  return true;
};

const ensureAllDefinedPathParamsAreUsedInPath = (path, params, expected, results) => {
  for (const p of Object.keys(params)) {
    if (!params[p]) {
      continue;
    }

    if (!expected.includes(p)) {
      const resPath = params[p];
      results.push(generateResult(`Parameter "${p}" must be used in path "${path}".`, resPath));
    }
  }
};

const ensureAllExpectedParamsInPathAreDefined = (path, params, expected, operationPath, results) => {
  for (const p of expected) {
    if (!(p in params)) {
      results.push(
        generateResult(`Operation must define parameter "{${p}}" as expected by path "${path}".`, operationPath),
      );
    }
  }
};

const oasPathParam = targetVal => {
  /**
   * This rule verifies:
   *
   * 1. for every param referenced in the path string ie /users/{userId}, var must be defined in either
   *    path.parameters, or operation.parameters object
   * 2. every path.parameters + operation.parameters property must be used in the path string
   */

  if (!isObject$3(targetVal) || !isObject$3(targetVal.paths)) {
    return;
  }

  const results = [];

  // keep track of normalized paths for verifying paths are unique
  const uniquePaths = {};
  const validOperationKeys = ['get', 'head', 'post', 'put', 'patch', 'delete', 'options', 'trace'];

  for (const path of Object.keys(targetVal.paths)) {
    const pathValue = targetVal.paths[path];
    if (!isObject$3(pathValue)) continue;

    // verify normalized paths are functionally unique (ie `/path/{one}` vs `/path/{two}` are
    // different but equivalent within the context of OAS)
    const normalized = path.replace(pathRegex, '%'); // '%' is used here since its invalid in paths
    if (normalized in uniquePaths) {
      results.push(
        generateResult(`Paths "${String(uniquePaths[normalized])}" and "${path}" must not be equivalent.`, [
          'paths',
          path,
        ]),
      );
    } else {
      uniquePaths[normalized] = path;
    }

    // find all templated path parameters
    const pathElements = [];
    let match;

    while ((match = pathRegex.exec(path))) {
      const p = match[0].replace(/[{}?*;]/g, '');
      if (pathElements.includes(p)) {
        results.push(generateResult(`Path "${path}" must not use parameter "{${p}}" multiple times.`, ['paths', path]));
      } else {
        pathElements.push(p);
      }
    }

    // find parameters set within the top-level 'parameters' object
    const topParams = {};
    if (Array.isArray(pathValue.parameters)) {
      for (const [i, value] of pathValue.parameters.entries()) {
        if (!isObject$3(value)) continue;

        const fullParameterPath = ['paths', path, 'parameters', i];

        if (isUnknownNamedPathParam(value, fullParameterPath, results, topParams)) {
          topParams[value.name] = fullParameterPath;
        }
      }
    }

    if (isObject$3(targetVal.paths[path])) {
      // find parameters set within the operation's 'parameters' object
      for (const op of Object.keys(pathValue)) {
        const operationValue = pathValue[op];
        if (!isObject$3(operationValue)) continue;

        if (op === 'parameters' || !validOperationKeys.includes(op)) {
          continue;
        }

        const operationParams = {};
        const { parameters } = operationValue;
        const operationPath = ['paths', path, op];

        if (Array.isArray(parameters)) {
          for (const [i, p] of parameters.entries()) {
            if (!isObject$3(p)) continue;

            const fullParameterPath = [...operationPath, 'parameters', i];

            if (isUnknownNamedPathParam(p, fullParameterPath, results, operationParams)) {
              operationParams[p.name] = fullParameterPath;
            }
          }
        }

        const definedParams = { ...topParams, ...operationParams };
        ensureAllDefinedPathParamsAreUsedInPath(path, definedParams, pathElements, results);
        ensureAllExpectedParamsInPathAreDefined(path, definedParams, pathElements, operationPath, results);
      }
    }
  }

  return results;
};

function generateResult(message, path) {
  return {
    message,
    path,
  };
}

const requiredMessage = name => `Path parameter "${name}" must have "required" property that is set to "true".`;

const uniqueDefinitionMessage = name => `Path parameter "${name}" must not be defined multiple times.`;

function rewriteNullable(schema, errors) {
  for (const error of errors) {
    if (error.keyword !== 'type') continue;
    const value = getSchemaProperty(schema, error.schemaPath);
    if (isPlainObject(value) && value.nullable === true) {
      error.message += ',null';
    }
  }
}

var oasSchema = createRulesetFunction(
  {
    input: null,
    options: {
      type: 'object',
      properties: {
        schema: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
  },
  function oasSchema(targetVal, opts, context) {
    const formats = context.document.formats;

    let { schema: schema$1 } = opts;

    let dialect = 'draft4';
    let prepareResults;

    if (!formats) {
      dialect = 'auto';
    } else if (formats.has(oas3_1)) {
      if (isPlainObject(context.document.data) && typeof context.document.data.jsonSchemaDialect === 'string') {
        dialect = extractDraftVersion(context.document.data.jsonSchemaDialect) ?? 'draft2020-12';
      } else {
        dialect = 'draft2020-12';
      }
    } else if (formats.has(oas3_0)) {
      prepareResults = rewriteNullable.bind(null, schema$1);
    } else if (formats.has(oas2)) {
      const clonedSchema = JSON.parse(JSON.stringify(schema$1));
      traverse(clonedSchema, visitOAS2);
      schema$1 = clonedSchema;
      prepareResults = rewriteNullable.bind(null, clonedSchema);
    }

    return schema(
      targetVal,
      {
        ...opts,
        schema: schema$1,
        prepareResults,
        dialect,
      },
      context,
    );
  },
);

const visitOAS2 = schema => {
  if (schema['x-nullable'] === true) {
    schema.nullable = true;
    delete schema['x-nullable'];
  }
};

function getSchemaProperty(schema, schemaPath) {
  const path = pointerToPath(schemaPath);
  let value = schema;

  for (const fragment of path.slice(0, -1)) {
    if (!isPlainObject(value)) {
      return;
    }

    value = value[fragment];
  }

  return value;
}

// This function will check an API doc to verify that any tag that appears on

function isObject$2(value) {
  return value !== null && typeof value === 'object';
}

const validOperationKeys = ['get', 'head', 'post', 'put', 'patch', 'delete', 'options', 'trace'];

function* getAllOperations(paths) {
  if (!isPlainObject(paths)) {
    return;
  }

  const item = {
    path: '',
    operation: '',
    value: null,
  };

  for (const path of Object.keys(paths)) {
    const operations = paths[path];
    if (!isPlainObject(operations)) {
      continue;
    }

    item.path = path;

    for (const operation of Object.keys(operations)) {
      if (!isPlainObject(operations[operation]) || !validOperationKeys.includes(operation)) {
        continue;
      }

      item.operation = operation;
      item.value = operations[operation];

      yield item;
    }
  }
}

const oasTagDefined = targetVal => {
  if (!isObject$2(targetVal)) return;
  const results = [];

  const globalTags = [];

  if (Array.isArray(targetVal.tags)) {
    for (const tag of targetVal.tags) {
      if (isObject$2(tag) && typeof tag.name === 'string') {
        globalTags.push(tag.name);
      }
    }
  }

  const { paths } = targetVal;

  for (const { path, operation, value } of getAllOperations(paths)) {
    if (!isObject$2(value)) continue;

    const { tags } = value;

    if (!Array.isArray(tags)) {
      continue;
    }

    for (const [i, tag] of tags.entries()) {
      if (!globalTags.includes(tag)) {
        results.push({
          message: 'Operation tags must be defined in global tags.',
          path: ['paths', path, operation, 'tags', i],
        });
      }
    }
  }

  return results;
};

function isObject$1(value) {
  return value !== null && typeof value === 'object';
}

var oasUnusedComponent = createRulesetFunction(
  {
    input: {
      type: 'object',
      properties: {
        components: {
          type: 'object',
        },
      },
      required: ['components'],
    },
    options: null,
  },
  function oasUnusedComponent(targetVal, opts, context) {
    const results = [];
    const componentTypes = [
      'schemas',
      'responses',
      'parameters',
      'examples',
      'requestBodies',
      'headers',
      'links',
      'callbacks',
    ];

    for (const type of componentTypes) {
      const value = targetVal.components[type];
      if (!isObject$1(value)) continue;

      const resultsForType = unreferencedReusableObject(
        value,
        { reusableObjectsLocation: `#/components/${type}` },
        context,
      );
      if (resultsForType !== void 0 && Array.isArray(resultsForType)) {
        results.push(...resultsForType);
      }
    }

    return results;
  },
);

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function getParentValue(document, path) {
  if (path.length === 0) {
    return null;
  }

  let piece = document;

  for (let i = 0; i < path.length - 1; i += 1) {
    if (!isObject(piece)) {
      return null;
    }

    piece = piece[path[i]];
  }

  return piece;
}

const refSiblings = (targetVal, opts, { document, path }) => {
  const value = getParentValue(document.data, path);

  if (!isObject(value)) {
    return;
  }

  const keys = Object.keys(value);
  if (keys.length === 1) {
    return;
  }

  const results = [];
  const actualObjPath = path.slice(0, -1);

  for (const key of keys) {
    if (key === '$ref') {
      continue;
    }
    results.push({
      message: '$ref must not be placed next to any other properties',
      path: [...actualObjPath, key],
    });
  }

  return results;
};

function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
				var args = [null];
				args.push.apply(args, arguments);
				var Ctor = Function.bind.apply(f, args);
				return new Ctor();
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var serverVariables = {};

var require$$0 = /*@__PURE__*/getAugmentedNamespace(spectralCore);

var parseUrlVariables$1 = {};

Object.defineProperty(parseUrlVariables$1, "__esModule", { value: true });
parseUrlVariables$1.parseUrlVariables = void 0;
function parseUrlVariables(str) {
    if (typeof str !== 'string')
        return [];
    const variables = str.match(/{(.+?)}/g);
    if (!variables || variables.length === 0)
        return [];
    return variables.map(v => v.slice(1, -1));
}
parseUrlVariables$1.parseUrlVariables = parseUrlVariables;

var getMissingProps$1 = {};

Object.defineProperty(getMissingProps$1, "__esModule", { value: true });
getMissingProps$1.getMissingProps = void 0;
function getMissingProps(arr, props) {
    return arr.filter(val => {
        return !props.includes(val);
    });
}
getMissingProps$1.getMissingProps = getMissingProps;

var getRedundantProps$1 = {};

Object.defineProperty(getRedundantProps$1, "__esModule", { value: true });
getRedundantProps$1.getRedundantProps = void 0;
function getRedundantProps(arr, keys) {
    return keys.filter(val => {
        return !arr.includes(val);
    });
}
getRedundantProps$1.getRedundantProps = getRedundantProps;

var applyUrlVariables$1 = {};

Object.defineProperty(applyUrlVariables$1, "__esModule", { value: true });
applyUrlVariables$1.applyUrlVariables = void 0;
function* applyUrlVariables(url, variables) {
    yield* _applyUrlVariables(url, 0, variables.map(toApplicableVariable));
}
applyUrlVariables$1.applyUrlVariables = applyUrlVariables;
function* _applyUrlVariables(url, i, variables) {
    const [name, values] = variables[i];
    let x = 0;
    while (x < values.length) {
        const substitutedValue = url.replace(name, values[x]);
        if (i === variables.length - 1) {
            yield substitutedValue;
        }
        else {
            yield* _applyUrlVariables(substitutedValue, i + 1, variables);
        }
        x++;
    }
}
function toApplicableVariable([name, values]) {
    return [toReplaceRegExp(name), values.map(encodeURI)];
}
function toReplaceRegExp(name) {
    return RegExp(escapeRegexp(`{${name}}`), 'g');
}
function escapeRegexp(value) {
    return value.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

Object.defineProperty(serverVariables, "__esModule", { value: true });
const spectral_core_1 = require$$0;
const parseUrlVariables_1 = parseUrlVariables$1;
const getMissingProps_1 = getMissingProps$1;
const getRedundantProps_1 = getRedundantProps$1;
const applyUrlVariables_1 = applyUrlVariables$1;
var serverVariables$1 = createRulesetFunction({
    input: {
        errorMessage: 'Invalid Server Object',
        type: 'object',
        properties: {
            url: {
                type: 'string',
            },
            variables: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                        enum: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        default: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        examples: {
                            type: 'string',
                        },
                    },
                    patternProperties: {
                        '^x-': true,
                    },
                    additionalProperties: false,
                },
            },
        },
        required: ['url'],
    },
    errorOnInvalidInput: true,
    options: {
        type: ['object', 'null'],
        properties: {
            checkSubstitutions: {
                type: 'boolean',
                default: 'false',
            },
        },
        additionalProperties: false,
    },
}, function serverVariables({ url, variables }, opts, ctx) {
    var _a;
    if (variables === void 0)
        return;
    const results = [];
    const foundVariables = (0, parseUrlVariables_1.parseUrlVariables)(url);
    const definedVariablesKeys = Object.keys(variables);
    const redundantVariables = (0, getRedundantProps_1.getRedundantProps)(foundVariables, definedVariablesKeys);
    for (const variable of redundantVariables) {
        results.push({
            message: `Server's "variables" object has unused defined "${variable}" url variable.`,
            path: [...ctx.path, 'variables', variable],
        });
    }
    if (foundVariables.length === 0)
        return results;
    const missingVariables = (0, getMissingProps_1.getMissingProps)(foundVariables, definedVariablesKeys);
    if (missingVariables.length > 0) {
        results.push({
            message: `Not all server's variables are described with "variables" object. Missed: ${missingVariables.join(', ')}.`,
            path: [...ctx.path, 'variables'],
        });
    }
    const variablePairs = [];
    for (const key of definedVariablesKeys) {
        if (redundantVariables.includes(key))
            continue;
        const values = variables[key];
        if ('enum' in values) {
            variablePairs.push([key, values.enum]);
            if ('default' in values && !values.enum.includes(values.default)) {
                results.push({
                    message: `Server Variable "${key}" has a default not listed in the enum`,
                    path: [...ctx.path, 'variables', key, 'default'],
                });
            }
        }
        else {
            variablePairs.push([key, [(_a = values.default) !== null && _a !== void 0 ? _a : '']]);
        }
    }
    if ((opts === null || opts === void 0 ? void 0 : opts.checkSubstitutions) === true && variablePairs.length > 0) {
        checkSubstitutions(results, ctx.path, url, variablePairs);
    }
    return results;
});
function checkSubstitutions(results, path, url, variables) {
    const invalidUrls = [];
    for (const substitutedUrl of (0, applyUrlVariables_1.applyUrlVariables)(url, variables)) {
        try {
            new URL(substitutedUrl);
        }
        catch {
            invalidUrls.push(substitutedUrl);
            if (invalidUrls.length === 5) {
                break;
            }
        }
    }
    if (invalidUrls.length === 5) {
        results.push({
            message: `At least 5 substitutions of server variables resulted in invalid URLs: ${invalidUrls.join(', ')} and more`,
            path: [...path, 'variables'],
        });
    }
    else if (invalidUrls.length > 0) {
        results.push({
            message: `A few substitutions of server variables resulted in invalid URLs: ${invalidUrls.join(', ')}`,
            path: [...path, 'variables'],
        });
    }
}

function getDataType(input, checkForInteger) {
  const type = typeof input;
  switch (type) {
    case 'string':
    case 'boolean':
      return type;
    case 'number':
      if (checkForInteger && Number.isInteger(input)) {
        return 'integer';
      }

      return 'number';
    case 'object':
      if (input === null) {
        return 'null';
      }

      return Array.isArray(input) ? 'array' : 'object';
    default:
      throw TypeError('Unknown input type');
  }
}

function getTypes(input, formats) {
  const { type } = input;

  if (
    (input.nullable === true && formats?.has(oas3_0) === true) ||
    (input['x-nullable'] === true && formats?.has(oas2) === true)
  ) {
    return Array.isArray(type) ? [...type, 'null'] : [type, 'null'];
  }

  return type;
}

const typedEnum = createRulesetFunction(
  {
    input: {
      type: 'object',
      properties: {
        enum: {
          type: 'array',
        },
        type: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            {
              type: 'string',
            },
          ],
        },
      },
      required: ['enum', 'type'],
    },
    options: null,
  },
  function (input, opts, context) {
    const { enum: enumValues } = input;
    const type = getTypes(input, context.document.formats);
    const checkForInteger = type === 'integer' || (Array.isArray(type) && type.includes('integer'));

    let results;

    enumValues.forEach((value, i) => {
      const valueType = getDataType(value, checkForInteger);

      if (valueType === type || (Array.isArray(type) && type.includes(valueType))) {
        return;
      }

      results = results || [];
      results.push({
        message: `Enum value ${printValue(enumValues[i])} must be "${String(type)}".`,
        path: [...context.path, 'enum', i],
      });
    });

    return results;
  },
);

var _spectral = {
  "description": "",
  "formats": [oas2, oas3, oas3_0, oas3_1],
  "aliases": {
    "API_Document": {
      "description": "The complete API specification document. This can be used to target any part of the OpenAPI document using **field**.\n\n*Use this if you don't find specific targets that cater to your usecase.* ",
      "targets": [{
        "formats": [oas2],
        "given": ["$"]
      }, {
        "formats": [oas3],
        "given": ["$"]
      }]
    },
    "API_Description": {
      "description": "The top level description in an API document",
      "targets": [{
        "formats": [oas2],
        "given": ["$.info.description"]
      }, {
        "formats": [oas3],
        "given": ["$.info.description"]
      }]
    },
    "Operation_Object": {
      "description": "The complete operation object. Use it in combo with field object.",
      "targets": [{
        "formats": [oas2],
        "given": ["#Path_Item[get,put,post,delete,options,head,patch,trace]"]
      }, {
        "formats": [oas3],
        "given": ["#Path_Item[get,put,post,delete,options,head,patch,trace]"]
      }]
    },
    "Operation_Responses": {
      "description": "Responses for all operations including get, put, post, delete, options, head, patch, trace.",
      "targets": [{
        "formats": [oas2],
        "given": ["#Operation_Object.responses"]
      }, {
        "formats": [oas3],
        "given": ["#Operation_Object.responses"]
      }]
    },
    "Path_Item": {
      "description": "",
      "targets": [{
        "formats": [oas2],
        "given": ["$.paths[*]"]
      }, {
        "formats": [oas3],
        "given": ["$.paths[*]"]
      }]
    },
    "API_Contact": {
      "description": "The top level description in an API document",
      "targets": [{
        "formats": [oas2],
        "given": ["$.info.contact"]
      }, {
        "formats": [oas3],
        "given": ["$.info.contact"]
      }]
    },
    "API_License": {
      "description": "The top level description in an API document",
      "targets": [{
        "formats": [oas2],
        "given": ["$.info.license"]
      }, {
        "formats": [oas3],
        "given": ["$.info.license"]
      }]
    },
    "All_Markdown": {
      "description": "All markdown descriptions across the document.",
      "targets": [{
        "formats": [oas2],
        "given": ["$..[description,title]"]
      }, {
        "formats": [oas3],
        "given": ["$..[description,title]"]
      }]
    },
    "API_Tags": {
      "description": "Tags on an API object",
      "targets": [{
        "formats": [oas2],
        "given": ["#Operation_Object.tags"]
      }, {
        "formats": [oas3],
        "given": ["#Operation_Object.tags"]
      }]
    },
    "All_Servers": {
      "description": "API hosts defined in the API specification",
      "targets": [{
        "formats": [oas3],
        "given": ["$.servers[*]", "#Path_Item.servers[*]", "#Operation_Object.servers[*]", "#Link_Object.server"]
      }, {
        "formats": [oas2],
        "given": ["$.host"]
      }]
    },
    "Response_All_Object": {
      "description": "All responses (object) in an API",
      "targets": [{
        "formats": [oas2],
        "given": ["$.responses", "#Operation_Responses", "$..responses"]
      }, {
        "formats": [oas3],
        "given": ["$.components.responses", "#Operation_Responses", "$..responses"]
      }]
    },
    "API_Server_URL": {
      "description": "API host urls defined in the API specification",
      "targets": [{
        "formats": [oas3],
        "given": ["$.servers[*].url"]
      }, {
        "formats": [oas2],
        "given": ["$.host"]
      }]
    },
    "All_Ref": {
      "description": "All references throughout the API",
      "targets": [{
        "formats": [oas2],
        "given": ["$..[?(@property === '$ref')]"]
      }, {
        "formats": [oas3],
        "given": ["$..[?(@property === '$ref')]"]
      }]
    },
    "All_Enum_Object": {
      "description": "All references throughout the API",
      "targets": [{
        "formats": [oas2],
        "given": ["$..[?(@ && @.enum)]"]
      }, {
        "formats": [oas3],
        "given": ["$..[?(@ && @.enum)]"]
      }]
    },
    "Request_Parameter_All": {
      "description": "All request parameters",
      "targets": [{
        "formats": [oas2],
        "given": ["$..parameters[*]"]
      }, {
        "formats": [oas3],
        "given": ["$..parameters[*]"]
      }]
    },
    "Request_Parameter_Query": {
      "description": "All request query parameters",
      "targets": [{
        "formats": [oas2],
        "given": ["$..parameters[?(@ && @.in==\"query\")]"]
      }, {
        "formats": [oas3],
        "given": ["$..parameters[?(@ && @.in==\"query\")]"]
      }]
    },
    "Request_Parameter_Header": {
      "description": "All request header parameters",
      "targets": [{
        "formats": [oas2],
        "given": ["$..parameters[?(@ && @.in==\"header\")]"]
      }, {
        "formats": [oas3],
        "given": ["$..parameters[?(@ && @.in==\"header\")]"]
      }]
    },
    "Request_Parameter_Cookie": {
      "description": "All request cookie parameters",
      "targets": [{
        "formats": [oas2],
        "given": ["$..parameters[?(@ && @.in==\"cookie\")]"]
      }, {
        "formats": [oas3],
        "given": ["$..parameters[?(@ && @.in==\"cookie\")]"]
      }]
    },
    "Request_Parameter_Path": {
      "description": "All request path parameters",
      "targets": [{
        "formats": [oas2],
        "given": ["$..parameters[?(@ && @.in==\"path\")]"]
      }, {
        "formats": [oas3],
        "given": ["$..parameters[?(@ && @.in==\"path\")]"]
      }]
    },
    "Path_Object": {
      "description": "Path object. Usually used to target the Path key e.g. `/users/{userId}`",
      "targets": [{
        "formats": [oas2],
        "given": ["$.paths"]
      }, {
        "formats": [oas3],
        "given": ["$.paths"]
      }]
    },
    "All_Example_Schema": {
      "description": "All examples for schemas",
      "targets": [{
        "formats": [oas2],
        "given": ["$..definitions..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]", "$..parameters..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]", "$..responses..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]"]
      }, {
        "formats": [oas3],
        "given": ["$.components.schemas..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]", "$..content..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]", "$..headers..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]", "$..parameters..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]"]
      }]
    },
    "API_Document_RecursiveSearch": {
      "description": "The complete API specification document. This can be used to target any part of the OpenAPI document using **field**.\n\n*Use this if you don't find specific targets that cater to your usecase.* ",
      "targets": [{
        "formats": [oas2],
        "given": ["$.."]
      }, {
        "formats": [oas3],
        "given": ["$.."]
      }]
    },
    "All_Example": {
      "description": "All examples across the API document",
      "targets": [{
        "formats": [oas2],
        "given": ["$..examples[*]"]
      }, {
        "formats": [oas3],
        "given": ["$.components.examples[*]", "$.paths[*][*]..content[*].examples[*]", "$.paths[*][*]..parameters[*].examples[*]", "$.components.parameters[*].examples[*]", "$.paths[*][*]..headers[*].examples[*]", "$.components.headers[*].examples[*]"]
      }]
    },
    "All_Example_Media": {
      "description": "All examples for schemas",
      "targets": [{
        "formats": [oas2],
        "given": ["$..responses..[?(@ && @.schema && @.examples)]"]
      }, {
        "formats": [oas3],
        "given": ["$..content..[?(@ && @.schema && (@.example !== void 0 || @.examples))]", "$..headers..[?(@ && @.schema && (@.example !== void 0 || @.examples))]", "$..parameters..[?(@ && @.schema && (@.example !== void 0 || @.examples))]"]
      }]
    },
    "API_Tags_Item": {
      "description": "Tags on an API object",
      "targets": [{
        "formats": [oas2],
        "given": ["$.tags[*]"]
      }, {
        "formats": [oas3],
        "given": ["$.tags[*]"]
      }]
    },
    "All_Enum_Value": {
      "description": "All enum values throughout the API",
      "targets": [{
        "formats": [oas2],
        "given": ["$..[?(@ && @.enum)].enum[*]"]
      }, {
        "formats": [oas3],
        "given": ["$..[?(@ && @.enum)].enum[*]"]
      }]
    },
    "Link_Object": {
      "description": "",
      "targets": [{
        "formats": [oas3],
        "given": ["$.components.links[*]", "#Response_All_Object.links[*]"]
      }]
    },
    "API_Server": {
      "description": "API hosts defined in the API specification",
      "targets": [{
        "formats": [oas3],
        "given": ["$.servers"]
      }, {
        "formats": [oas2],
        "given": ["$.host"]
      }]
    },
    "All_Array_Item": {
      "description": "",
      "targets": [{
        "formats": [oas2],
        "given": ["$..[?(@ && @.type=='array')]"]
      }, {
        "formats": [oas3],
        "given": ["$..[?(@ && @.type=='array')]"]
      }, {
        "formats": [oas3_0],
        "given": ["$..[?(@ && @.type=='array')]", "$..[?(@ && @.type && @.type.constructor.name === 'Array' && @.type.includes('array'))]"]
      }]
    }
  },
  "rules": {
    "contact-url": {
      "given": ["#API_Contact"],
      "severity": "warn",
      "then": {
        "function": truthy,
        "field": "url"
      },
      "description": "The `contact` object should have a valid organization URL. \r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"contact\": {\r\n     ... ,\r\n     \"url\": \"https://acme.com\",\r\n     ... \r\n},\r\n```",
      "message": "Contact object should have \"url\"."
    },
    "contact-email": {
      "given": ["#API_Contact"],
      "severity": "warn",
      "then": {
        "function": truthy,
        "field": "email"
      },
      "description": "The `contact` object should have a valid email. \r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"contact\": {\r\n     ... ,\r\n     ... ,\r\n     \"email\": \"support.contact@acme.com\"\r\n},\r\n```",
      "message": "Contact object should have \"email\""
    },
    "info-contact": {
      "given": ["#API_Document"],
      "severity": "warn",
      "then": {
        "function": truthy,
        "field": "info.contact"
      },
      "description": "The `info' object should include a `contact` object.\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"info\": {\r\n    ... ,\r\n    ... ,\r\n    \"contact\": {\r\n      \"name\": \"ACME Corporation\",\r\n      \"url\": \"https://acme.com\",\r\n      \"email\": \"support.contact@acme.com\"\r\n    }\r\n  } \r\n}\r\n```",
      "message": "Info object should have \"contact\" object."
    },
    "info-description": {
      "given": ["#API_Document"],
      "severity": "warn",
      "then": {
        "function": truthy,
        "field": "info.description"
      },
      "description": "The `info` object should have a `description` object.\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"info\": {\r\n    ... ,\r\n    ... ,\r\n    \"description\": \"This describes my API.\",\r\n    ... \r\n    }\r\n  } \r\n}\r\n```",
      "message": "Info object should have \"description\" object."
    },
    "info-license": {
      "given": ["#API_Document"],
      "severity": "warn",
      "then": {
        "function": truthy,
        "field": "info.license"
      },
      "description": "The `info` object should have a `license` object. \r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"info\": {\r\n    ... ,\r\n    ... ,\r\n    \"license\": {\r\n      \"name\": \"Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)\",\r\n      \"url\": \"https://creativecommons.org/licenses/by-sa/4.0/\"\r\n    }\r\n  } \r\n}\r\n```",
      "message": "Info object should have \"license\" object."
    },
    "license-url": {
      "given": ["#API_License"],
      "severity": "warn",
      "then": {
        "function": truthy,
        "field": "url"
      },
      "description": "The `license` object should include a valid url.\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"license\": {\r\n    \"name\": \"Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)\",\r\n    \"url\": \"https://creativecommons.org/licenses/by-sa/4.0/\"\r\n  }\r\n}\r\n```",
      "message": "License object should include \"url\"."
    },
    "no-eval-in-markdown": {
      "given": ["#All_Markdown"],
      "severity": "warn",
      "then": {
        "function": pattern,
        "functionOptions": {
          "notMatch": "eval\\("
        }
      },
      "description": "Markdown descriptions should not contain [`eval()` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval), which pose a security risk. \r\n\r\n**Invalid Example**\r\n\r\n```json lineNumbers\r\n{  \r\n  \"info\": {\r\n    ... ,\r\n    ... , \r\n    \"description\": \"API for users. eval()\"",
      "message": "Markdown descriptions must not have \"eval(\"."
    },
    "no-script-tags-in-markdown": {
      "given": ["#All_Markdown"],
      "severity": "warn",
      "then": {
        "function": pattern,
        "functionOptions": {
          "notMatch": "<script"
        }
      },
      "description": "Markdown descriptions should not contain `script` tags, which pose a security risk. \r\n\r\n**Invalid Example**\r\n\r\n```json lineNumbers\r\n{  \r\n  \"info\": {\r\n    ... ,\r\n    ... , \r\n    \"description\": \"API for users. <script>alert(\"You are Hacked\");</script>',\"\r\n```",
      "message": "Markdown descriptions must not have \"<script>\" tags."
    },
    "openapi-tags-alphabetical": {
      "given": ["#API_Document"],
      "severity": "warn",
      "then": {
        "function": alphabetical,
        "functionOptions": {
          "keyedBy": "name"
        },
        "field": "tags"
      },
      "description": "Global tags specified at the root OpenAPI Document level should be in alphabetical order based on the `name` property.\r\n\r\n**Invalid Example**\r\n\r\n```json lineNumbers\r\n{\r\n   \"tags\":[\r\n      {\r\n         \"name\":\"Z Global Tag\"\r\n      },\r\n      {\r\n         \"name\":\"A Global Tag\"\r\n      }\r\n   ]\r\n}\r\n```\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n   \"tags\":[\r\n      {\r\n         \"name\":\"A Global Tag\"\r\n      },\r\n      {\r\n         \"name\":\"Z Global Tag\"\r\n      }\r\n   ]\r\n}\r\n```",
      "message": "OpenAPI object should have alphabetical \"tags\"."
    },
    "openapi-tags": {
      "given": ["#API_Document"],
      "severity": "warn",
      "then": {
        "function": schema,
        "functionOptions": {
          "schema": {
            "type": "array",
            "minItems": 1
          }
        },
        "field": "tags"
      },
      "description": "At least one global tag should be specified at the root OpenAPI Document level.\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n   \"tags\":[\r\n      {\r\n         \"name\":\"Global Tag #1\"\r\n      },\r\n      {\r\n         \"name\":\"Global Tag #2\"\r\n      }\r\n   ]\r\n}\r\n```",
      "message": "OpenAPI object should have non-empty \"tags\" array."
    },
    "operation-description": {
      "given": ["#Operation_Object"],
      "severity": "info",
      "then": {
        "function": truthy,
        "field": "description"
      },
      "description": "Each operation should have a description. \r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"get\": {\r\n    ... ,\r\n    \"description\": \"Get a list of users.\",\r\n    ... ,\r\n    ... ,\r\n  }\r\n}\r\n```",
      "message": "Operation \"description\" should be present and non-empty string."
    },
    "operation-operationId": {
      "given": ["#Operation_Object"],
      "severity": "warn",
      "then": {
        "function": truthy,
        "field": "operationId"
      },
      "description": "All operations should have an `operationId`.\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"get\": {\r\n        \"summary\": \"Get users\",\r\n        ... ,\r\n        \"operationId\": \"get-users\"\r\n      }\r\n}\r\n```",
      "message": "Operation should have \"operationId\"."
    },
    "operation-operationId-valid-in-url": {
      "given": ["#Operation_Object"],
      "severity": "error",
      "then": {
        "function": pattern,
        "functionOptions": {
          "match": "^[A-Za-z0-9-._~:/?#\\[\\]@!\\$&'()*+,;=]*$"
        },
        "field": "operationId"
      },
      "description": "Operation IDs must not contain characters that are invalid for URLs. \r\n\r\n**Invalid Example**\r\n\r\nThe `operationId` in this example includes a pipe and space, which are invalid for URLs.\r\n\r\n```json lineNumbers\r\n{\r\n    \"/users\": {\r\n      \"get\": {\r\n        ... ,\r\n         \"operationId\": \"invalid|operationID \",\r\n         ... ,\r\n      }\r\n    }\r\n}\r\n```\r\n\r\n**Valid Example**\r\n\r\nThis `operationId` is valid for URLs.\r\n\r\n```json lineNumbers\r\n{\r\n    \"/users\": {\r\n      \"get\": {\r\n        ... ,\r\n         \"operationId\": \"this-must-be-unique\",\r\n         ... ,\r\n      }\r\n    }\r\n}\r\n```",
      "message": "OperationId should not have characters that are invalid when used in URL."
    },
    "operation-singular-tag": {
      "given": ["#API_Tags"],
      "severity": "off",
      "then": {
        "function": length,
        "functionOptions": {
          "max": 1
        }
      },
      "description": "Operation should not have more than a single tag.",
      "message": "Operation should not have more than a single tag."
    },
    "operation-tags": {
      "given": ["#Operation_Object"],
      "severity": "warn",
      "then": {
        "function": length,
        "functionOptions": {
          "max": 999,
          "min": 1
        },
        "field": "tags"
      },
      "description": "At least one tag should be defined for each operation.\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"get\": {\r\n     ... ,\r\n     ... ,\r\n     \"tags\": [\r\n        \"Users\"\r\n     ],\r\n  }\r\n}",
      "message": "Operation should have non-empty \"tags\" array."
    },
    "path-declarations-must-exist": {
      "given": ["#Path_Item"],
      "severity": "error",
      "then": {
        "function": pattern,
        "functionOptions": {
          "notMatch": "{}"
        },
        "field": "@key"
      },
      "description": "Path parameter declarations must not be empty.\r\n\r\n**Invalid Example**\r\n\r\n`/users/{}`\r\n\r\n**Valid Example**\r\n\r\n`/users/{userId}`",
      "message": "Path parameter declarations must not be empty, ex.\"/given/{}\" is invalid."
    },
    "contact-name": {
      "given": ["#API_Contact"],
      "severity": "warn",
      "then": {
        "function": truthy,
        "field": "name"
      },
      "description": "The `contact` object should have an organization name. \r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"contact\": {\r\n    \"name\": \"ACME Corporation\",\r\n     ... ,\r\n     ... \r\n},\r\n```\r\n",
      "message": "Contact object should have \"name\""
    },
    "path-keys-no-trailing-slash": {
      "given": ["#Path_Object"],
      "severity": "warn",
      "then": {
        "function": pattern,
        "functionOptions": {
          "notMatch": ".+\\/$"
        },
        "field": "@key"
      },
      "description": "Path keys should not end in forward slashes. This is a best practice for working with web tooling, such as mock servers, code generators, application frameworks, and more).\r\n\r\n**Invalid Example**\r\n\r\n```json\r\n{\r\n \"/users/\": {\r\n```\r\n\r\n**Valid Example**\r\n\r\n```json\r\n{\r\n \"/users\": {\r\n```",
      "message": "Path should not end with slash."
    },
    "path-not-include-query": {
      "given": ["#Path_Object"],
      "severity": "warn",
      "then": {
        "function": pattern,
        "functionOptions": {
          "notMatch": "\\?"
        },
        "field": "@key"
      },
      "description": "Paths should not include `query` string items. Instead, add them as parameters with `in: query`.\r\n\r\n**Invalid Example**\r\n\r\n```json\r\n{\r\n \"/users/{?id}\": {\r\n\r\n```\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"parameters\": [\r\n    {\r\n      \"schema\": {\r\n        \"type\": \"string\"\r\n      },\r\n      \"name\": \"id\",\r\n      \"in\": \"path\",\r\n      \"required\": true,\r\n      \"description\": \"User's ID\"\r\n    }\r\n  ]\r\n}\r\n\r\n```",
      "message": "Path should not include query string."
    },
    "tag-description": {
      "given": ["#API_Tags_Item"],
      "severity": "off",
      "then": {
        "function": truthy,
        "field": "description"
      },
      "description": "Tags defined at the global level should have a description.\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n   \"tags\": [\r\n      {\r\n         \"name\":\"Users\",\r\n         \"description\":\"End-user information\"\r\n      }\r\n   ]\r\n}\r\n```",
      "message": "Tag object should have \"description\"."
    },
    "api-servers": {
      "given": ["#API_Server"],
      "severity": "warn",
      "then": {
        "function": schema,
        "functionOptions": {
          "schema": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object"
            }
          },
          "dialect": "draft7"
        }
      },
      "description": "A server should be defined at the root document level. This can be localhost, a development server, or a production server. \n\n**Valid OpenAPI V3 Example**\n\n```json\n{\n  \"servers\": [\n    {\n      \"url\": \"https://staging.myprodserver.com/v1\",\n      \"description\": \"Staging server\"\n    },\n    {\n      \"url\": \"https://myprodserver.com/v1\",\n      \"description\": \"Production server\"\n    }\n  ]\n}\n```\n\n**Valid OpenAPI V2 Example**\n\n```json\n{\n  \"host\": \"myprodserver.com\",\n  \"basePath\": \"/v2\",\n  \"schemes\": [\n    \"https\"\n  ]\n}\n```\n\n",
      "message": "Server should be present."
    },
    "server-trailing-slash": {
      "given": ["#API_Server_URL"],
      "severity": "warn",
      "then": {
        "function": pattern,
        "functionOptions": {
          "notMatch": "/$"
        }
      },
      "description": "Server URLs should not end in forward slashes. This is a best practice for working with web tooling, such as mock servers, code generators, application frameworks, and more).\r\n\r\n**Invalid Example**\r\n\r\n```json lineNumbers\r\n{  \r\n  \"servers\": [\r\n    {\r\n      ... ,\r\n      \"url\": \"https://api.openweathermap.org/data/2.5/\"\r\n    }\r\n  ]\r\n}\r\n```\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{  \r\n  \"servers\": [\r\n    {\r\n      ... ,\r\n      \"url\": \"https://api.openweathermap.org/data/2.5\"\r\n    }\r\n  ]\r\n}\r\n```",
      "message": "Server URL should not have trailing slash"
    },
    "operation-success-response": {
      "given": ["#Operation_Object"],
      "severity": "warn",
      "then": {
        "function": oasOpSuccessResponse,
        "field": "responses"
      },
      "description": "Operations should have at least one \"2xx\" or \"3xx\" response defined.\r\n\r\n**Invalid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"get\": {\r\n      ... ,\r\n      \"responses\": {},\r\n  }\r\n}\r\n```\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"get\": {\r\n      ... ,\r\n      \"responses\": {\r\n        \"200\": {\r\n          \"description\": \"OK\"\r\n        }\r\n      },\r\n  }\r\n}\r\n```",
      "message": "Operation should have at least one \"2xx\" or \"3xx\" response."
    },
    "path-params": {
      "given": ["#API_Document"],
      "severity": "error",
      "then": {
        "function": oasPathParam
      },
      "description": "Path parameters must be defined and valid in either the `path-parameters` or the `operation-parameters` object. Likewise, defined `path-parameters` or `operation-parameters` must be used in the `paths` string.\r\n\r\n**Valid Example**\r\n\r\nFor this path:\r\n\r\n`/users/{id}/{location}`\r\n\r\nThe following path parameters must be defined.\r\n\r\n```json lineNumbers\r\n      \"parameters\": [\r\n        {\r\n          \"schema\": {\r\n            \"type\": \"string\"\r\n          },\r\n          \"name\": \"id\",\r\n          \"in\": \"path\",\r\n          \"required\": true,\r\n          \"description\": \"This is the user's ID\"\r\n        },\r\n        {\r\n          \"schema\": {\r\n            \"type\": \"string\"\r\n          },\r\n          \"name\": \"location\",\r\n          \"in\": \"path\",\r\n          \"required\": true,\r\n          \"description\": \"This is the user's location\"\r\n        }\r\n      ]\r\n    }\r\n  },\r\n  ```",
      "message": "{{error}}"
    },
    "operation-parameters": {
      "given": ["#Operation_Object"],
      "severity": "warn",
      "then": {
        "function": oasOpParams,
        "field": "parameters"
      },
      "description": "Operation parameters should be unique and non-repeating:\r\n\r\n* `name` and `in` must be unique\r\n\r\nFor OAS2:\r\n\r\n* Operations should not have `in: body` and `in: formData` parameters.\r\n* Operations should have only one `in: body` parameter.\r\n\r\n**Invalid Example**\r\n\r\nIn this example, the query paramater `\"name\": \"last name\"` is repeated.\r\n\r\n```json lineNumbers\r\n{\r\n  \"parameters\": [\r\n    {\r\n      \"schema\": {\r\n        \"type\": \"string\"\r\n      },\r\n      \"in\": \"query\",\r\n      \"name\": \"last name\",\r\n      \"description\": \"User's last name\"\r\n    },\r\n    {\r\n      \"schema\": {\r\n        \"type\": \"string\"\r\n      },\r\n      \"in\": \"query\",\r\n      \"name\": \"last name\",\r\n      \"description\": \"User's last name\"\r\n    }\r\n  ],\r\n}\r\n```\r\n\r\n**Valid Example**\r\n\r\nIn this example, query parameters are unique.\r\n\r\n```json lineNumbers\r\n{\r\n  \"parameters\": [\r\n    {\r\n      \"schema\": {\r\n        \"type\": \"string\"\r\n      },\r\n      \"in\": \"query\",\r\n      \"name\": \"first name\",\r\n      \"description\": \"User's first name\"\r\n    },\r\n    {\r\n      \"schema\": {\r\n        \"type\": \"string\"\r\n      },\r\n      \"in\": \"query\",\r\n      \"name\": \"last name\",\r\n      \"description\": \"User's last name\"\r\n    }\r\n  ],\r\n}\r\n```",
      "message": "Operation parameters are unique and non-repeating."
    },
    "typed-enum": {
      "given": ["$..[?(@ && @.enum && @.type)]"],
      "severity": "warn",
      "then": {
        "function": typedEnum
      },
      "description": "All `enum' values should respect the specified type.\r\n\r\n**Invalid Example**\r\n\r\nIn this example, the `enum` type is `integer`, but the values are strings.\r\n\r\n```json lineNumbers\r\n{\r\n    \"schema\": {\r\n      \"type\": \"integer\",\r\n      \"enum\": [\r\n         \"standard\",\r\n         \"metric\",\r\n         \"imperial\"\r\n       ]\r\n     },\r\n```\r\n\r\n**Valid Example**\r\n\r\nIn this example, the `enum` type is `string` and the values are strings.\r\n\r\n```json lineNumbers\r\n{\r\n    \"schema\": {\r\n      \"type\": \"string\",\r\n      \"enum\": [\r\n         \"standard\",\r\n         \"metric\",\r\n         \"imperial\"\r\n       ]\r\n     },",
      "message": "{{error}}"
    },
    "oas2-schema": {
      "given": ["#API_Document"],
      "severity": "error",
      "then": {
        "function": oasDocumentSchema
      },
      "description": "This Stoplight core rule validates the structure of OpenAPI v2 specification. This rule should never be disabled.",
      "message": "{{error}}",
      "formats": [oas2]
    },
    "oas3-schema": {
      "given": ["#API_Document"],
      "severity": "error",
      "then": {
        "function": oasDocumentSchema
      },
      "description": "This Stoplight core rule validates the structure of OpenAPI v3.x specification. This rule should never be disabled.",
      "message": "{{error}}",
      "formats": [oas3]
    },
    "oas3-unused-component": {
      "given": ["#API_Document"],
      "severity": "warn",
      "then": {
        "function": oasUnusedComponent
      },
      "description": "A potentially shareable component is not being used. This may be expected, but you should review sharable components to avoid duplicate entry.",
      "message": "{{error}}",
      "formats": [oas3]
    },
    "operation-operationId-unique": {
      "given": ["#API_Document"],
      "severity": "error",
      "then": {
        "function": oasOpIdUnique
      },
      "description": "Every operation in a single document must have a unique `operationID`.\r\n\r\n**Valid Example**\r\n\r\nIn this example, the `operationId` is `get-users`. This `operationId` must be unique in an API document.\r\n\r\n```json lineNumbers\r\n{\r\n  \"get\": {\r\n        \"summary\": \"Get users\",\r\n        ... ,\r\n        \"operationId\": \"get-users\"\r\n      }\r\n}\r\n```\r\n",
      "message": "Every operation must have unique operationId"
    },
    "oas2-operation-formData-consume-check": {
      "given": ["#Operation_Object"],
      "severity": "error",
      "then": {
        "function": oasOpFormDataConsumeCheck
      },
      "description": "Operations with an `in: formData` parameter must include a `consumes` property with one of these values:\r\n\r\n`application/x-www-form-urlencoded`\r\n\r\n`multipart/form-data`\r\n\r\n**Valid Example**\r\n\r\nIn this example, the `consumes` property correctly includes the `multipart/form-data` value.\r\n\r\n```json lineNumbers\r\n{\r\n   \"post\":{\r\n      \"summary\":\"Uploads a file\",\r\n      \"consumes\":[\r\n         \"multipart/form-data\"\r\n      ],\r\n      \"parameters\":[\r\n         {\r\n            \"name\":\"name\",\r\n            \"in\":\"formData\",\r\n            \"description\":\"Upload a file\",\r\n            \"required\":false,\r\n            \"type\":\"string\"\r\n         }\r\n      ]\r\n   }\r\n}",
      "message": "Operations with \"in: formData\" parameter must include \"application/x-www-form-urlencoded\" or \"multipart/form-data\" in their \"consumes\" property.",
      "formats": [oas2]
    },
    "operation-tag-defined": {
      "given": ["#API_Document"],
      "severity": "error",
      "then": {
        "function": oasTagDefined
      },
      "description": "Tags defined at the operation level should also be defined at the global level. \r\n\r\n**Operation-level Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"get\": {\r\n     ... ,\r\n     ... ,\r\n     \"tags\": [\r\n        \"Users\"\r\n     ],\r\n  }\r\n}  \r\n```\r\n\r\n**Global-level Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"tags\": [\r\n     {\r\n       \"name\": \"Users\",\r\n       ... ,\r\n     }\r\n  ],\r\n}\r\n\r\n```",
      "message": "Operation tags must be defined in global tags"
    },
    "no-$ref-siblings": {
      "given": ["#All_Ref"],
      "severity": "error",
      "then": {
        "function": refSiblings
      },
      "description": "Property must not be placed among $ref.",
      "message": "{{error}}",
      "formats": [oas3_0, oas2]
    },
    "oas2-operation-security-defined": {
      "given": ["#API_Document"],
      "severity": "warn",
      "then": {
        "function": oasOpSecurityDefined,
        "functionOptions": {
          "schemesPath": ["securityDefinitions"]
        }
      },
      "description": "Operation `security` values must match a scheme defined in the global `securityDefinitions` object. Empty `security` values for operations are ignored if authentication is not explicity required or is optional.\r\n\r\n**Valid Example**\r\n\r\nFor this global security scheme:\r\n\r\n```json lineNumbers\r\n{\r\n  \"securityDefinitions\": {\r\n    \"API Key\": {\r\n      \"name\": \"API Key\",\r\n      \"type\": \"apiKey\",\r\n      \"in\": \"query\"\r\n    }\r\n  }\r\n}\r\n```\r\n\r\nThis is a valid operation security value:\r\n\r\n```json lineNumbers\r\n{  \"operationId\": \"get-users-userId\",\r\n        \"security\": [\r\n          {\r\n            \"API Key\": []\r\n          }\r\n        ]\r\n}\r\n```\r\n\r\n**Invalid Example**\r\n\r\nFor the same global security scheme, this is an invalid operation security value:\r\n\r\n```json lineNumbers\r\n{  \"operationId\": \"get-users-userId\",\r\n        \"security\": [\r\n          {\r\n            \"oath2\": []\r\n          }\r\n        ]\r\n}\r\n```",
      "message": "{{error}}",
      "formats": [oas2]
    },
    "oas3-operation-security-defined": {
      "given": ["#API_Document"],
      "severity": "warn",
      "then": {
        "function": oasOpSecurityDefined,
        "functionOptions": {
          "schemesPath": ["components", "securitySchemes"]
        }
      },
      "description": "Operation `security` values must match a scheme defined in the global `components.security.Schemes` object. \r\n\r\n**Valid Example**\r\n\r\nFor this global security scheme:\r\n\r\n```json lineNumbers\r\n{\r\n\"components\": {\r\n  \"security\": [\r\n    {\r\n      \"app-id\": []\r\n    }\r\n  ]\r\n }\r\n}\r\n```\r\n\r\n`app-id` is a valid operation `security` value:\r\n\r\n```json lineNumbers\r\n{  \r\n    \"get\": {\r\n        \"security\": [\r\n          {\r\n            \"app-id\": []\r\n          }\r\n      ]\r\n  }\r\n}  \r\n```\r\n\r\n**Invalid Example**\r\n\r\nFor the same global security scheme, `oath2` is an invalid operation `security` value:\r\n\r\n```json lineNumbers\r\n{  \r\n    \"get\": {\r\n        \"security\": [\r\n          {\r\n            \"oath2\": []\r\n          }\r\n      ]\r\n  }\r\n}  \r\n```",
      "message": "{{error}}",
      "formats": [oas3]
    },
    "duplicated-entry-in-enum": {
      "given": ["#All_Enum_Object"],
      "severity": "warn",
      "then": {
        "function": oasSchema,
        "functionOptions": {
          "schema": {
            "type": "array",
            "uniqueItems": true
          }
        },
        "field": "enum"
      },
      "description": "All enum values should be unique.\r\n\r\n**Invalid Example**\r\n\r\nThere are two `json` enum values.\r\n\r\n```json lineNumbers\r\n{\r\n  \"schema\":{\r\n     \"type\":\"string\",\r\n       \"enum\":[\r\n          \"json\",\r\n          \"json\",\r\n          \"html\"\r\n   ]\r\n }\r\n}\r\n```\r\n**Valid Example**\r\n\r\nAll enum values are unique.\r\n\r\n```json lineNumbers\r\n{\r\n  \"schema\":{\r\n     \"type\":\"string\",\r\n       \"enum\":[\r\n          \"json\",\r\n          \"xml\",\r\n          \"html\"\r\n   ]\r\n }\r\n}\r\n```",
      "message": "{{error}}"
    },
    "oas2-api-schemes": {
      "given": ["#API_Document"],
      "severity": "error",
      "then": {
        "function": schema,
        "functionOptions": {
          "schema": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "string"
            }
          },
          "dialect": "draft7"
        },
        "field": "schemes"
      },
      "description": "OpenAPI 2 host `schemes` reflect the transfer protocol of the API. Host schemes must be present and an array with one or more of these values: `http`, `https`, `ws`, or `wss`.\r\n\r\n**Valid Example**\r\n\r\nThis example shows that host schemes are `http` and `https`.\r\n\r\n```json\r\n{\r\n   \"schemes\":[\r\n      \"http\",\r\n      \"https\"\r\n   ]\r\n}\r\n \r\n```",
      "message": "OpenAPI host \"schemes\" must be present and non-empty array",
      "formats": [oas2]
    },
    "oas2-discriminator": {
      "given": ["#API_Document"],
      "severity": "error",
      "then": {
        "function": oasDiscriminator,
        "field": "definitions[?(@.discriminator)]"
      },
      "description": "Discriminator property must be defined and required",
      "message": "Discriminator property must be defined and required",
      "formats": [oas2]
    },
    "server-not-example": {
      "given": ["#API_Server_URL"],
      "severity": "warn",
      "then": {
        "function": pattern,
        "functionOptions": {
          "notMatch": "example.com"
        }
      },
      "description": "Server URLs must not direct to example.com. This helps ensure URLs are valid before you distribute your API document.\r\n\r\n**Invalid Example**\r\n\r\n```json lineNumbers\r\n{  \r\n  \"servers\": [\r\n    {\r\n      ... ,\r\n      \"url\": \"https://example.com\"\r\n    }\r\n  ]\r\n}\r\n```\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{  \r\n  \"servers\": [\r\n    {\r\n      ... ,\r\n      \"url\": \"https://api.openweathermap.org/data/2.5\"\r\n    }\r\n  ]\r\n}\r\n```",
      "message": "Server URL must not point at example.com."
    },
    "parameter-description": {
      "given": ["#Request_Parameter_All"],
      "severity": "info",
      "then": {
        "function": truthy,
        "field": "description"
      },
      "description": "All `parameter` objects should have a description.\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"parameters\": [\r\n    {\r\n      \"schema\": {\r\n        \"type\": \"integer\"\r\n      },\r\n      ... ,\r\n      ... ,\r\n      \"description\": \"The number of days to include in the response.\"\r\n    }\r\n}\r\n```\r\n",
      "message": "Parameter objects must have \"description\"."
    },
    "oas2-anyOf": {
      "given": ["#API_Document_RecursiveSearch"],
      "severity": "warn",
      "then": {
        "function": undefined$1,
        "field": "anyOf"
      },
      "description": "The `anyOf` keyword is not supported in OAS2. Only `allOf` is supported.\r\n\r\n**Invalid Example**\r\n\r\n```json lineNumbers\r\n{\r\n   \"schema\": {\r\n     \"anyOf\": [\r\n       {\r\n         \"properties\": {\r\n           \"firstName\": {\r\n             \"type\": \"string\"\r\n            },\r\n           \"lastName\": {\r\n             \"type\": \"string\"\r\n            }\r\n          }\r\n        },\r\n        {}\r\n      ],\r\n   }\r\n}\r\n```\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"schema\": {\r\n              \"type\": \"object\",\r\n              \"properties\": {\r\n                \"firstName\": {\r\n                  \"type\": \"string\"\r\n                },\r\n                \"lastName\": {\r\n                  \"type\": \"string\"\r\n                }\r\n             },\r\n           }\r\n}\r\n```",
      "message": "anyOf is not available in OpenAPI v2, it was added in OpenAPI v3",
      "formats": [oas2]
    },
    "oas2-oneOf": {
      "given": ["#API_Document_RecursiveSearch"],
      "severity": "warn",
      "then": {
        "function": undefined$1,
        "field": "oneOf"
      },
      "description": "The `oneOf` keyword is not supported in OAS2. Only `allOf` is supported.\r\n\r\n**Invalid Example**\r\n\r\n```json lineNumbers\r\n{\r\n   \"schema\": {\r\n     \"oneOf\": [\r\n       {\r\n         \"properties\": {\r\n           \"firstName\": {\r\n             \"type\": \"string\"\r\n            },\r\n           \"lastName\": {\r\n             \"type\": \"string\"\r\n            }\r\n          }\r\n        },\r\n        {}\r\n      ],\r\n   }\r\n}\r\n```\r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n  \"schema\": {\r\n              \"type\": \"object\",\r\n              \"properties\": {\r\n                \"firstName\": {\r\n                  \"type\": \"string\"\r\n                },\r\n                \"lastName\": {\r\n                  \"type\": \"string\"\r\n                }\r\n             },\r\n           }\r\n}\r\n```",
      "message": "oneOf is not available in OpenAPI v2, it was added in OpenAPI v3",
      "formats": [oas2]
    },
    "oas3-examples-value-or-externalValue": {
      "given": ["#All_Example"],
      "severity": "warn",
      "then": {
        "function": xor,
        "functionOptions": {
          "properties": ["externalValue", "value"]
        }
      },
      "description": "The `examples` object should include a `value` or `externalValue` field, but cannot include both.\r\n\r\n**Invalid Example**\r\n\r\nThis example includes both a `value` field and an `externalValue` field.\r\n\r\n```json lineNumbers\r\n{\r\n    \"examples\": {\r\n      \"example-1\": {\r\n        \"value\": {\r\n          \"id\": \"string\",\r\n          \"name\": \"string\"\r\n       },\r\n        \"externalValue\": {\r\n          \"id\": \"string\",\r\n           \"name\": \"string\"\r\n         }\r\n      }\r\n   }\r\n}\r\n```\r\n\r\n**Valid Example** \r\n\r\nThis example includes only a `value` field.\r\n\r\n```json lineNumbers\r\n{\r\n     \"examples\": {\r\n       \"example-1\": {\r\n         \"value\": {\r\n            \"id\": \"string\",\r\n            \"name\": \"string\"\r\n       }\r\n    }\r\n  }\r\n}",
      "message": "Examples must have either \"value\" or \"externalValue\" field.",
      "formats": [oas3]
    },
    "oas2-valid-schema-example": {
      "given": ["#All_Example_Schema"],
      "severity": "error",
      "then": {
        "function": oasExample,
        "functionOptions": {
          "oasVersion": 2,
          "schemaField": "$",
          "type": "schema"
        }
      },
      "description": "Examples must be valid against their defined schema. \r\n\r\n**Valid Example**\r\n\r\nThe following schema includes the `name` and `petType` properties.  \r\n\r\n```json lineNumbers\r\n{\r\n   \"Pet\":{\r\n      \"type\":\"object\",\r\n      \"properties\":{\r\n         \"name\":{\r\n            \"type\":\"string\"\r\n         },\r\n         \"petType\":{\r\n            \"type\":\"string\"\r\n         }\r\n      }\r\n   }\r\n}\r\n```\r\n\r\nWhen referenced in a response example, the property names on line 6 and 7 must match those in the schema (`petName` and `petType`).\r\n\r\n```json lineNumbers\r\n{\r\n   \"responses\":{\r\n      \"200\":{\r\n         \"content\":{\r\n            \"application/json\":{\r\n               \"examples\":{\r\n                  \"Pet Example\":{\r\n                     \"petName\":\"Bubbles\",\r\n                     \"petType\":\"Dog\"\r\n                  }\r\n               },\r\n               \"schema\":{\r\n                  \"$ref\":\"#/definitions/Pet\"\r\n               }\r\n            }\r\n         }\r\n      }\r\n   }\r\n}\r\n```",
      "message": "{{error}}",
      "formats": [oas2]
    },
    "oas3-valid-schema-example": {
      "given": ["#All_Example_Schema"],
      "severity": "error",
      "then": {
        "function": oasExample,
        "functionOptions": {
          "oasVersion": 3,
          "schemaField": "$",
          "type": "schema"
        }
      },
      "description": "Examples must be valid against their defined schema. \r\n\r\n**Valid Example**\r\n\r\nThe following schema includes the `name` and `petType` properties.  \r\n\r\n```json lineNumbers\r\n{\r\n   \"Pet\":{\r\n      \"type\":\"object\",\r\n      \"properties\":{\r\n         \"name\":{\r\n            \"type\":\"string\"\r\n         },\r\n         \"petType\":{\r\n            \"type\":\"string\"\r\n         }\r\n      }\r\n   }\r\n}\r\n```\r\n\r\nWhen referenced in a response example, the property names on line 6 and 7 must match those in the schema (`petName` and `petType`).\r\n\r\n```json lineNumbers\r\n{\r\n   \"responses\":{\r\n      \"200\":{\r\n         \"content\":{\r\n            \"application/json\":{\r\n               \"examples\":{\r\n                  \"Pet Example\":{\r\n                     \"petName\":\"Bubbles\",\r\n                     \"petType\":\"Dog\"\r\n                  }\r\n               },\r\n               \"schema\":{\r\n                  \"$ref\":\"#/definitions/Pet\"\r\n               }\r\n            }\r\n         }\r\n      }\r\n   }\r\n}\r\n```",
      "message": "{{error}}",
      "formats": [oas3]
    },
    "oas2-valid-media-example": {
      "given": ["#All_Example_Media"],
      "severity": "error",
      "then": {
        "function": oasExample,
        "functionOptions": {
          "oasVersion": 2,
          "schemaField": "schema",
          "type": "media"
        }
      },
      "description": "Examples must be valid against their defined schema. Common reasons you may see errors if:\r\n\r\n* The value used for property examples is not the same type indicated in the schema (string vs. integer, for example).\r\n* Examples contain properties not included in the schema.\r\n\r\n**Valid Example**\r\n\r\nThe following schema indicates that the `id` property is a `string` type.  \r\n\r\n```json lineNumbers\r\n\"User\":{\r\n   \"title\":\"User\",\r\n   \"type\":\"object\",\r\n   \"properties\":{\r\n      \"id\":{\r\n         \"type\":\"string\"\r\n      }\r\n   }\r\n}\r\n```\r\nWhen the example is referenced in a response, the `id` property must be `string`.\r\n\r\n```json lineNumbers\r\n{\r\n   \"responses\":{\r\n      \"200\":{\r\n         \"description\":\"User Found\",\r\n         \"schema\":{\r\n            \"$ref\":\"#/definitions/User\"\r\n         },\r\n         \"examples\":{\r\n            \"Get User Alice Smith\":{\r\n               \"id\": \"smith, alice\",\r\n            }\r\n         }\r\n      },\r\n```",
      "message": "{{error}}",
      "formats": [oas2]
    },
    "oas3-valid-media-example": {
      "given": ["#All_Example_Media"],
      "severity": "error",
      "then": {
        "function": oasExample,
        "functionOptions": {
          "oasVersion": 3,
          "schemaField": "schema",
          "type": "media"
        }
      },
      "description": "The following schema includes the `name` and `petType` properties.  \r\n\r\n**Valid Example**\r\n\r\n```json lineNumbers\r\n{\r\n   \"Pet\":{\r\n      \"type\":\"object\",\r\n      \"properties\":{\r\n         \"name\":{\r\n            \"type\":\"string\"\r\n         },\r\n         \"petType\":{\r\n            \"type\":\"string\"\r\n         }\r\n      }\r\n   }\r\n}\r\n```\r\n\r\nWhen referenced in a response example, the property names on line 6 and 7 must match those in the schema (`petName` and `petType`).\r\n\r\n```json lineNumbers\r\n{\r\n   \"responses\":{\r\n      \"200\":{\r\n         \"content\":{\r\n            \"application/json\":{\r\n               \"examples\":{\r\n                  \"Pet Example\":{\r\n                     \"petName\":\"Bubbles\",\r\n                     \"petType\":\"Dog\"\r\n                  }\r\n               },\r\n               \"schema\":{\r\n                  \"$ref\":\"#/definitions/Pet\"\r\n               }\r\n            }\r\n         }\r\n      }\r\n   }\r\n}\r\n```",
      "message": "{{error}}",
      "formats": [oas3]
    },
    "oas3-server-variables": {
      "given": ["#All_Servers"],
      "severity": "error",
      "then": {
        "function": serverVariables$1,
        "functionOptions": {
          "checkSubstitutions": true
        }
      },
      "description": "This rule ensures that server variables defined in OpenAPI Specification 3 (OAS3) and 3.1 are valid, not unused, and result in a valid URL. Properly defining and using server variables is crucial for the accurate representation of API endpoints and preventing potential misconfigurations or security issues.\n\n**Recommended**: Yes\n\n**Bad Examples**\n\n1. **Missing definition for a URL variable**:\n\n```yaml\nservers:\n  - url: \"https://api.{region}.example.com/v1\"\n    variables:\n      version:\n        default: \"v1\"\n```\n\nIn this example, the variable **`{region}`** in the URL is not defined within the **`variables`** object.\n\n2. **Unused URL variable:**\n\n```yaml\nservers:\n  - url: \"https://api.example.com/v1\"\n    variables:\n      region:\n        default: \"us-west\"\n```\n\nHere, the variable **`region`** is defined but not used in the server URL.\n\n3. **Invalid default value for an allowed value variable**:\n\n```yaml\nservers:\n  - url: \"https://api.{region}.example.com/v1\"\n    variables:\n      region:\n        default: \"us-south\"\n        enum:\n          - \"us-west\"\n          - \"us-east\"\n```\n\nThe default value 'us-south' isn't one of the allowed values in the **`enum`**.\n\n4. **Invalid resultant URL**:\n\n```yaml\nservers:\n  - url: \"https://api.example.com:{port}/v1\"\n    variables:\n      port:\n        default: \"8o80\"\n```\n\nSubstituting the default value of **`{port}`** results in an invalid URL.\n\n**Good Example**\n\n```yaml\nservers:\n  - url: \"https://api.{region}.example.com/{version}\"\n    variables:\n      region:\n        default: \"us-west\"\n        enum:\n          - \"us-west\"\n          - \"us-east\"\n      version:\n        default: \"v1\"\n```\n\nIn this example, both **`{region}`** and **`{version}`** variables are properly defined and used in the server URL. Also, the default value for **`region`** is within the allowed values.",
      "message": "{{error}}",
      "formats": [oas3]
    },
    "array-items": {
      "given": ["#All_Array_Item"],
      "severity": "error",
      "then": {
        "function": truthy,
        "field": "items"
      },
      "description": "Schemas with `type: array`, require a sibling `items` field.\n\n**Recommended:** Yes\n\n**Good Example**\n\n```yaml\nTheGoodModel:\n  type: object\n  properties:\n    favoriteColorSets:\n      type: array\n      items:\n        type: array\n        items: {}\n```\n\n**Bad Example**\n\n```yaml\nTheBadModel:\n  type: object\n  properties:\n    favoriteColorSets:\n      type: array\n      items:\n        type: array\n```",
      "message": "Schemas with \"type: array\", require a sibling \"items\" field"
    }
  }
};

export { _spectral as default };
