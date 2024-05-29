---
description: A simple, extremely fast, extensible Node.js client for interacting with AWS services
next: configuration
---
<h1>
  <span class="clip">aws-lite</span>
  <aws-lite-logo></aws-lite-logo>
</h1>

<fluid-grid>

<call-out title="Get started">

Make your first [`aws-lite` call in 60 seconds](#install-aws-lite)

</call-out>

<call-out title="Performance">

Learn more about how [`aws-lite` is 2x faster](/performance)

</call-out>

<call-out title="Plugin API">

[Author plugins](/plugin-api) and [expand the ecosystem](/contributing)

</call-out>

<call-out title="Join us">

Join our [Discord and help guide the project](https://discord.com/invite/y5A2eTsCRX)

</call-out>

</fluid-grid>

## So, what is `aws-lite`?

[`aws-lite`](https://www.npmjs.com/package/@aws-lite/client) is a simple, extremely fast, extensible Node.js client for interacting with AWS services.

(It's got good error reporting, too.)

You can think of it as a community-driven alternative to AWS's JavaScript SDK.


## Why not use `aws-sdk` / `@aws-sdk/*`?

Amazon has historically done a great job of maintaining its SDKs. However, AWS has deprecated its widely-adopted v2 SDK; its v3 SDK relies on generated code, resulting in large dependencies, poor performance, awkward semantics, difficult to understand documentation, and errors without usable stack traces.

We rely on and believe in AWS, so we built `aws-lite` to provide a simpler, faster, more stable position from which to work with AWS services in Node.js.


## Features

- [2x faster than AWS SDK v3](/performance)
- Simple semantics & straightforward promise-based interface
- Human-readable documentation
- Highly [customizable](/configuration)
- Errors with stack traces and line numbers
- Built-in [testing API](/testing-api) with support for mocking and response queues
- Built-in pagination
- Secured with AWS Signature v4
- Interacts with any AWS service without needing any plugins
- Automatically parses / serializes JSON, AWS-flavored JSON, and XML request / response payloads
- Easily integrates with local testing suites and AWS service mocks
- Use existing service plugins, or [develop your own](/plugin-api)
- Debug mode for inspecting raw requests and responses
- Just two dependencies


## How does it work?

`@aws-lite/client` provides a basic client interface for quickly interacting with any AWS service. However, most folks will probably want to extend the client with service plugins, which provide ergonomic representations of AWS service API methods.

Because `aws-lite` and its plugins are authored from the ground up for performance and simplicity, `aws-lite` is 2x faster than AWS SDK, helping ensure that customer hot paths always receive sub-second responses:

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart (DynamoDB)" srcset="/_public/dynamodb/execution-time-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart (DynamoDB)" src="/_public/dynamodb/execution-time.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart" srcset="/_public/aggregate/execution-time-all-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart" src="/_public/aggregate/execution-time-all.png">
</picture>

Learn more about [`aws-lite` performance here](/performance).


## Install `aws-lite`

Install the client:

```shell
npm i @aws-lite/client
```

Use the lower-level client to quickly interact with any AWS service API, or extend it with service plugins:

```shell
npm i @aws-lite/dynamodb
```

Types are available as optional `@aws-lite/*-types` packages:

```shell
npm i -D @aws-lite/dynamodb-types
```

Learn more about [`aws-lite` types here](/using-typescript).


## Example

```javascript
// Instantiate a client with the DynamoDB plugin
import awsLite from '@aws-lite/client'
const aws = await awsLite({ region: 'us-west-1', plugins: [ import('@aws-lite/dynamodb') ] })

// Easily interact with the AWS services your application relies on
await aws.DynamoDB.PutItem({
  TableName: '$table-name',
  Item: {
    // AWS-lite automatically de/serializes DynamoDB JSON
    pk: '$item-key',
    data: {
      ok: true,
      hi: 'friends'
    }
  }
})

await aws.DynamoDB.GetItem({
  TableName: '$table-name',
  Key: { pk: '$item-key' }
})
// {
//   Item: {
//     pk: '$item-key',
//     data: data: {
//       ok: true,
//       hi: 'friends'
//     }
//   }
// }

// Use the lower-level client to fire a GET request by specifying a `service` and `endpoint`
await aws({
  service: 'lambda',
  endpoint: '/2015-03-31/functions/$function-name/configuration',
})
// {
//   FunctionName: '$function-name',
//   Runtime: 'nodejs20.x',
//   ...
// }

// POST JSON by adding a `payload` property
await aws({
  service: 'lambda',
  endpoint: '/2015-03-31/functions/$function-name/invocations',
  payload: { ok: true },
})
```


## Join the movement

- [Learn how to author AWS service plugins](/plugin-api)
- [Expand and improve the `aws-lite` ecosystem](/contributing)
- [Join the Discord](https://discord.com/invite/y5A2eTsCRX)
