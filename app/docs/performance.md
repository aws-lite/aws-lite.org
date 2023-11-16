## Coldstart latency

Coldstart latency measures the impact of each SDK on an AWS Lambda coldstart – the pre-initialization phase where your code payload is loaded into the Lambda micro VM.

In these stats we expect to see lower values for either very small code payloads (such as `aws-lite`), or scenarios where we are using the AWS SDK included in the Lambda image (e.g. `@aws-sdk` v3 raw in `nodejs20.x`). Coldstart latency increases as code payload sizes increases, which a result of bundling.

<picture>
  <img alt="Benchmark statistics - Coldstart latency" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/coldstart.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Coldstart latency" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/coldstart-dark.png">
</picture>

<!-- stats_coldstart -->


## Initialization latency

Initialization latency measures the impact of each SDK on the [initialization phase of the Lambda lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html#runtimes-lifecycle), including analysis and execution of static code.

Here we expect to see relatively similar values, as the performance benchmark has almost no static code or init-time execution.

<picture>
  <img alt="Benchmark statistics - Initialization latency" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/init.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Initialization latency" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/init-dark.png">
</picture>

<!-- stats_init -->



## Import / require

Here we measure the impact of importing / requiring each SDK. Ideally, all import / require operations should be sub-100ms to ensure fast responses in customer hot-paths.

It is important to note that import / require times are tied to individual services. In this benchmark, only the DynamoDB service client is imported. In the real world, your business logic may make use of of multiple AWS services; each of which would necessitate additional imports, thereby compounding overall response latency.

<picture>
  <img alt="Benchmark statistics - Import / require" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/import-dep.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Import / require" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/import-dep-dark.png">
</picture>

<!-- stats_importDep -->



## Instantiate a client

Here we measure the impact of instantiating a new SDK client – a necessary step before making any service API calls. Ideally all operations should be sub-50ms to ensure fast responses in customer hot-paths.

<picture>
  <img alt="Benchmark statistics - Instantiate a client" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/instantiate.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Instantiate a client" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/instantiate-dark.png">
</picture>

<!-- stats_instantiate -->



## DynamoDB - read one 100KB row

Here we measure the latency associated with reading a single 100KB row from DynamoDB, and parsing and returning results. All reads are identical across SDKs.

<picture>
  <img alt="Benchmark statistics - DynamoDB - read one 100KB row" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/read.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - DynamoDB - read one 100KB row" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/read-dark.png">
</picture>

<!-- stats_read -->



## DynamoDB - write one 100KB row

Here we measure the latency associated with writing a single 100KB row into DynamoDB. All writes are identical across SDKs.

<picture>
  <img alt="Benchmark statistics - DynamoDB - write one 100KB row" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/write.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - DynamoDB - write one 100KB row" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/write-dark.png">
</picture>

<!-- stats_write -->



## Peak memory consumption over Lambda baseline

Peak memory consumption measures each SDK's peak memory usage throughout the above four steps (import / require, instantiation, read, and write).

To make the impact of each SDK easier to assess, the graph is presented as a value over (thus, not including) the Lambda Node.js baseline. Baseline memory consumption would be expected to include Node.js itself, Lambda bootstrap processes, etc. The memory baseline used always corresponds to the equivalent peak memory of the control test (e.g. `aws-lite` peak memory p95 - control peak memory p95).

<picture>
  <img alt="Benchmark statistics - Peak memory consumption over Lambda baseline" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/memory.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Peak memory consumption over Lambda baseline" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/memory-dark.png">
</picture>

<!-- stats_memory -->



## Time to respond, not including coldstart

Time to respond measures the total execution time of each SDK, not including coldstart (or initialization). In real-world usage, Lambda coldstarts are usually less common than warm invocations, so this metric illustrates a more common case. Ideally all times should be sub-1000ms to ensure fast responses in customer hot-paths.

<picture>
  <img alt="Benchmark statistics - Time to respond, not including coldstart" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/execution-time.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/execution-time-dark.png">
</picture>

<!-- stats_executionTime -->



## Total time to respond, including coldstart

Total time to respond measures the total execution time of each SDK, including coldstart and initialization. In real-world usage, this metric represents a normalized "worst case" response time. Ideally all times should be sub-1000ms to ensure fast responses in customer hot-paths.

<picture>
  <img alt="Benchmark statistics - Total time to respond, including coldstart" src="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/total-time.png">
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Total time to respond, including coldstart" srcset="https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/total-time-dark.png">
</picture>

<!-- stats_totalTime -->
