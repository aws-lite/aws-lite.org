import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import getService from '../docs/services/get-service.mjs'
import { Arcdown } from 'arcdown'
import markdownItAnchor from 'markdown-it-anchor'
import url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const arcdown = new Arcdown({
  pluginOverrides: {
    markdownItToc: {
      level: [ 2, 3 ],
    },
    markdownItAnchor: {
      permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true })
    }
  }
})

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
      cache[service] = { json: { ...serviceData, doc, page, isService: true } }
      return cache[service]
    }

    const pagePath = join(__dirname, '..', 'docs', `${page}.md`)
    let pageContents = await readFile(pagePath)

    if (page === 'performance') {
      pageContents = pageContents.toString()
      const getPerfStats = (await import('../lib/perf-stats.mjs')).default

      const statsFile = join(__dirname, 'latest-results-parsed.json')
      const statsData = JSON.parse(await readFile(statsFile))
      const statsMd = getPerfStats(statsData)
      Object.entries(statsMd).forEach(([ stat, md ]) => {
        let re = new RegExp(`<!-- stats_${stat} -->`, 'g')
        pageContents = pageContents.replace(re, md)
      })
      const checksumFile = join(__dirname, 'checksum.json')
      const checksumData = JSON.parse(await readFile(checksumFile))
      pageContents = pageContents.replace('<!-- last_published -->', checksumData.updated)
    }

    const doc = await arcdown.render(pageContents)
    cache[page] = { json: { doc, page } }

    return cache[page]
  }
  catch {
    // FIXME!
    return { statusCode: 404, json: { doc: 'oh noes' } }
  }
}
