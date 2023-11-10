import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import plugins from './aws-lite/plugins.mjs'
import url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

async function main () {
  const start = Date.now()
  const all = []
  for (let item of plugins) {
    const { display, service } = item
    all.push({ display, service })

    const pluginPath = join(__dirname, 'aws-lite', 'plugins', service, 'src', 'index.mjs')
    const plugin = (await import(pluginPath)).default
    const data = Object.assign(plugin, item)
    const dataDir = join(__dirname, '..', 'app', 'docs', 'services', 'data')
    mkdirSync(dataDir, { recursive: true })

    const dataFile = join(dataDir, `${service}.json`)
    writeFileSync(dataFile, JSON.stringify(data))

    const allFile = join(__dirname, '..', 'app', 'elements', 'services.json')
    writeFileSync(allFile, JSON.stringify(all))
  }
  console.log(`Generated plugin doc data in ${Date.now() - start}ms`)
}
main()
