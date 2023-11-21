import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
let services

export default function SiteNav ({ html }) {
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
<h2 class="font-semibold">Get Started</h2>
<ul class="list-none mb0">
  ${Nav.join('\n  ')}
</ul>
`

  const Services = services.map(({ display, service }) => {
    return /* html */`<li><a href="/services/${service}">${display}</a></li>`
  })
  const ServicesNav = `
<h2 class="font-semibold">Services</h2>
<ul class="list-none mb0">
  ${Services.join('\n  ')}
</ul>
`

  return html`
    <style>
      :host {
        display: block;
        color: var(--fore-dark);
        padding: var(--space-0);
      }

      li {
        padding-block: var(--space--4);
      }

      li a {
        color: var(--accent);
      }

      @media screen and (min-width: 52em) {
        :host {
          color: var(--fore);
        }

        li {
          font-size: var(--text--1);
        }
      }
    </style>
    <nav>
      ${MainNav + ServicesNav}
    </nav>
  `
}
