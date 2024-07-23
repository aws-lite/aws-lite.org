---
title: Configuration
description: Credential and general configuration options for aws-lite
introduced: 0.1.0
next: request-response
---
# Configuration

The following options may be passed when instantiating the `aws-lite` client:


## Region / profile config

- **`region`** (string)
  - AWS service region (e.g. `us-west-1`); if not provided, defaults to `AWS_REGION`, `AWS_DEFAULT_REGION`, or `AMAZON_REGION` env vars
  - By default, a `~/.aws/config` (or custom) file will only be loaded by using the `awsConfigFile` config property, or by making the `AWS_SDK_LOAD_CONFIG` env var true
  - Manually specify a config file location with the `awsConfigfile` config property, or with the `AWS_CONFIG_FILE` (and `AWS_SDK_LOAD_CONFIG`) env var
  - If `host` is specified, `region` can be an arbitrary, non-AWS value; this is helpful when using AWS-compatible APIs
  - If no region is found, `aws-lite` will throw
  - Region setting can be overridden per-request
- **`profile`** (string)
  - Selected AWS profile; if not provided, defaults to `AWS_PROFILE` env var, and then to the `default` profile, if present


## Credential config

The following settings document basic credential configuration; [learn additional details about how `aws-lite` implements the credential provider chain](#credential-provider-chain-details).


### Credential parameters

- **`accessKeyId`** (string)
  - AWS access key; if not provided, defaults to `AWS_ACCESS_KEY_ID` or `AWS_ACCESS_KEY` env vars, and then to a `~/.aws/credentials|config` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var
  - If no access key is found, `aws-lite` will throw
- **`secretAccessKey`** (string)
  - AWS secret key; if not provided, defaults to `AWS_SECRET_ACCESS_KEY` or `AWS_SECRET_KEY` env vars, and then to a `~/.aws/credentials|config` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var
  - If no secret key is found, `aws-lite` will throw
- **`sessionToken`** (string)
  - AWS session token; if not provided, defaults to `AWS_SESSION_TOKEN` env var, and then to a `~/.aws/credentials|config` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var


### Credential provider chain

- **`imds`** (object)
  - IMDSv2 configuration; accepts two properties:
    - `endpoint` (string) set a custom the IMDSv2 endpoint
      - If not provided, defaults to `AWS_EC2_METADATA_SERVICE_ENDPOINT` env var, and then to a `~/.aws/credentials|config` file's `ec2_metadata_service_endpoint` property, if present
    - `endpointMode` - (string) set the IMDSv2 host via IP version; either `IPv4` (which sets `endpoint` to `http://169.254.169.254`, the default), or `IPv6` (which sets the `endpoint` to `http://[fd00:ec2::254]`)
      - If not provided, defaults to `AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE` env var, and then to a `~/.aws/credentials|config` file's `ec2_metadata_service_endpoint_mode` property, if present
  - IMDSv2 is enabled by default, but can also be entirely disabled by setting the `AWS_EC2_METADATA_DISABLED` env var


## General config

- **`autoloadPlugins`** (boolean) [default = `false`]
  - Automatically load installed `@aws-lite/*` + `aws-lite-plugin-*` plugins; this is not suggested for production use, and should generally only be used for quick local iteration
- **`awsConfigFile`** (boolean or string) [default = `false`]
  - Load configuration from an AWS configuration file
  - If `true`, it will load from the default (`~/.aws/config`) location
  - If a `string`, it will load from that custom path
- **`awsjsonMarshall`** (object)
  - Lower-level configuration options for marshalling AWS-flavored JSON; [reference here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/#configuration)
- **`awsjsonUnmarshall`** (object)
  - Lower-level configuration options for unmarshalling AWS-flavored JSON; [reference here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/#configuration)
- **`debug`** (boolean) [default = `false`]
  - Enable debug logging to console
  - Can also be enabled by setting the `AWS_LITE_DEBUG` environment variable
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
  - Set the maximum number of graceful retries when API service failures occur; set to `0` to disable retrying
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
  // Region / profile
  region: 'us-west-1',
  profile: 'work',

  // Credentials
  accessKeyId: '$accessKey',
  secretAccessKey: '$secretKey',
  sessionToken: '$sessionToken',

  // Credential provider chain (if above credentials are not passed)
  imds: {
    endpoint: 'http://[::1]'
    endpointMode: 'IPv6', // Overrides `imds.endpoint` if specified
  },

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

---

## Credential provider chain details

To acquire credentials for working with AWS services, `aws-lite` supports the [standard credential provider chain](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html), and should be generally interoperable with AWS SDK v2 and v3 (with [caveats noted below](#credential-loading-caveats)). When an `aws-lite` client is initialized, the following credential loading strategy is employed, in order:

- [Passed credential parameters](#credential-parameters)
- Environment variables (e.g. `AWS_ACCESS_KEY_ID`, etc.)
  - [Learn more about AWS credential env vars here](https://docs.aws.amazon.com/sdkref/latest/guide/environment-variables.html)
- SSO
  - Requires IAM Identity Center setup, and running AWS CLI: `aws sso login [options]`
  - Supports standard profiles, and `sso-session` sections in `config`
  - [Learn more about AWS SSO here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)
- Shared `credentials` + `config` files (`~/.aws/[credentials|config]`)
  - Supports standard `credentials` profiles, and `profile` sections in `config`
  - Supports `AWS_CONFIG_FILE` + `AWS_SHARED_CREDENTIALS_FILE` env vars specifying file location, default file location via `AWS_SDK_LOAD_CONFIG` env var, and `awsConfigFile` config property; see [general configuration options](#general-config)
  - [Learn more about shared `credentials` + `config` files here](https://docs.aws.amazon.com/sdkref/latest/guide/file-format.html)
- External processes
  - [Learn more about external processes here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sourcing-external.html)
- IMDSv2
  - First, container (ECS) endpoints are checked via `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI`, then `AWS_CONTAINER_CREDENTIALS_FULL_URI` environment variables
  - If ECS is not found, instance (EC2) endpoints are checked via [passed `imds` config](#credential-provider-chain-config), then via `AWS_EC2_METADATA_SERVICE_ENDPOINT` + `AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE` environment variables, then via `ec2_metadata_service_endpoint` + `ec2_metadata_service_endpoint_mode` properties in shared `credentials` + `config` files


### Credential loading caveats

- IMDSv1 is not currently supported, as it is considered insecure and no longer [AWS's standard version of IMDS](https://aws.amazon.com/blogs/aws/amazon-ec2-instance-metadata-service-imdsv2-by-default/)
- To improve performance when acquiring IMDSv2 credentials in long-lived processes, IMDSv2 host availability is cached for the duration of the Node.js process; this availability status caching behavior may be changed in the future
- Currently, soon-to-be expired SSO tokens are not automatically refreshed by `aws-lite`; PRs are welcome should the community deem this a necessary feature
- [Assuming IAM roles via OAuth 2.0 access token or OIDC token files](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html#cli-configure-role-oidc) is not currently supported; PRs are welcome should the community deem this a necessary feature
- The following credential providers cannot be used in Lambda environments: SSO, shared `credentials` + `config` files, external processes, and IMDSv2

Additional credential resource provider chain resources:
- [AWS CLI credential provider chain docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html)
- [AWS SDK credential provider chain docs](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html)
- [Additional SDK authentication + access docs](https://docs.aws.amazon.com/sdkref/latest/guide/access.html)
