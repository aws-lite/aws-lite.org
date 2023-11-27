---
title: Configuration
description: Credential and general configuration options for aws-lite
next: request-response
---
# Configuration

The following options may be passed when instantiating the `aws-lite` client:


## Credentials + region

- **`accessKeyId` (string)**
  - AWS access key; if not provided, defaults to `AWS_ACCESS_KEY_ID` or `AWS_ACCESS_KEY` env vars, and then to a `~/.aws/credentials` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var
  - If no access key is found, `aws-lite` will throw
- **`secretAccessKey` (string)**
  - AWS secret key; if not provided, defaults to `AWS_SECRET_ACCESS_KEY` or `AWS_SECRET_KEY` env vars, and then to a `~/.aws/credentials` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var
  - If no secret key is found, `aws-lite` will throw
- **`sessionToken` (string)**
  - AWS session token; if not provided, defaults to `AWS_SESSION_TOKEN` env var, and then to a `~/.aws/credentials` file, if present
  - Manually specify a credentials file location with the `AWS_SHARED_CREDENTIALS_FILE` env var
- **`region` (string)**
  - AWS service region (e.g. `us-west-1`); if not provided, defaults to `AWS_REGION`, `AWS_DEFAULT_REGION`, or `AMAZON_REGION` env vars
  - By default, a `~/.aws/config` (or custom) file will only be loaded by making the `AWS_SDK_LOAD_CONFIG` env var true
  - Manually specify a config file location with the `AWS_CONFIG_FILE` (and `AWS_SDK_LOAD_CONFIG`) env var
  - If no region is found, `aws-lite` will throw
  - Region setting can be overridden per-request
- **`profile` (string)**
  - AWS config + credentials profile; if not provided, defaults to `AWS_PROFILE` env var, and then to the `default` profile, if present


## General config

- **`autoloadPlugins` (boolean) [default = true]**
  - Automatically load installed `@aws-lite/*` + `aws-lite-plugin-*` plugins
- **`debug` (boolean) [default = false]**
  - Enable debug logging to console
- **`endpointPrefix` (string)**
  - Add prefix to endpoint requests, helpful for local testing
- **`host` (string)**
  - Set a custom host name to use, helpful for local testing
- **`keepAlive` (boolean) [default = true]**
  - Disable Node.js's connection keep-alive, helpful for local testing
- **`plugins` (array)**
  - Define `aws-lite` plugins to load; can be module names (e.g. `@aws-lite/dynamodb`) or file paths on the local machine (e.g. `/path/to/my/plugin.mjs`)
  - By default, all installed [official plugins (prefixed with `@aws-lite/`)](#list-of-official-aws-lite-plugins) and unofficial plugins (prefixed with `aws-lite-plugin-`) will be loaded
- **`port` (number)**
  - Set a custom port number to use, helpful for local testing
- **`protocol` (string) [default = `https`]**
  - Set the connection protocol to `http`, helpful for local testing
- **`responseContentType` (string)**
  - Set an overriding Content-Type header for all responses, helpful for local testing


## Example

```javascript
import awsLite from '@aws-lite/client'

// Load everything from env vars + defaults
let aws = await awsLite()

// Or specify options
aws = await awsLite({
  accessKeyId: '$accessKey',
  secretAccessKey: '$secretKey',
  sessionToken: '$sessionToken',
  region: 'us-west-1',
  profile: 'work',
  autoloadPlugins: false,
  debug: true,
  endpointPrefix: '/test/path/',
  host: 'localhost',
  keepAlive: false,
  plugins: [ '@aws-lite/dynamodb', '/a/custom/local/plugin/path' ],
  port: 12345,
  protocol: 'http',
  responseContentType: 'application/json',
})
```
