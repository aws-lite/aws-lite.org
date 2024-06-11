---
title: Plugin API
description: Documentation and examples for the aws-lite plugin API
introduced: 0.1.0
next: testing-api
---
# Plugin API

## Introduction

Out of the box, [`@aws-lite/client`](https://www.npmjs.com/package/@aws-lite/client) is a full-featured AWS API client that you can use to interact with any AWS service that makes use of [authentication via AWS signature v4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html) (which should be just about all of them).

`@aws-lite/client` can be extended with plugins to more easily interact with AWS services, or to customize behavior or semantics. As such, plugins enable you to have significantly more control over the entire API request/response lifecycle.

A bit more about how plugins work:

- Plugins can be authored in ESM or CJS
- Plugins can be dependencies downloaded from npm, or also live locally in your codebase
- In conjunction with the open source community, `aws-lite` publishes service plugins under the `@aws-lite/$service` namespace that [conform to `aws-lite` standards](/contributing)

Thus, to make use of the `@aws-lite/dynamodb` plugin, this is what your code would look like:

```shell
npm i @aws-lite/client @aws-lite/dynamodb
```

```javascript
import awsLite from '@aws-lite/client'
const aws = await awsLite({ plugins: [ import('@aws-lite/dynamodb')] })
aws.DynamoDB.PutItem({ TableName: 'my-table', Key: { id: 'hello' } })
```


## Plugin API

The `aws-lite` plugin API is lightweight and simple to learn. At the top level, the following properties define a plugin:

- **`service`** (string) [required]
  - Service name the plugin will use for all requests; for more information about services, please see [client requests](/request-response#requests).
- **[`methods`](/plugin-api#method-hooks)** (object) [required]
  - Object containing [method names (and their corresponding hooks)](/plugin-api#method-hooks)
- **`property`** (string)
  - Customize the plugin's namespace or casing if you'd like it to be different than the plain `service`, e.g. `dynamodb` can be accessed as `DynamoDB`
  - Can be used to specify a colloquial or shortened version of the formal service name, e.g. `dynamodb` can be accessed as `dynamo`
  - Note: when `property` is used, your methods will also still be accessible via the lowcased service name; this is non-enumerable

Here's an example of a simple validation plugin:

```javascript
// Validate `TableName` input on DynamoDB.PutItem() calls
export default {
  service: 'dynamodb',
  property: 'DynamoDB',
  methods: {
    PutItem: {
      validate: {
        TableName: { type: 'string', required: true }
      }
    }
  }
}
// Using the above plugin
aws.DynamoDB.PutItem({ TableName: 12345 }) // Throws validation error (type)
aws.DynamoDB.PutItem({ Key: { ok: true } }) // Throws validation error (required)
```


## Method hooks

The `methods` object specifies an arbitrary number of API methods, each of which makes use of four optional lifecycle hooks:

- **[`validate`](#validate)** (object) [optional]
  - An object of property names and types used to validate inputs pre-request
- **[`request()`](#request())** (async function) [optional]
  - An async function that enables mutation of inputs into the final service API request
- **[`response()`](#response())** (async function) [optional]
  - An async function that enables mutation of service API responses before they are returned
- **[`error()`](#error())** (async function) [optional]
  - An async function that enables mutation of service API errors before they are returned

Example plugins can be found below, and in [`aws-lite` project's `plugins/` dir (which contains all `@aws-lite/*` plugins)](https://github.com/architect/aws-lite/tree/main/plugins).


### Metadata

In addition to the method lifecycle hooks, each method can specify the following optional metadata properties:

- **`awsDoc`** (string) [optional]
  - Link to the AWS API doc pertaining to this method; should usually start with `https://docs.aws.amazon.com/...`
- **`deprecated`** (boolean) [optional, default = `false`]
  - Allows you to denote a method as deprecated; helpful for denoting a plugin methods that may not be implemented
- **`disabled`** (boolean) [optional, default = `false`]
  - Allows you to denote a method as disabled; helpful for fleshing out all the plugin methods
- **`readme`** (string) [optional]
  - Link to a relevant section in your plugin's readme or docs

> Note: `awsDoc` and `readme` properties are highly recommended, as they will be populated in error metadata. In `@aws-lite/*` plugins they are required.


### `validate`

The `validate` lifecycle hook is an optional object containing (case-sensitive) input property names, with a corresponding object that denotes:

- **`type`** (string) [required]
  - Expected top-level type of the property, supports: `array`, `boolean`, `buffer`, `number`, `object`, `string`
  - If multiple types are accepted, an array of types can be used (e.g. `type: [ 'string', 'number' ]`)
- **`required`** (boolean) [default = `false`]
  - Specify the property as being required
- **`comment`** (string)
  - Brief description or summary of the property that may be used in errors, documentation, etc.; highly recommended!
- **`ref`** (string)
  - Reference link to related AWS documentation; helpful for complex or nested values that can't be easily enumerated in `comment`


#### Example

```javascript
// Validate inputs the DynamoDB `CreateTable` method
export default {
  service: 'dynamodb',
  property: 'DynamoDB',
  methods: {
    CreateTable: {
      validate: {
        TableName:                  { type: 'string', required: true, comment: '...', ref: '...' },
        AttributeDefinitions:       { type: 'array', required: true, comment: '...', ref: '...' },
        KeySchema:                  { type: 'array', required: true, comment: '...', ref: '...' },
        BillingMode:                { type: 'string', comment: '...', ref: '...' },
        DeletionProtectionEnabled:  { type: 'boolean', comment: '...', ref: '...' },
        GlobalSecondaryIndexes:     { type: 'array', comment: '...', ref: '...' },
        LocalSecondaryIndexes:      { type: 'array', comment: '...', ref: '...' },
        ProvisionedThroughput:      { type: 'object', comment: '...', ref: '...' },
        SSESpecification:           { type: 'object', comment: '...', ref: '...' },
        StreamSpecification:        { type: 'object', comment: '...', ref: '...' },
        TableClass:                 { type: 'string', comment: '...', ref: '...' },
        Tags:                       { type: 'array', comment: '...', ref: '...' },
      }
    }
  }
}
```


### `request()`

The `request()` lifecycle hook is an optional async function that enables transformation of inputs into the final service API request.

`request()` is executed with two positional arguments:

- **`params`** (object)
  - Input parameters the method was invoked with
- **`utils`** (object)
  - [Plugin helper utilities](#plugin-utils)

The `request()` method may return:

- A [valid client request](/request-response#requests)
- Nothing (which will pass through the input params as-is)


#### Example

```javascript
// Automatically serialize input to AWS-flavored JSON
export default {
  service: 'dynamodb',
  property: 'DynamoDB',
  methods: {
    PutItem: {
      validate: {
        Item: { type: 'object', required: true }
      },
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

- **`response`** (object)
  - An object containing three properties from the API response:
    - **`statusCode`** (number)
      - HTTP response status code
    - **`headers`** (object)
      - HTTP response headers
    - **`payload`** (object or string)
      - Raw non-error response from AWS service API request
      - If the entire payload is JSON, AWS-flavored JSON, or XML, `aws-lite` will attempt to parse it prior to executing `response()`
      - Responses that are primarily JSON, but with nested AWS-flavored JSON, will be parsed only as JSON and may require additional deserialization with the `awsjsonUnmarshall` utility or `awsjson` property
- **`utils`** (object)
  - [Plugin helper utilities](#plugin-utils)

The `response()` method may return:

- An individual response property (such as simply passing through `payload`)
- A mutated version of the entire `response` object
- Arbitrary data (most commonly – but not necessarily – an object or string)
- Nothing (which will pass through the `response` object as-is)

> Note: Should you return an object, you may also include an `awsjson` property (that behaves the same as in [client requests](/request-response#requests)). The `awsjson` property is considered reserved and will be automatically stripped out, thereby not polluting your returned data.


#### Example

```javascript
// Automatically deserialize AWS-flavored JSON
export default {
  service: 'dynamodb',
  property: 'DynamoDB',
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

- **`error`** (object)
  - The object containing the following properties:
    - **`error`** (object or string)
      - The raw error from the service API
      - If the entire error payload is JSON or XML, `aws-lite` will attempt to parse it into the `error` property
    - **`metadata`** (object)
      - `aws-lite` error metadata; to improve the quality of the errors presented by `aws-lite`, please only append to this object
    - **`statusCode`** (number or undefined)
      - Resulting status code of the API response
      - If an HTTP connection error occurred, `statusCode` will be undefined
- **`utils`** (object)
  - [Plugin helper utilities](#plugin-utils)

The `error()` method may return:
- A new or mutated version of the error payload
- A string, object, or a JS error
- Nothing (which will pass through the `error` object as-is)


#### Example

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

[`request()`](#request()), [`response()`](#response()), and [`error()`](#error()) are all passed a second argument of helper utilities and data pertaining to the client:

- **`awsjsonMarshall`** (function)
  - Utility for marshalling data to the format underlying AWS-flavored JSON serialization
  - Accepts a second (optional) options argument – options may contain [`awsjson` property](/request-response#requests), or [`config` object containing `awsjsonMarshall` options](/configuration#general-config)
  - This method accepts a plain object, and returns a marshalled object
- **`awsjsonUnmarshall`** (function)
  - Utility for unmarshalling data from the format underlying AWS-flavored JSON serialization
  - Accepts a second (optional) options argument – options may contain [`awsjson` property](/request-response#requests), or [`config` object containing `awsjsonUnmarshall` options](/configuration#general-config)
  - This method accepts a marshalled object, and returns a plain object
- **`buildXML`** (function)
  - Utility for manually building XML requests, if necessary
  - This method accepts an object, and returns an XML document
- **`client`** (function)
  - An instance of the client, including all plugin methods
  - Helpful for calling other methods within methods
- **`config`** (object)
  - The current [client configuration](/configuration)
  - Any configured credentials are found in the `credentials` object
- **`credentials`** (object)
  - `accessKeyId`, `secretAccessKey`, and `sessionToken` being used in this request
  - Note: `secretAccessKey` and `sessionToken` are present in this object, but are non-enumerable
- **`region`** (string)
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

  console.log(utils.config)
  // { profile: 'my-profile', autoloadPlugins: false, ... }

  console.log(utils.credentials)
  // { accessKeyId: 'abc123...' } secrets are non-enumerable

  console.log(utils.region)
  // 'us-west-1'
}
```
