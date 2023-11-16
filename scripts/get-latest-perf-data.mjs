import awsLite from '@aws-lite/client'
import { join } from 'node:path'
import { writeFileSync } from 'node:fs'

async function main () {
  const start = Date.now()

  const aws = await awsLite({ region: 'us-west-2' })
  const apiDir = join(process.cwd(), '..', 'app', 'api')
  const Bucket = 'performanceproduction-assetsbucket-1xqwku8953q8m'
  async function get (Key) {
    const result = await aws.s3.GetObject({ Bucket, Key })
    writeFileSync(join(apiDir, Key), JSON.stringify(result))
  }

  await get('checksum.json')
  await get('latest-results-parsed.json')
  console.log(`Wrote latest perf data in ${Date.now() - start}ms`)
}
main()
