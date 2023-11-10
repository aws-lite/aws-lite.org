import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import generateMethods from './generate-methods.mjs'
import url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const pluginMethodsRegex = /(?<=(<!-- METHOD_DOCS_START -->\n))[\s\S]*?(?=(<!-- METHOD_DOCS_END -->))/g

let tmpl

export default async function getMd (service) {
  if (!tmpl) {
    const tmplFile = join(__dirname, '$service.md')
    tmpl = (await readFile(tmplFile)).toString()
  }

  const serviceFile = join(__dirname, 'data', `${service}.json`)
  const data = JSON.parse(await readFile(serviceFile))
  const { maintainers } = data
  const packageName = `@aws-lite/${service}`

  let maintainerLinks = maintainers.map(p => `[${p}](https://github.com/${p.replace('@', '')})`).join(', ')
  let readme = tmpl
    .replace(/\$SERVICE/g, packageName)
    .replace(/\$MAINTAINERS/g, maintainerLinks)

  const methods = generateMethods(data)

  const md = readme.replace(pluginMethodsRegex, methods)

  return { ...data, md }
}
