---
title: Using TypeScript
description: Guide and examples for using TypeScript with aws-lite
introduced: 0.8.0
next: plugin-api
---
# Using TypeScript

## Introduction

Out of the box, the raw `aws-lite` client supports its own basic types for all core [configuration](/configuration) and [client requests](/request-response#requests).

Since most folks opt to use service plugins, optional service-specific types are available for all plugins in the `@aws-lite/*` namespace as `@aws-lite/*-types`.

For example, once you have installed `@aws-lite/client` and `@aws-lite/dynamodb` as dependencies, add the DynamoDB types as a dev dependency:

```shell
npm i -D @aws-lite/dynamodb-types
```


## Configuration

### JavaScript projects

In JavaScript projects, code completion (aka Intellisense) for input and output types are be loaded automatically for `awsLite.<service>.<method>` calls.


### TypeScript projects

To make use of `aws-lite` types in TypeScript projects, include them in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "@aws-lite/dynamodb-types"
    ]
  }
}
```


## Under the hood

In general, both `aws-lite` and AWS's official SDKs attempt to inherit the property names used in AWS's low-level service API documentation. For example: setting the cache control value for an object in the [S3 PutObject API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html#API_PutObject_RequestSyntax) is done via the `cache-control` header, but is referred to as `CacheControl` – this is the property name used by both `aws-lite` and AWS SDKs.

As such, `@aws-lite/*-types` are able to make use of `@aws-sdk/*` types under the hood. And while this generally works without issue, there may be occasional small difference due to technical necessities. For example: when [enabling pagination](/request-response#requests) in a request, non-paginated properties may not be present in the final response returned, thus deviating slightly from what may be present in the types. (This may also be true when using AWS SDKs as well.)

In general, it is a goal of `@aws-lite/*` to provide the maximum practical level of interoperability with the existing AWS property names, types, etc. We encourage you to [contribute to `aws-lite` types](/contributing#creating-%40aws-lite%2F*-types-packages) wherever possible, or [open an issue](https://github.com/aws-lite/aws-lite/issues) if you discover anything that looks incorrect.
