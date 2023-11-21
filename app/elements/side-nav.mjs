import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
let services

export default function sideNav (params) {
  const { html } = params
  if (!services) {
    const servicesFile = join(__dirname, 'services.json')
    services = JSON.parse(readFileSync(servicesFile))
  }
  const Docs = [
    'Intro',
    'Configuration',
    'Request/response',
    'API',
    'Performance',
    'Contributing',
  ]
  const Nav = Docs.map(i => {
    const slug = i === 'Intro' ? '' : i.toLowerCase().replace(/[ \/]/g, '-')
    return /* html */`<li><a href="/${slug}">${i}</a></li>`
  })
  const MainNav = `
<ul>
  ${Nav.join('\n  ')}
</ul>
`

  const Services = services.map(({ display, service }) => {
    return /* html */`<li><a href="/services/${service}">${display}</a></li>`
  })
  const ServicesNav = `
<h2>Services</h2>
<ul>
  ${Services.join('\n  ')}
</ul>
`

  return html`${MainNav + ServicesNav}`
}
