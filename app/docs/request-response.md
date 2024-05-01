---
title: Request / response
description: Documentation and examples of making and receiving aws-lite requests and responses
introduced: 0.1.0
next: using-typescript
---
# Request/response

## Requests

Requests from the bare `aws-lite` client and plugins accept the following parameters; only `service` is required.

- **`service`** (string) [required]
  - AWS service code, usually just the lowercase form of the service name (e.g. `DynamoDB` = `dynamodb`); [full list can be found here](src/services.js)
- **`verifyService`** (boolean) [default = `true`]
  - Verify `service` name against a list of known AWS services. If `false`, any `service` name will be accepted.
- **`awsjson`** (boolean or array)
  - Enables AWS-flavored JSON encoding; by default, request payloads will be encoded with AWS-flavored JSON if the request includes a `content-type` header similar to `/application/x-amz-json...`
  - If `true`, encode the entire request payload as AWS-flavored JSON
  - If an array, the property names specified in the array will be AWS-flavored JSON encoded, leaving other properties as normal JSON
  - If `false`, disable encoding of AWS-flavored JSON (even if a relevant `content-type` header is present)
  - If you intend to pass your own pre-serialized AWS-flavored JSON, use `false`
- **`path`** (string) [default = `/`]
  - API path your request will be made to
- **`headers`** (object)
  - Header names + values to be added to your request
  - By default, all headers are included in [authentication via AWS signature v4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
  - If your request includes a `payload` that cannot be automatically JSON-encoded and you do not specify a `content-type` header, the default `application/octet-stream` will be used
- **`payload`** (object, buffer, readable stream, string)
  - Payload to be used as the HTTP request body
  - As a convenience, any passed objects are automatically JSON-encoded (with the appropriate `content-type` header set, if not already present); buffers, streams, and strings simply pass through as-is
  - If an object is passed and the `content-type` is `application/xml` or `text/xml`, the request payload will be automatically XML-encoded
  - Readable streams are currently experimental
    - Passing a Node.js readable stream initiates an HTTP data stream to the API endpoint instead of writing a normal HTTP body
    - Streams are not automatically signed like normal HTTP bodies, and may [require their own signing procedures, as in S3](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-streaming.html)
- **`paginate`** (boolean) [experimental]
  - Enables (or disables) automatic result pagination
  - If pagination is enabled by default (see `paginator.default`), pass `false` to disable automatic pagination
  - Otherwise, pass `true` to enable automatic pagination
- **`paginator`** (object) [experimental]
  - Enable automatic pagination for service API via the following properties ([examples below](#example)):
    - **`type` (string)** [default = `payload`]
      - Defines how the pagination `cursor` will be passed to the service API
      - `payload` (default) passes `cursor` via request body, `query` passes `cursor` via query string parameter
    - **`token` (string or array)** [required]
      - Name of the pagination token returned in response payloads (if any); nested tokens may used with dot delineation (e.g. `TopLevelProperty.NextToken`)
      - If multiple tokens are used, use an array and order them with their corresponding `cursor` array values
      - If the `token` property is found in the response payload, its value will be passed with the next request as `cursor`
      - Example: in S3, `token` would be the `NextContinuationToken` response body property
    - **`cursor` (string or array)** [required]
      - Name of the pagination token to be passed in the next request via `type` (body or query string parameter)
      - If multiple cursors are used, use an array and order them with their corresponding `token` array values
      - Example: in S3, `cursor` would be the `continuation-token` request query string parameter
    - **`accumulator` (string)** [required]
      - Name of the array in the response payload that will be aggregated into final result set
      - The accumulator can also be nested within and object; if so, use dot notation (see example below)
      - Example: in S3 `ListObjectsV2` this would be `Contents`; in CloudFormation `DescribeStacks` this would be `DescribeStacksResult.Stacks.member`
    - **`default`** (string)
      - Set value to `enabled` to enable pagination for all applicable requests by default
      - If set to `enabled`, individual requests can still opt out of pagination by setting `paginate` to `false`
- **`rawResponsePayload`** (boolean) [default = `false`]
  - Return response payload as a buffer, disabling the automatic parsing of JSON + XML
- **`query`** (object)
  - Serialize the passed object as a query string and append it to your request's `endpoint`
- **`xmlns`** (string)
  - Adds an `xmlns` attribute to the first property found in XML-encoded request payloads

> Additionally, the following [client configuration options](/configuration) can be specified in each request, overriding those specified by the instantiated client: [`region`](/configuration#credentials-%2B-region), [`endpoint`](/configuration#endpoint-config), [`pathPrefix`](/configuration#endpoint-config), [`protocol`](/configuration#endpoint-config), [`host`](/configuration#endpoint-config), and [`port`](/configuration#endpoint-config)


### Example

```javascript
import awsLite from '@aws-lite/client'
const aws = await awsLite()

// Make a plain JSON request
await aws({
  service: 'lambda',
  path: '/2015-03-31/functions/$function-name/invocations',
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
  headers: { 'content-type': 'application/xml' },
  path: '/2020-05-31/distribution',
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

// Paginate results in APIs that use multiple corresponding cursors + tokens
await aws({
  service: 'route53',
  path: '/2013-04-01/hostedzone/$HostedZoneId/rrset',
  paginator: {
    cursor: [ 'name', 'type' ],
    token: [ 'NextRecordName', 'NextRecordType' ],
    accumulator: 'ResourceRecordSets.ResourceRecordSet',
    type: 'query',
  },
})

// Make a request without verifying the service name
await aws({
  service: 'newservice',
  verifyService: false,
  path: '/2025-12-31/newapi',
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
    - Due to how XML is interpreted and parsed, `aws-lite` will always convert `true` and `false` strings to boolean values, and interpret ISO 8601-like strings into date values
  - Responses without an HTTP body return a `null` response payload

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
  path: '/2015-03-31/functions/$function-name/configuration',
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
