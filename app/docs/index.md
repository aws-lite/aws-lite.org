# Intro

## What is `aws-lite`?

[`aws-lite`](https://www.npmjs.com/package/@aws-lite/client) is a simple, extremely fast, extensible Node.js client for interacting with AWS services.

(It's got good error reporting, too.)

You can think of it as a community-driven alternative to the AWS's JavaScript SDK.


## Why not use `aws-sdk` / `@aws-sdk/*`?

Amazon has historically done a great job of maintaining its SDKs. However, AWS has deprecated its widely-adopted v2 SDK; its v3 SDK relies on generated code, resulting in large dependencies, poor performance, awkward semantics, difficult to understand generated documentation, and errors without usable stack traces.

We rely on and believe in AWS, so we built `aws-lite` to provide a simpler, faster, more stable position from which to work with AWS services in Node.js.


## Features

- [2-5x faster than AWS SDK v3](/performance)
- Simple semantics & straightforward promise-based interface
- Human-readable documentation
- Customizable
- Errors with stack traces and line numbers
- Built-in pagination
- Secured with AWS Signature v4
- Interacts with any AWS service without needing any plugins
- Automatically parses / serializes JSON, AWS-flavored JSON, and XML request / response payloads
- Easily integrates with local testing suites and AWS service mocks
- Use existing service plugins, or [develop your own](/api)
- Debug mode for inspecting raw requests and responses
- Just two dependencies


## How does it work?

`@aws-lite/client` provides a basic client interface for quickly interacting with any AWS service. However, most folks will probably want to extend the client with service plugins, which provide ergonomic representations of AWS service API methods.

Because `aws-lite` and its plugins are authored from the ground up for performance and simplicity, it performs 2-5x faster than AWS SDK, helping ensure that customer hot paths always receive sub-second responses:

<picture>
  <img alt="Benchmark statistics - Time to respond, not including coldstart" src="/_static/execution-time.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart" srcset="/_static/execution-time-dark.png">
</picture>

Learn more about [`aws-lite` performance here](/performance).


## Install `aws-lite`

Install the client:

```sh
npm i @aws-lite/client
```

You can use the client as-is to quickly interact with AWS service APIs, or extend it with specific service plugins like so:

```sh
npm i @aws-lite/dynamodb
```

Generally, types are available as optional `@aws-lite/<plugin>-types` packages, and can be added like so:

```sh
npm i -D @aws-lite/dynamodb-types
```

[Learn more about `aws-lite` types.](/configuration#types)


## Example

Now start making calls to AWS:

```javascript
/**
 * Instantiate a client
 * This is an asynchronous operation that will attempt to load your AWS credentials, local configuration, region settings, etc.
 */
import awsLite from '@aws-lite/client'
const config = { region: 'us-west-1' } // Optional
const aws = await awsLite(config)

/**
 * Reads
 * Fire a GET request to the Lambda API by specifying its AWS service name and endpoint
 */
await aws({
  service: 'lambda',
  endpoint: '/2015-03-31/functions/$function-name/configuration',
})
// {
//   FunctionName: '$function-name',
//   Runtime: 'nodejs18.x',
//   ...
// }

/**
 * Writes
 * POST JSON by adding a payload property
 */
await aws({
  service: 'lambda',
  endpoint: '/2015-03-31/functions/$function-name/invocations',
  payload: { ok: true },
})

/**
 * Plugins
 * Use service plugins to more easily interact with the AWS services your application relies on
 */
await aws.DynamoDB.GetItem({
  pk: '$item-key',
})
// {
//   Item: {
//     pk: '$item-key',
//     data: 'item-data',
//     ...
//   }
// }
```
