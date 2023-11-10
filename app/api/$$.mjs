import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import getService from '../docs/services/get-service.mjs'
import { Arcdown } from 'arcdown'
import url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const arcdown = new Arcdown({})

const cache = {}

export async function get (req) {
  let { proxy: page } = req.params
  page = page || 'index'
  if (cache[page]) return cache[page]

  try {
    if (page.startsWith('services/')) {
      const service = page.split('/')[1]
      const serviceData = await getService(service)
      const doc = await arcdown.render(serviceData.md)
      cache[service] = doc
      return { json: { ...serviceData, doc } }
    }

    const pagePath = join(__dirname, '..', 'docs', `${page}.md`)
    const pageContents = await readFile(pagePath)
    const doc = await arcdown.render(pageContents)
    cache[page] = doc

    return { json: { doc } }
  }
  catch {
    return { statusCode: 404 }
  }
}
