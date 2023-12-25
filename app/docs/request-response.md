---
title: Request / response
description: Documentation and examples of making and receiving aws-lite requests and responses
next: using-typescript
---
# Request/response

## Requests

Requests from the bare `aws-lite` client and plugins accept the following parameters; only `service` is required.

- **`awsjson` (boolean or array)**
  - Enables AWS-flavored JSON encoding; if boolean, your entire body will be encoded; if an array, the key names specified in the array will be encoded, leaving other keys as normal JSON
  - Do not use this option if you intend to pass your own pre-serialized AWS-flavored JSON in the `payload`
- **`endpoint` (string) [default = `/`]**
  - API endpoint your request will be made to
- **`headers` (object)**
  - Header names + values to be added to your request
  - By default, all headers are included in [authentication via AWS signature v4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
  - If your request includes a `payload` that cannot be automatically JSON-encoded and you do not specify a `content-type` header, the default `application/octet-stream` will be used
- **`payload` (object, buffer, readable stream, string)**
  - Payload to be used as the HTTP request body; as a convenience, any passed objects are automatically JSON-encoded (with the appropriate `content-type` header set, if not already present); buffers, streams, and strings simply pass through as-is
  - If the `content-type` is `application/xml` or `text/xml`, the payload will be automatically XML-encoded as well
  - Readable streams are currently experimental
    - Passing a Node.js readable stream initiates an HTTP data stream to the API endpoint instead of writing a normal HTTP body
    - Streams are not automatically signed like normal HTTP bodies, and may [require their own signing procedures, as in S3](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-streaming.html)
- **`paginate` (boolean) [experimental]**
  - Enables (or disables) automatic result pagination
  - If pagination is enabled by default (see `paginator.default`), pass `false` to disable automatic pagination
  - Otherwise, pass `true` to enable automatic pagination
- **`paginator` (object) [experimental]**
  - Enable automatic pagination for service API via the following properties:
    - **`type` (string) [default = `payload`]**
      - Defines how the pagination `cursor` will be passed to the service API
      - `payload` (default) passes `cursor` via request body, `query` passes `cursor` via query string parameter
    - **`token` (string) [required]**
      - Name of the pagination token returned in response payloads (if any)
      - If the `token` property is found in the response payload, its value will be passed with the next request as `cursor`
      - Example: in S3, `token` would be the `NextContinuationToken` response body property
    - **`cursor` (string) [required]**
      - Name of the pagination token to be passed in the next request via `type` (body or query string parameter)
      - Example: in S3, `cursor` would be the `continuation-token` request query string parameter
    - **`accumulator` (string) [required]**
      - Name of the array in the response payload that will be aggregated into final result set
      - The accumulator can also be nested within and object; if so, use dot notation (see example below)
      - Example: in S3 `ListObjectsV2` this would be `Contents`; in CloudFormation `DescribeStacks` this would be `DescribeStacksResult.Stacks.member`
    - **`default` (string)**
      - Set value to `enabled` to enable pagination for all applicable requests by default
      - If set to `enabled`, individual requests can still opt out of pagination by setting `paginate` to `false`
- **`query` (object)**
  - Serialize the passed object as a query string and append it to your request's `endpoint`
- **`service` (string) [required]**
  - AWS service code, usually just the lowercase form of the service name (e.g. `DynamoDB` = `dynamodb`); [full list can be found here](src/services.js)

> Additionally, the following [client configuration options](/configuration) can be specified in each request, overriding those specified by the instantiated client: [`region`](/configuration), [`protocol`](/configuration), [`host`](/configuration), and [`port`](/configuration)


### Example

```javascript
import awsLite from '@aws-lite/client'
const aws = await awsLite()

// Make a plain JSON request
await aws({
  service: 'lambda',
  endpoint: '/2015-03-31/functions/$function-name/invocations',
  query: { Qualifier: '1' }, // Lambda invoke API's version / alias '1'
  payload: { ok: true }, // Object will be automatically JSON-encoded
})

// Make an AWS-flavored JSON request
await aws({
  service: 'dynamodb',
  headers: { 'X-Amz-Target': `DynamoDB_20120810.GetItem` },
  awsjson: [ 'Key' ], // Ensures only payload.Key will become AWS-flavored JSON
  payload: {
    TableName: '$table-name',
    Key: { myHashKey: 'Gaal', mySortKey: 'Dornick' },
  },
})

// Make an XML request
await aws({
  service: 'cloudfront',
  headers: {'content-type': 'application/xml'}
  endpoint: '/2020-05-31/distribution',
  payload: { ... }, // Object will be automatically XML-encoded
})

// Paginate results
await aws({
  service: 'dynamodb',
  headers: { 'X-Amz-Target': `DynamoDB_20120810.Scan` },
  paginator: {
    cursor: 'ExclusiveStartKey',
    token: 'LastEvaluatedKey',
    accumulator: 'Items',
    default: 'enabled',
  },
  payload: {
    TableName: '$table-name',
  },
})
```


## Responses

The following properties are returned with each non-error client response:

- **`statusCode` (number)**
  - HTTP status code of the response
- **`headers` (object)**
  - Response header names + values
- **`payload` (object, string, null)**
  - Response payload; as a convenience, JSON and XML-encoded responses are automatically parsed
  - Responses without an HTTP body return a `null` payload


AWS errors can take many shapes depending on the service API in question. When a request fails, `aws-lite` will throw a normal error (with a `message`, stack trace + line numbers, etc.), and where possible will include the following additional properties:

- **`statusCode` (number)**
  - HTTP status code of the response
- **`headers` (object)**
  - Response header names + values


### Example

```javascript
import awsLite from '@aws-lite/client'
const aws = await awsLite()

await awsLite({
  service: 'lambda',
  endpoint: '/2015-03-31/functions/$function-name/configuration',
})
// {
//   statusCode: 200,
//   headers: {
//     'content-type': 'application/json',
//     'x-amzn-requestid': 'ba3a55d2-16c2-4c2b-afe1-cf0c5523040b',
//     ...
//   },
//   payload: {
//     FunctionName: '$function-name',
//     FunctionArn: 'arn:aws:lambda:us-west-1:1234567890:function:$function-name',
//     Role: 'arn:aws:iam::1234567890:role/$function-name-role',
//     Runtime: 'nodejs18.x',
//     ...
//   }
// }
```
