---
title: Performance
description: Open, reproducible, real-world metrics for the performance of aws-lite and other AWS SDKs
next: contributing
---
# Performance

Performance is one of the tent poles of `aws-lite`. We take it seriously because we want your applications to be as fast possible.

As such, we regularly test and publish open, reproducible, real-world metrics for every key aspect of performance, comparing `aws-lite` to AWS's own `aws-sdk` (v2) and `@aws-sdk` (v3). Learn more and view source at the [`aws-lite` performance project on GitHub](https://github.com/aws-lite/performance/).

We currently track individual and aggregated performance benchmarking the following AWS service clients: [DynamoDB](#dynamodb), [S3](#s3), [IAM](#iam), [CloudFormation](#cloudformation), [Lambda](#lambda), and [STS](#sts).

All metrics are published below (or [skip straight to the wrap-up](#time-to-respond%2C-not-including-coldstart)).


## Methodology

In addition to publishing our source, [raw data](#latest-data), and final results, we believe it's important to share the details of our performance testing methodology, too. [Learn more here](https://github.com/aws-lite/performance/#methodology).

---

**Stats last updated:** <!-- last_published -->


## Coldstart latency

Coldstart latency measures the impact of each SDK on AWS Lambda coldstarts – the pre-initialization phase where your code payload is loaded into the Lambda micro VM.

In these stats we expect to see lower values for either very small code payloads (such as `aws-lite`), or scenarios where we are using the AWS SDK included in the Lambda image (e.g. `@aws-sdk` v3 raw in `nodejs20.x`). Coldstart latency increases as code payload sizes increase; this is often observed with bundled SDKs.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Coldstart latency" srcset="/_public/startup/coldstart-dark.png">
  <img alt="Benchmark statistics - Coldstart latency" src="/_public/startup/coldstart.png">
</picture>

<!-- stats_coldstart -->


## Initialization latency

Initialization latency measures the impact of each SDK on the [initialization phase of the Lambda lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html#runtimes-lifecycle), including static analysis and execution of any code outside the scope of the Lambda handler.

Here we expect to see relatively similar values, as the performance benchmark has very little static code or init-time execution.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Initialization latency" srcset="/_public/startup/init-dark.png">
  <img alt="Benchmark statistics - Initialization latency" src="/_public/startup/init.png">
</picture>

<!-- stats_init -->



## Peak memory consumption over Lambda baseline

Peak memory consumption measures each SDK's peak memory usage throughout import / require, instantiation, read, and write.

To make it easier to assess the memory impact of each SDK, the graph is presented as a value over (thus, not including) the Lambda Node.js baseline. Baseline memory consumption would be expected to include Node.js itself, Lambda bootstrap processes, etc. The memory baseline used always corresponds to the equivalent peak memory of the control test (e.g. `aws-lite` peak memory p95 - `control` peak memory p95 = peak memory over baseline p95).

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Peak memory consumption over Lambda baseline" srcset="/_public/aggregate/memory-dark.png">
  <img alt="Benchmark statistics - Peak memory consumption over Lambda baseline" src="/_public/aggregate/memory.png">
</picture>

<!-- stats_memory -->



## Time to respond, not including coldstart

Time to respond measures the total execution time of each SDK, not including [coldstart](#coldstart-latency) or [initialization](#initialization-latency). In real-world usage, Lambda coldstarts are usually less common than warm invocations, so this metric illustrates the most common case for most applications.

Results below show aggregate data for sequentially executing all six tested clients, followed by [individual client response times](#individual-client-response-times). (Detailed client statistics can be [found here](#client-metrics).)

> Note: Ideally, response times should be sub-1000ms to ensure fast responses in customer hot-paths. However, the aggregate benchmark simulates importing, instantiating, reading, and writing from six different AWS services in a single execution. When authoring customer-facing business logic, one should ideally utilize fewer services and/or calls to maintain a high degree of customer performance.


<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart" srcset="/_public/aggregate/execution-time-all-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart" src="/_public/aggregate/execution-time-all.png">
</picture>

<!-- stats_executionTimeAll -->

---

### Individual client response times

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart (DynamoDB)" srcset="/_public/dynamodb/execution-time-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart (DynamoDB)" src="/_public/dynamodb/execution-time.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart (S3)" srcset="/_public/s3/execution-time-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart (S3)" src="/_public/s3/execution-time.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart (IAM)" srcset="/_public/iam/execution-time-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart (IAM)" src="/_public/iam/execution-time.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart (CloudFormation)" srcset="/_public/cloudFormation/execution-time-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart (CloudFormation)" src="/_public/cloudformation/execution-time.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart (Lambda)" srcset="/_public/lambda/execution-time-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart (Lambda)" src="/_public/lambda/execution-time.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Time to respond, not including coldstart (STS)" srcset="/_public/sts/execution-time-dark.png">
  <img alt="Benchmark statistics - Time to respond, not including coldstart (STS)" src="/_public/sts/execution-time.png">
</picture>



## Total time to respond, including coldstart

Total time to respond measures the total execution time of each SDK, including [coldstart](#coldstart-latency) or [initialization](#initialization-latency). In real-world usage, this metric represents a normalized "worst case" response time.

> Note: Ideally, response times should be sub-1000ms to ensure fast responses in customer hot-paths. However, the aggregate benchmark simulates importing, instantiating, reading, and writing from six different AWS services in a single execution. When authoring customer-facing business logic, one should ideally utilize fewer services and/or calls to maintain a high degree of customer performance.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Total time to respond, including coldstart" srcset="/_public/aggregate/total-time-all-dark.png">
  <img alt="Benchmark statistics - Total time to respond, including coldstart" src="/_public/aggregate/total-time-all.png">
</picture>

<!-- stats_totalTimeAll -->

---

## Client metrics

### Performance criteria

Each SDK client is measured on the following criteria:

- **Import / require** - Measurement of the impact of importing / requiring each SDK client.
  - It is important to note that import / require times are tied to individual services. In real world use your business logic may rely on multiple AWS services – each of which necessitating additional imports, thereby compounding overall response latency.
  - Ideally, all import / require operations should be sub-100ms to ensure fast responses in customer hot-paths.
- **Instantiate** - Measurement of the impact of instantiating a new SDK client – a necessary step before making any service API calls. Ideally all operations should be sub-50ms to ensure fast responses in customer hot-paths.
- **Read** - Measurement of a simple read operation to a service API. All reads are identical across SDKs.
- **Write** - Measurement of a simple write operation to a service API. All writes are identical across SDKs.
  - Note: some clients may be read-only, based on the service in question (example: `STS`).
- **Total** - Measurement of the total latency associated with all the above operations, thereby demonstrating the overall impact of using a given SDK client.

---

### CloudFormation

#### Import / require

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Import / require CloudFormation" srcset="/_public/cloudformation/import-dark.png">
  <img alt="Benchmark statistics - Import / require CloudFormation" src="/_public/cloudformation/import.png">
</picture>

<!-- stats_importCloudFormation -->


#### Instantiate

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Instantiate a CloudFormation client" srcset="/_public/cloudformation/instantiate-dark.png">
  <img alt="Benchmark statistics - Instantiate a CloudFormation client" src="/_public/cloudformation/instantiate.png">
</picture>

<!-- stats_instantiateCloudFormation -->


#### Read

Here we measure the latency associated with listing a single CloudFormation stack's resources ([`ListStackResources()`](/services/cloudformation#liststackresources)), and parsing and returning results.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - CloudFormation - read one stack" srcset="/_public/cloudformation/read-dark.png">
  <img alt="Benchmark statistics - CloudFormation - read one stack" src="/_public/cloudformation/read.png">
</picture>

<!-- stats_readCloudFormation -->


#### Write

Here we measure the latency associated with updating a single CloudFormation stack's configuration ([`UpdateTerminationProtection()`](/services/cloudformation#updateterminationprotection)). This method was selected specifically to help limit the impact of stack update latency, which can be highly variable, from benchmarking routines.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - CloudFormation - write one stack" srcset="/_public/cloudformation/write-dark.png">
  <img alt="Benchmark statistics - CloudFormation - write one stack" src="/_public/cloudformation/write.png">
</picture>

<!-- stats_writeCloudFormation -->


#### Total

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - CloudFormation - time to execute, not including coldstart" srcset="/_public/cloudformation/execution-time-dark.png">
  <img alt="Benchmark statistics - CloudFormation - time to execute, not including coldstart" src="/_public/cloudformation/execution-time.png">
</picture>

<!-- stats_executionTimeCloudFormation -->

---

### DynamoDB

#### Import / require

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Import / require DynamoDB" srcset="/_public/dynamodb/import-dark.png">
  <img alt="Benchmark statistics - Import / require DynamoDB" src="/_public/dynamodb/import.png">
</picture>

<!-- stats_importDynamoDB -->


#### Instantiate

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Instantiate a DynamoDB client" srcset="/_public/dynamodb/instantiate-dark.png">
  <img alt="Benchmark statistics - Instantiate a DynamoDB client" src="/_public/dynamodb/instantiate.png">
</picture>

<!-- stats_instantiateDynamoDB -->


#### Read

Here we measure the latency associated with getting a single 100KB row from DynamoDB ([`GetItem()`](/services/dynamodb#getitem)), and parsing and returning results.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - DynamoDB - read one 100KB row" srcset="/_public/dynamodb/read-dark.png">
  <img alt="Benchmark statistics - DynamoDB - read one 100KB row" src="/_public/dynamodb/read.png">
</picture>

<!-- stats_readDynamoDB -->


#### Write

Here we measure the latency associated with writing a single 100KB row into DynamoDB ([`PutItem()`](/services/dynamodb#putitem)).

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - DynamoDB - write one 100KB row" srcset="/_public/dynamodb/write-dark.png">
  <img alt="Benchmark statistics - DynamoDB - write one 100KB row" src="/_public/dynamodb/write.png">
</picture>

<!-- stats_writeDynamoDB -->


#### Total

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - DynamoDB - time to execute, not including coldstart" srcset="/_public/dynamodb/execution-time-dark.png">
  <img alt="Benchmark statistics - DynamoDB - time to execute, not including coldstart" src="/_public/dynamodb/execution-time.png">
</picture>

<!-- stats_executionTimeDynamoDB -->

---

### IAM

#### Import / require

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Import / require IAM" srcset="/_public/iam/import-dark.png">
  <img alt="Benchmark statistics - Import / require IAM" src="/_public/iam/import.png">
</picture>

<!-- stats_importIAM -->


#### Instantiate

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Instantiate an IAM client" srcset="/_public/iam/instantiate-dark.png">
  <img alt="Benchmark statistics - Instantiate an IAM client" src="/_public/iam/instantiate.png">
</picture>

<!-- stats_instantiateIAM -->


#### Read

Here we measure the latency associated with getting a single role from IAM ([`GetRole()`](/services/iam#getrole)), and parsing and returning results.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - IAM - read one role" srcset="/_public/iam/read-dark.png">
  <img alt="Benchmark statistics - IAM - read one role" src="/_public/iam/read.png">
</picture>

<!-- stats_readIAM -->


#### Write

Here we measure the latency associated with updating a single IAM role ([`UpdateRole()`](/services/iam#updaterole)).

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - IAM - write one role" srcset="/_public/iam/write-dark.png">
  <img alt="Benchmark statistics - IAM - write one role" src="/_public/iam/write.png">
</picture>

<!-- stats_writeIAM -->


#### Total

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - IAM - time to execute, not including coldstart" srcset="/_public/iam/execution-time-dark.png">
  <img alt="Benchmark statistics - IAM - time to execute, not including coldstart" src="/_public/iam/execution-time.png">
</picture>

<!-- stats_executionTimeIAM -->

---


### Lambda

#### Import / require

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Import / require Lambda" srcset="/_public/lambda/import-dark.png">
  <img alt="Benchmark statistics - Import / require Lambda" src="/_public/lambda/import.png">
</picture>

<!-- stats_importLambda -->


#### Instantiate

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Instantiate a Lambda client" srcset="/_public/lambda/instantiate-dark.png">
  <img alt="Benchmark statistics - Instantiate a Lambda client" src="/_public/lambda/instantiate.png">
</picture>

<!-- stats_instantiateLambda -->


#### Read

Here we measure the latency associated with getting a single Lambda's configuration ([`GetFunctionConfiguration()`](/services/lambda#getfunctionconfiguration)), and parsing and returning results.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Lambda - read one configuration" srcset="/_public/lambda/read-dark.png">
  <img alt="Benchmark statistics - Lambda - read one configuration" src="/_public/lambda/read.png">
</picture>

<!-- stats_readLambda -->


#### Write

Here we measure the latency associated with updating a single Lambda's configuration ([`UpdateFunctionConfiguration()`](/services/lambda#updatefunctionconfiguration)).

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Lambda - write one configuration" srcset="/_public/lambda/write-dark.png">
  <img alt="Benchmark statistics - Lambda - write one configuration" src="/_public/lambda/write.png">
</picture>

<!-- stats_writeLambda -->


#### Total

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Lambda - time to execute, not including coldstart" srcset="/_public/lambda/execution-time-dark.png">
  <img alt="Benchmark statistics - Lambda - time to execute, not including coldstart" src="/_public/lambda/execution-time.png">
</picture>

<!-- stats_executionTimeLambda -->

---

### S3

#### Import / require

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Import / require S3" srcset="/_public/s3/import-dark.png">
  <img alt="Benchmark statistics - Import / require S3" src="/_public/s3/import.png">
</picture>

<!-- stats_importS3 -->


#### Instantiate

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Instantiate an S3 client" srcset="/_public/s3/instantiate-dark.png">
  <img alt="Benchmark statistics - Instantiate an S3 client" src="/_public/s3/instantiate.png">
</picture>

<!-- stats_instantiateS3 -->


#### Read

Here we measure the latency associated with getting a single 1MB object from S3 ([`GetObject()`](/services/s3#getobject)), and parsing and returning results.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - S3 - read one 1MB object" srcset="/_public/s3/read-dark.png">
  <img alt="Benchmark statistics - S3 - read one 1MB object" src="/_public/s3/read.png">
</picture>

<!-- stats_readS3 -->


#### Write

Here we measure the latency associated with writing a single 1MB object into S3 ([`PutObject()`](/services/s3#putobject)).

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - S3 - write one 1MB object" srcset="/_public/s3/write-dark.png">
  <img alt="Benchmark statistics - S3 - write one 1MB object" src="/_public/s3/write.png">
</picture>

<!-- stats_writeS3 -->


#### Total

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - S3 - time to execute, not including coldstart" srcset="/_public/s3/execution-time-dark.png">
  <img alt="Benchmark statistics - S3 - time to execute, not including coldstart" src="/_public/s3/execution-time.png">
</picture>

<!-- stats_executionTimeS3 -->

---

### STS

#### Import / require

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Import / require STS" srcset="/_public/sts/import-dark.png">
  <img alt="Benchmark statistics - Import / require STS" src="/_public/sts/import.png">
</picture>

<!-- stats_importSTS -->


#### Instantiate

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - Instantiate a STS client" srcset="/_public/sts/instantiate-dark.png">
  <img alt="Benchmark statistics - Instantiate a STS client" src="/_public/sts/instantiate.png">
</picture>

<!-- stats_instantiateSTS -->


#### Read

Here we measure the latency associated with reading one identity via STS ([`GetCallerIdentity()`](/services/sTS#getcalleridentity)), and parsing and returning results.

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - STS - read one identity" srcset="/_public/sts/read-dark.png">
  <img alt="Benchmark statistics - STS - read one identity" src="/_public/sts/read.png">
</picture>

<!-- stats_readSTS -->


#### Total

<picture>
  <source media="(prefers-color-scheme: dark)" alt="Benchmark statistics - STS - time to execute, not including coldstart" srcset="/_public/sts/execution-time-dark.png">
  <img alt="Benchmark statistics - STS - time to execute, not including coldstart" src="/_public/sts/execution-time.png">
</picture>

<!-- stats_executionTimeSTS -->

---

## Latest data

If you'd like to dig deeper, here's the data from the latest performance run:

- [Raw, unparsed results](https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/latest-results.json)
- [Parsed results](https://performanceproduction-assetsbucket-1xqwku8953q8m.s3.us-west-2.amazonaws.com/latest-results-parsed.json)
