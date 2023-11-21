# Contributing

AWS has (as of this writing) nearly 300 service APIs – `aws-lite` would love your help in authoring and maintaining official (and unofficial) plugins!


## Guidelines for authoring `@aws-lite/*` plugins

Similar to the [Definitely Typed (`@types`)](https://github.com/DefinitelyTyped/DefinitelyTyped) model, `aws-lite` releases packages maintained by third parties under the `@aws-lite/*` namespace.

Plugins released within the `@aws-lite/*` namespace are expected to conform to the following guidelines:

- `@aws-lite/*` plugins should read more or less like the others, and broadly adhere to the following style:
  - Plugins should be authored in ESM, be functional (read: no classes), and avoid globals / closures, etc. wherever possible
  - Plugins should be authored in JavaScript; PRs including TypeScript or other transpiled dialects will not be accepted
- Plugin semantics should adhere as closely as possible to a given service API's documented semantics, and then to interoperability with AWS SDK v2 and v3 (in that order)
  - For example: if a service API's documentation refers to an input as `FooBar`, you should use the property name of `FooBar`, and not `foobar` or `fooBar`
  - Another example: if a service API responds with a variety of data across headers and body, adhere to interoperable response semantics of AWS SDK v2 / v3
- Plugins should cover all documented methods for a given service, and include links for each method within the plugin
  - Plugins may be a work in progress; methods not yet completed should be enumerated with `awsDoc` links and denoted `disabled`
- Each plugin is singular for a given service
  - Example: we will not ship `@aws-lite/lambda`, `@aws-lite/lambda-1`, `@aws-lite/lambda-new`, etc.
  - If you would like to become a maintainer for an existing plugin, you may do so with the permission of the current maintainer(s)
- To maintain the speed, security, and lightweight size of the `aws-lite` project, plugins should ideally have zero external dependencies
  - If external dependencies are absolutely necessary, they should be justifiable
  - Expect the inclusion of any external dependencies to be heavily audited
- Ideally (but not necessarily), each plugin should include its own tests
  - Tests should follow the project's testing methodology, utilizing `tape` as the runner and `tap-arc` as the output parser
  - Tests should not rely on interfacing with live AWS services
- Wherever possible, plugin maintainers should attempt to employ manual verification of their plugins during development
- By opting to author a plugin, you are opting to provide reasonably prompt bug fixes, updates, etc. for the community at large
  - If you are not willing to make that kind of commitment but still want to publish your plugins publicly, please feel free to do so outside this repo with an `aws-lite-plugin-` package prefix


## Contributor setup

- Pull down the [`aws-lite` repo](https://github.com/architect/aws-lite)
- Install dependencies and run the normal test suite: `npm it`
- To create an `@aws-lite/*` plugin:
  - Add your plugin to the [`plugins` file](https://github.com/architect/aws-lite/blob/main/plugins.mjs)
  - Run `npm run gen`
- Create a PR that adheres to our plugin development guidelines and / or [testing methodology](#testing)

> It is advisable you have AWS credentials on your local development machine for manual verification of any client or service plugin changes


## Testing

### Methodology

Due to the mission-critical nature of this project, we strive for 100% test coverage on the core client. (We also acknowledge that 100% coverage does not mean 0 bugs, so meaningful and thorough tests are much appreciated.) As such, PRs to the core client must include corresponding unit and integration tests.

Moreover, due to the nature of interacting with AWS services, manual validation is not only often necessary, but in many cases it's required. (For example: running automated test suites on EKS may be slow, onerous, and financially expensive.) It should be generally expected that PRs have been manually validated as well.


### Live AWS tests

This project includes a lightweight test suite that runs against a minimal number of live AWS resources (`npm run test:live`). Running this test suite from your machine is highly encouraged. However, it is not currently a pre-commit step, and is thus not a requirement to submitting PRs.

One should expect that when supplying AWS credentials for running the live AWS client test suite, only a limited number of free tier resources will be created, and these resources should never exceed the free tier.


## Packages

### Creating `@aws-lite/*-types` packages

Each `@aws-lite/*` plugin has an optional corresponding `@aws-lite/*-types` package, authored as `index.d.ts`. These packages are largely auto-generated, but may include hand-written types.

After adding a plugin and running `npm run gen`, a `types/` directory will be added to the newly created plugin directory. Each time `npm run gen` is run, the plugin implementation is analyzed and the types are automatically regenerated. To ensure all plugin changes are kept up to date, `npm run gen` is always run as a pre-commit hook.

As mentioned above, it is possible to maintain hand-written types alongside generated types by specifying imports and method types outside of their respective "fences" in the generated `index.d.ts` file. For example, to provide a custom type for the `s3` plugin's `PutObject` method, you could do the following:

```typescript
// plugins/s3/types/index.d.ts
declare interface AwsLiteS3 {
  // $METHODS_START
  /** edited for brevity */
  GetObject: (input: ) => Promise<GetObjectResponse>
  HeadObject: (input: ) => Promise<HeadObjectResponse>
  ListObjectsV2: (input: ) => Promise<ListObjectsV2Response>
  // $METHODS_END

  PutObject: (input: ACustomInputType) => Promise<ACustomResponseType>
}
```

Because the `PutObject` method is defined outside of the `$METHODS_START` and `$METHODS_END` fences, it will not be overwritten by the next run of `npm run gen`. Further, the generator won't create a duplicate `PutObject` method inside the fences.


### Releasing `@aws-lite/*` plugins

To release an update to a `@aws-lite/*` plugin, use the `npm run plugin` script with similar syntax to the `npm version` command, like so:

- Commit all your changes and start in a clean state
- Release a plugin (and its types): `npm run plugin [major|minor|patch] $plugin`
  - Example: `npm run plugin minor dynamodb`
- Patch a plugin's types only: `npm run plugin patch $plugin-types`
  - Example: `npm run plugin patch dynamodb-types`
  - Note: these manual changes to types can only be issued as patches
- Push the commit
