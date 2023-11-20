## What is `aws-lite`?

[`aws-lite`](https://www.npmjs.com/package/@aws-lite/client) is a simple, extremely fast, extensible Node.js client for interacting with AWS services.

(It's got good error reporting, too.)

You can think of it as a community-driven alternative to the AWS's JavaScript SDK.


## Why not use `aws-sdk` / `@aws-sdk/*`?

Amazon has historically done a great job of maintaining its SDKs. However, AWS has deprecated its widely-adopted v2 SDK; its v3 SDK relies on generated code, resulting in large dependencies, poor performance, awkward semantics, difficult to understand generated documentation, and errors without usable stack traces.

We rely on and believe in AWS, so we built `aws-lite` to provide a simpler, faster, more stable position from which to work with AWS services in Node.js.


## How does it work?

`@aws-lite/client` provides a basic client interface for quickly interacting with any AWS service. However, most folks will probably want to extend the client and utilize plugins, which provide ergonomic representations of AWS service API methods.

Because `aws-lite` and its plugins are authored from the ground up for performance and simplicity, it performs 2-5x faster than AWS SDK, helping ensure that customer hot paths always receive sub-second responses:

<picture>
  <img alt="Benchmark statistics - Time to respond, not including coldstart" src="/_static/execution-time.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart" srcset="/_static/execution-time-dark.png">
</picture>

Learn more about [`aws-lite` performance here](/performance).
