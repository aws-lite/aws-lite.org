import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
let services

export default function SiteNav ({ html, state }) {
  const { store } = state
  const { page } = store

  if (!services) {
    const servicesFile = join(__dirname, 'services.json')
    services = JSON.parse(readFileSync(servicesFile))
  }

  const Docs = [
    'Intro',
    'Configuration',
    'Request/response',
    'Using TypeScript',
    'Plugin API',
    'Testing API',
    'Performance',
    'Contributing',
  ]

  const Nav = Docs.map(i => {
    const slug = i === 'Intro' ? '' : i.toLowerCase().replace(/[ \/]/g, '-')
    const active = page === slug || (page === 'index' && i === 'Intro')
    return /* html */`<li><a href="/${slug}" ${active ? "class='active'" : ''}>${i}</a></li>`
  })
  const MainNav = `
    <h2 class="font-semibold">Get Started</h2>
    <ul class="list-none mb0">
      ${Nav.join('\n  ')}
    </ul>
  `

  const Services = services.map(({ display, service }) => {
    const active = page === `services/${service}`
    return /* html */`<li><a href="/services/${service}" ${active ? "class='active'" : ''}>${display}</a></li>`
  })

  const ServicesNav = `
    <h2 class="font-semibold">Services</h2>
    <ul class="list-none mb0">
      ${Services.join('\n  ')}
      <li aria-hidden="true"><hr /></li>
      <li><a href="/contributing">Missing a service?</a></li>
    </ul>
  `

  return html`
    <style>
      :host {
        display: block;
        color: var(--fore-dark);
        padding: var(--space-0);
      }

      li a {
        border-inline-start: 4px solid transparent;
        color: var(--accent);
        display: block;
        margin-inline-start: calc((var(--space--4) * -1) - 4px);
        padding: 0.25em 0.5em;
      }

      li a:hover,
      li a.active {
        background: var(--muted-accent);
        border-color: var(--accent);
        color: var(--fore);
      }

      li a.active {
        font-weight: 600;
      }

      hr {
        border-block-start: 1px solid hsla(0deg 0% 50% / 0.5);
        padding-block-start: 0.5em;
        margin-block-start: 0.5em;
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
