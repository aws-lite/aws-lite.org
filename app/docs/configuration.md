---
title: Configuration
description: Credential and general configuration options for aws-lite
introduced: 0.1.0
next: request-response
---
# Configuration

The following options may be passed when instantiating the `aws-lite` client:


## Credentials + region

- **`accessKeyId`** (string)
  - AWS access key; if not provided, defaults to `AWS_ACCESS_KEY_ID` or `AWS_ACCESS_KEY` env vars, and then to a `~/.aws/credentials` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var
  - If no access key is found, `aws-lite` will throw
- **`secretAccessKey`** (string)
  - AWS secret key; if not provided, defaults to `AWS_SECRET_ACCESS_KEY` or `AWS_SECRET_KEY` env vars, and then to a `~/.aws/credentials` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var
  - If no secret key is found, `aws-lite` will throw
- **`sessionToken`** (string)
  - AWS session token; if not provided, defaults to `AWS_SESSION_TOKEN` env var, and then to a `~/.aws/credentials` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var
- **`region`** (string)
  - AWS service region (e.g. `us-west-1`); if not provided, defaults to `AWS_REGION`, `AWS_DEFAULT_REGION`, or `AMAZON_REGION` env vars
  - By default, a `~/.aws/config` (or custom) file will only be loaded by using the `awsConfigFile` config property, or by making the `AWS_SDK_LOAD_CONFIG` env var true
  - Manually specify a config file location with the `awsConfigfile` config property, or with the `AWS_CONFIG_FILE` (and `AWS_SDK_LOAD_CONFIG`) env var
  - If `host` is specified, `region` can be an arbitrary, non-AWS value; this is helpful when using AWS-compatible APIs
  - If no region is found, `aws-lite` will throw
  - Region setting can be overridden per-request
- **`profile`** (string)
  - AWS config + credentials profile; if not provided, defaults to `AWS_PROFILE` env var, and then to the `default` profile, if present


## General config

- **`autoloadPlugins`** (boolean) [default = `false`]
  - Automatically load installed `@aws-lite/*` + `aws-lite-plugin-*` plugins; this is not suggested for production use, and should generally only be used for quick local iteration
- **`awsConfigFile`** (boolean or string) [default = `false`]
  - Load configuration from an AWS configuration file
  - If `true`, it will load from the default (`~/.aws/config`) location
  - If a `string`, it will load from that custom path
- **`debug`** (boolean) [default = `false`]
  - Enable debug logging to console
- **`keepAlive`** (boolean) [default = `true`]
  - Disable Node.js's connection keep-alive, helpful for local testing
- **`plugins`** (array)
  - Define `aws-lite` plugins for the client instance to use; each plugin must an object or import / require statement. Examples:
    - `import dynamodb from '@aws-lite/dynamodb'; await awsLite({ plugins: [ dynamodb ] })`
    - `const dynamodb = require('@aws-lite/dynamodb'); await awsLite({ plugins: [ dynamodb ] })`
    - `await awsLite({ plugins: [ import('@aws-lite/dynamodb') ] })`
    - `await awsLite({ plugins: [ await import('@aws-lite/dynamodb') ] })`
    - `await awsLite({ plugins: [ require('@aws-lite/dynamodb') ] })`
- **`responseContentType`** (string)
  - Set an overriding Content-Type header for all responses, helpful for local testing
- **`retries`** (number, aliased to `maxAttempts`) [default = `5`]
  - Set the maximum number of graceful retries when API service failures occur; set to 0 to disable retrying
- **`verifyService`** (boolean) [default = `true`]
  - Verify client request `service` names against a list of known AWS services. If `false`, any `service` name will be accepted.


## Endpoint config

Configure custom endpoints for local testing or AWS-compatible APIs. `endpoint` is usually the preferred parameter, or use individual properties: `pathPrefix`, `host`, `port`, `protocol`.

- **`endpoint`** (string, aliased to `url`)
  - Full URL of the API being requested
  - This value should specify the protocol, and if applicable, port and path; example: `http://my-custom-s3-endpoint.net/s3`
  - `endpoint` supersedes `pathPrefix`, `host`, `port`, and `protocol`; if `endpoint` is specified, the others will be ignored
  - If a config file is being used (via `awsConfigFile` or `AWS_SDK_LOAD_CONFIG` + `AWS_CONFIG_FILE` env vars), `endpoint` will be assigned the `endpoint_url` setting of the specified profile, if present
  - Alternately, `endpoint` will use the value of the `AWS_ENDPOINT_URL` env var, if present
- **`pathPrefix`** (string)
  - Add prefix to any specified paths in all requests, helpful for local testing
- **`host`** (string)
  - Set a custom host name to use, helpful for local testing
  - This value should NOT specify a protocol, port, or path; example: `my-custom-s3-endpoint.net`
- **`port`** (number)
  - Set a custom port number to use, helpful for local testing
- **`protocol`** (string) [default = `https`]
  - Set the connection protocol to `http`, helpful for local testing


## Example

```javascript
import awsLite from '@aws-lite/client'

// Load everything from env vars and/or config files
let aws = await awsLite()

// Or specify options
aws = await awsLite({
  // Credentials + region
  accessKeyId: '$accessKey',
  secretAccessKey: '$secretKey',
  sessionToken: '$sessionToken',
  region: 'us-west-1',
  profile: 'work',
  // General config
  autoloadPlugins: false,
  awsConfigFile: '/a/path/to/config',
  debug: true,
  keepAlive: false,
  plugins: [ '@aws-lite/dynamodb', '/a/custom/local/plugin/path' ],
  responseContentType: 'application/json',
  retries: 4,
  // Endpoint config
  endpoint: 'http://my-custom-s3-endpoint.net/s3', // Aliased to `url`
  // The following options are ignored if `endpoint` is present:
  pathPrefix: '/test/path/',
  host: 'localhost',
  port: 12345,
  protocol: 'http',
})

// aws-lite can also be used with AWS-compatible services that use AWS signature v4 (e.g. Backblaze B2)
// Such services can accept alternate credentials passed during instantiation, via env vars, etc.
aws = await awsLite({
  accessKeyId: '$alternateAccessKey',
  secretAccessKey: '$alternateAccessSecretKey',
  region: 'us-west-004',
  endpoint: 'https://s3.us-west-004.backblazeb2.com/',
})
```
