---
title: Plugin API
description: Documentation and examples of the aws-lite plugin API
---
# Plugin API

## Introduction

Out of the box, [`@aws-lite/client`](https://www.npmjs.com/package/@aws-lite/client) is a full-featured AWS API client that you can use to interact with any AWS service that makes use of [authentication via AWS signature v4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html) (which should be just about all of them).

`@aws-lite/client` can be extended with plugins to more easily interact with AWS services, or provide custom behavior or semantics. As such, plugins enable you to have significantly more control over the entire API request/response lifecycle.

A bit more about how plugins work:

- Plugins can be authored in ESM or CJS
- Plugins can be dependencies downloaded from npm, or also live locally in your codebase
- In conjunction with the open source community, `aws-lite` publishes service plugins under the `@aws-lite/$service` namespace that [conform to `aws-lite` standards](/contributing)
- `@aws-lite/*` plugins, and packages published to npm with the `aws-lite-plugin-*` prefix, are automatically loaded by the `@aws-lite/client` upon instantiation
  - This behavior can be overridden with the [`autoloadPlugins` parameter](/configuration)

Thus, to make use of the `@aws-lite/dynamodb` plugin, this is what your code would look like:

```shell
npm i @aws-lite/client @aws-lite/dynamodb
```

```javascript
import awsLite from '@aws-lite/client'
const aws = await awsLite() // @aws-lite/dynamodb is now automatically loaded
aws.DynamoDB.PutItem({ TableName: 'my-table', Key: { id: 'hello' } })
```


## Plugin API

The `aws-lite` plugin API is lightweight and simple to learn. It makes use of four optional lifecycle hooks:

- [`validate`](#validate) [optional] - an object of property names and types used to validate inputs pre-request
- [`request()`](#request) [optional] - an async function that enables mutation of inputs to the final service API request
- [`response()`](#response) [optional] - an async function that enables mutation of service API responses before they are returned
- [`error()`](#error) [optional] - an async function that enables mutation of service API errors before they are returned

The above four lifecycle hooks must be exported as an object named `methods`, along with a valid AWS service code property named `service`, like so:

```javascript
// A simple plugin for validating `TableName` input on DynamoDB.PutItem() calls
export default {
  service: 'dynamodb',
  awsDoc: 'https://docs.aws.../API_PutItem.html',
  readme: 'https://github...#PutItem',
  methods: {
    PutItem: {
      validate: {
        TableName: { type: 'string', required: true }
      }
    }
  }
}
// Using the above plugin
aws.DynamoDB.PutItem({ TableName: 12345 }) // Throws validation error
```

Additionally, two optional (but highly recommended) metadata properties that will be included in any method errors:
- `awsDoc` (string) [optional] - intended to be a link to the AWS API doc pertaining to this method; should usually start with `https://docs.aws.amazon.com/...`
- `readme` (string) [optional] - a link to a relevant section in your plugin's readme or docs

Example plugins can be found below, and in [`aws-lite` project's `plugins/` dir (which contains all `@aws-lite/*` plugins)](https://github.com/architect/aws-lite/tree/main/plugins).


### `validate`

The `validate` lifecycle hook is an optional object containing (case-sensitive) input property names, with a corresponding object that denotes their `type` (string, required) and whether the parameter is `required` (boolean, default `false`).

Additionally, a descriptive `comment` property can be added to each parameter. This is used in `@aws-lite/*` plugins to provide documentation.

`type` values are as follows: `array` `boolean` `number` `object` `string`; if multiple types are accepted, an array of types can be used (e.g. `type: [ 'string', 'number' ]`).

An example `validate` plugin:

```javascript
// Validate inputs for a single DynamoDB method (`CreateTable`)
export default {
  service: 'dynamodb',
  methods: {
    CreateTable: {
      validate: {
        TableName:                  { type: 'string', required: true, comment: '...' },
        AttributeDefinitions:       { type: 'array', required: true, comment: '...' },
        KeySchema:                  { type: 'array', required: true, comment: '...' },
        BillingMode:                { type: 'string', comment: '...' },
        DeletionProtectionEnabled:  { type: 'boolean', comment: '...' },
        GlobalSecondaryIndexes:     { type: 'array', comment: '...' },
        LocalSecondaryIndexes:      { type: 'array', comment: '...' },
        ProvisionedThroughput:      { type: 'object', comment: '...' },
        SSESpecification:           { type: 'object', comment: '...' },
        StreamSpecification:        { type: 'object', comment: '...' },
        TableClass:                 { type: 'string', comment: '...' },
        Tags:                       { type: 'array', comment: '...' },
      }
    }
  }
}
```


### `request()`

The `request()` lifecycle hook is an optional async function that enables transformation of inputs into the final service API request.

`request()` is executed with two positional arguments:

- **`params` (object)**
  - The method's input parameters
- **`utils` (object)**
  - [Plugin helper utilities](#plugin-utils)

The `request()` method may return:

- A [valid client request](/request-response#requests)
- Nothing (which will pass through the input params as-is)

An example:

```javascript
// Automatically serialize input to AWS-flavored JSON
export default {
  service: 'dynamodb',
  methods: {
    PutItem: {
      validate: { Item: { type: 'object', required: true } },
      request: async (params, utils) => {
        params.Item = utils.awsjsonMarshall(params.Item)
        return {
          headers: { 'X-Amz-Target': `DynamoDB_20120810.PutItem` }
          payload: params
        }
      }
    }
  }
}
```


### `response()`

The `response()` lifecycle hook is an async function that enables mutation of service API responses before they are returned.

`response()` is executed with two positional arguments:

- **`response` (object)**
  - An object containing three properties from the API response:
    - **`statusCode` (number)**
      - HTTP response status code
    - **`headers` (object)**
      - HTTP response headers
    - **`payload` (object or string)**
      - Raw non-error response from AWS service API request
      - If the entire payload is JSON, AWS-flavored JSON, or XML, `aws-lite` will attempt to parse it prior to executing `response()`
      - Responses that are primarily JSON, but with nested AWS-flavored JSON, will be parsed only as JSON and may require additional deserialization with the `awsjsonUnmarshall` utility or `awsjson` property
- **`utils` (object)**
  - [Plugin helper utilities](#plugin-utils)

The `response()` method may return:

- An individual response property (such as simply passing through `payload`)
- A mutated version of the entire `response` object
- Arbitrary data (most commonly – but not necessarily – an object or string)
- Nothing (which will pass through the `response` object as-is)

> Note: Should you return an object, you may also include an `awsjson` property (that behaves the same as in [client requests](/request-response#requests)). The `awsjson` property is considered reserved, and will be stripped from any returned data.

An example:

```javascript
// Automatically deserialize AWS-flavored JSON
export default {
  service: 'dynamodb',
  methods: {
    GetItem: {
      // Assume successful responses always have an AWS-flavored JSON `Item` property
      response: async (response, utils) => {
        response.awsjson = [ 'Item' ]
        return response // Returns the response (`statusCode`, `headers`, `payload`), with `payload.Item` unformatted from AWS-flavored JSON, and the `awsjson` property removed
      }
    }
  }
}
```


### `error()`

The `error()` lifecycle hook is an optional async function that enables mutation of service API errors before they are returned.

`error()` is executed with two positional arguments:

- **`error` (object)**
  - The object containing the following properties:
    - **`error` (object or string)**
      - The raw error from the service API
      - If the entire error payload is JSON or XML, `aws-lite` will attempt to parse it into the `error` property
    - **`metadata` (object)**
      - `aws-lite` error metadata; to improve the quality of the errors presented by `aws-lite`, please only append to this object
    - **`statusCode` (number or undefined)**
      - Resulting status code of the API response
      - If an HTTP connection error occurred, `statusCode` will be undefined
- **`utils` (object)**
  - [Plugin helper utilities](#plugin-utils)

The `error()` method may return:
- A new or mutated version of the error payload
- A string, object, or a JS error
- Nothing  (which will pass through the `error` object as-is)

An example:

```javascript
// Improve clarity of error output
export default {
  service: 'lambda',
  methods: {
    GetFunctionConfiguration: {
      error: async (err, utils) => {
        if (err.statusCode === 400 &&
            err?.error?.message?.match(/validation/)) {
          // Append a property to be clearly displayed along with the other error data
          err.metadata.type = 'Validation error'
        }
        return err
      }
    }
  }
}
```


### Plugin utils

[`request()`](#request), [`response()`](#response), and [`error()`](#error) are all passed a second argument of helper utilities and data pertaining to the client:

- **`awsjsonMarshall` (function)**
  - Utility for marshalling data to the format underlying AWS-flavored JSON serialization
  - This method accepts a plain object, and returns a marshalled object
- **`awsjsonUnmarshall` (function)**
  - Utility for unmarshalling data from the format underlying AWS-flavored JSON serialization
  - This method accepts a marshalled object, and returns a plain object
- **`config` (object)**
  - The current [client configuration](/configuration)
  - Any configured credentials are found in the `credentials` object
- **`credentials` (object)**
  - `accessKeyId`, `secretAccessKey`, and `sessionToken` being used in this request
  - Note: `secretAccessKey` and `sessionToken` are present in this object, but are non-enumerable
- **`region` (string)**
  - Canonical service region being used in this request
  - This value may differ from the region set in the `config` object if overridden per-request

An example of plugin utils:

```javascript
async function request (params, utils) {
  let marshalled = utils.awsjsonMarshall({ ok: true, hi: 'there' })
  console.log(marshalled)
  // { ok: { BOOL: true }, hi: { S: 'there' } }

  let unmarshalled = utils.awsjsonUnmarshall(marshalled)
  console.log(unmarshalled)
  // { ok: true, hi: 'there' }

  console.log(config)
  // { profile: 'my-profile', autoloadPlugins: true, ... }

  console.log(credentials)
  // { accessKeyId: 'abc123...' } secrets are non-enumerable

  console.log(region)
  // 'us-west-1'
}
```
