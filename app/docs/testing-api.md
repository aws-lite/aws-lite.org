---
title: Testing API
description: Documentation and examples for the aws-lite testing API
introduced: 0.18.0
next: performance
---
# Testing API

> This feature is [under active development, and is accepting feedback](https://github.com/aws-lite/aws-lite/issues/102). It is expected to be finalized by v1.0.

## Introduction

`aws-lite` treats integration with your existing test suites as a first-class concern. Instead of bolting on heavy, complex, possibly unstable third-party libraries, `aws-lite` bakes in its own super fast, lightweight suite of utilities for integrating with your test suite.


## How testing mode works

When `aws-lite` testing mode is enabled (via [`enable()`](#enable())), all requests are captured (but not made to live services), and responses are are returned via mocks you provide. The following strategy is used:

- Once testing mode is enabled, all client instances begin using mock responses
  - You cannot enable testing mode on some `aws-lite` instances, but not others
- Requests are recorded, in order, in two lists:
  - One containing all requests
  - Another containing requests to the specific plugin method (or the lower-level client) in question
- Responses are returned for each method called as defined:
  - If a single mock response is found, it will be returned as many times as is requested
  - If a queue of mock responses are found, the responses will be drained sequentially with each request; the final response will be treated as above, returned as many times as it's requested
  - Responses can be functions, and are passed the method params when executed
  - If the response returns a payload with an `error` property, `aws-lite` will handle that error as though it came from an API, and subsequently throw
  - If a call is made to a method with no mock responses defined, `aws-lite` will throw

To return to to making calls to live services, disable `aws-lite`'s testing mode (via [`disable()`](#disable())).

> Note: do not rely on the raw testing data returned by [`debug()`](#debug()) – it should be considered internal and may change at any time without issuing a breaking change. Data should always be accessed by tests via the methods below.


## Example

This example covers some common testing use cases:

```javascript
import awsLite from '@aws-lite/client'
const aws = await awsLite({ plugins: [ import('@aws-lite/dynamodb' )] })

// Testing mode can be enabled and disabled at any time
awsLite.testing.enable()

// Add a single mock response
awsLite.testing.mock('DynamoDB.GetItem', { ok: true })

const getParams = { TableName: 'foo', Key: { id: 'foo' } }
await aws.DynamoDB.GetItem(getParams)
// { ok: true }
await aws.DynamoDB.PutItem({ TableName: 'foo', Item: { id: 'foo' } })
// Throws: no mock found for DynamoDB.PutItem

// Sequential mock responses
awsLite.testing.mock('DynamoDB.GetItem', [
  { hello: 'hi' },
  { hello: 'bonjour' },
  { hello: 'konnichiwa' },
])
await aws.DynamoDB.GetItem(getParams)
// { hello: 'hi' }
await aws.DynamoDB.GetItem(getParams)
// { hello: 'bonjour' }
await aws.DynamoDB.GetItem(getParams)
// { hello: 'konnichiwa' }
await aws.DynamoDB.GetItem(getParams) // The final sequential response is reused
// { hello: 'konnichiwa' }

awsLite.testing.getAllRequests()
// 5 requests returned
awsLite.testing.getLastResponse()
// { ...metadata, response: { hello: 'konnichiwa' } }

// Add an error response
awsLite.testing.mock('DynamoDB.GetItem', {
  statusCode: 400, // Optional
  error: {
    message: 'One or more parameter values were invalid...',
    // Add optional service-specific properties, like DynamoDB's error __type:
    __type: 'com.amazon.coral.validate#ValidationException',
  }
})
await aws.DynamoDB.GetItem(getParams)
// Throws the above validation error

// Live calls will now be made again
awsLite.testing.disable()
```



## Testing API methods

All testing API methods are found in the main `aws-lite` module's `testing` property:

```javascript
import awsLite from '@aws-lite/client'
console.log(awsLite.testing) // { debug, disable, ... }
```


### `debug()`

**Important: `debug()` data is for debugging only, access test data via the methods below.**

Returns the current `aws-lite` testing dataset, including all requests and responses. Accepts a single options parameter containing the following property:

- **`print`** (boolean) [default = `false`]
  - Print the current `aws-lite` testing dataset

```javascript
awsLite.testing.debug({ print: true })
// Returns and prints current testing data
```


### `disable()`

Disables testing mode. Resets all testing data, and resumes making live service calls.

```javascript
awsLite.testing.disable()
awsLite.testing.isEnabled() // false
```


### `enable()`

Enable testing mode. Resets all testing data, and captures all service requests. Once enabled, if a request is made to a method without a mock response, `aws-lite` will throw. Accepts a single options parameter containing the following property:

- **`usePluginResponseMethod`** (boolean) [default = `false`]
  - Pass mock responses through `response()` (and/or `error()`) methods; necessitates a different shape, see [advanced testing](#advanced-testing)

```javascript
awsLite.testing.enable(/* { usePluginResponseMethod: true } */)
awsLite.testing.isEnabled() // true
```


### `getAllRequests()`

Get all requests, or get all requests from a single method. To limit to a single method, pass a string argument of either the full method name (e.g. `DynamoDB.GetItem`) or `client` (for the lower-level `aws-lite` client, if used).

```javascript
awsLite.testing.getAllRequests()
// Returns all requests made since testing mode was enabled
awsLite.testing.getAllRequests('DynamoDB.GetItem')
// Returns all `DynamoDB.GetItem` requests (if any)
```


### `getAllResponses()`

Get all responses, or get all responses from a single method. To limit to a single method, pass a string argument of either the full method name (e.g. `DynamoDB.GetItem`) or `client` (for the lower-level `aws-lite` client, if used).

```javascript
awsLite.testing.getAllResponses()
// Returns all responses returned since testing mode was enabled
awsLite.testing.getAllResponses('DynamoDB.GetItem')
// Returns all `DynamoDB.GetItem` responses (if any)
```


### `getLastRequest()`

Get last request, or get last request from a single method. To limit to a single method, pass a string argument of either the full method name (e.g. `DynamoDB.GetItem`) or `client` (for the lower-level `aws-lite` client, if used).

```javascript
awsLite.testing.getLastRequest()
// Returns last request made
awsLite.testing.getLastRequest('DynamoDB.GetItem')
// Returns last `DynamoDB.GetItem` requests (if any)
```


### `getLastResponse()`

Get last response, or get last response from a single method. To limit to a single method, pass a string argument of either the full method name (e.g. `DynamoDB.GetItem`) or `client` (for the lower-level `aws-lite` client, if used).

```javascript
awsLite.testing.getLastResponse()
// Returns last response returned
awsLite.testing.getLastResponse('DynamoDB.GetItem')
// Returns last `DynamoDB.GetItem` response (if any)
```


### `mock()`

Add one or more mocks to a given method. Arrays of mock responses will be drained with each request, and the final mock will be reused until otherwise modified.

```js
// Add a single mock response
awsLite.testing.mock('DynamoDB.GetItem', { ok: true })

// Sequential mock responses
awsLite.testing.mock('DynamoDB.GetItem', [
  { hello: 'hi' },
  { hello: 'bonjour' },
  { hello: 'konnichiwa' },
])

// Add a simple error response
awsLite.testing.mock('DynamoDB.GetItem', {
  error: 'One or more parameter values were invalid...'
})

// Use lower-level responses per the request / response shape
awsLite.testing.enable({ usePluginResponseMethod: true })
awsLite.testing.mock('DynamoDB.GetItem', {
  statusCode: 200,
  headers: { ... },
  payload: { ok: true }
})

```


### `reset()`

Resets all mocks, requests, and responses.

```javascript
awsLite.testing.getAllResponses()
// Returns n responses
awsLite.testing.reset()
awsLite.testing.getAllResponses()
// undefined
```

---

## Advanced testing

### Passing responses / errors through `response()` and `error()` methods

By default, `aws-lite` returns the responses as defined in your mocks, short-circuiting plugin `response()` and `error()` methods. However, you have the option to provide a "lower-level" response mock that will be passed to your plugin's `response()` and `error()` methods, should that behavior be desired.

This mode can be useful for testing complex, lower-level client behavior, or more commonly, for testing `aws-lite` plugins themselves.

Activate this mode with the `usePluginResponseMethod` option when enabling testing, like so:

```js
awsLite.testing.enable({ usePluginResponseMethod: true })
```

Whereas normal mocks do not have any specific shape, mocks passed to plugin response methods must meet the following requirements.


#### Responses

Response mocks will be parsed by the plugin's `response()` handler, if present. Mocks should assume that `aws-lite`'s request system has already correctly parsed any JSON, AWS-flavored JSON, or XML response payloads, so do not include serialized data as your payload.

- Must include a `statusCode` property, which must be a number
- `headers` and `payload` properties are optional
  - If not passed, `headers` will be set to `{}`
  - If not passed, `payload` will be an empty string


#### Errors

Errors will be parsed by the plugin's `response()` handler, if present. Mocks should assume that `aws-lite`'s request system has already correctly parsed any JSON, AWS-flavored JSON, or XML error payloads, so do not include serialized data as your payload.

- Must include an `error` property, which may be a string or object
- `statusCode` and `headers` properties are optional
