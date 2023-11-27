export default function docsContent ({ html, state }) {
  const { store } = state
  const { display, doc, isService = false, service } = store

  const titlesByService = {
    'configuration': 'Configuration',
    'request-response': 'Request/response',
    'plugin-api': 'Plugin API',
    'performance': 'Performance',
    'contributing': 'Contributing',
    'using-typescript': 'Using TypeScript',
  }

  let edit = '', next = ''
  if (isService) {
    edit = `<div><a href="https://github.com/architect/aws-lite/blob/main/plugins/${service}/src/index.mjs">Contribute to this plugin</a></div>`
  }
  else {
    edit = `<div><a href="https://github.com/architect/aws-lite.org/blob/main/app/docs/${store.page}.md">Edit this page</a></div>`
    const nextDoc = doc?.frontmatter?.next
    if (nextDoc) next = `<div><a href="/${nextDoc}">Next: ${titlesByService[nextDoc]}</a></div>`
  }


  return html`
    <style>
      :host {
        display: block;
        padding: var(--space-0);
      }

      @media screen and (prefers-color-scheme: dark) {
        code {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      }

      h1 {
        font-weight: 700;
        font-size: var(--text-4);
        letter-spacing: -0.025em;
        margin-block-end: 0.25em;
      }

      ${isService ?
    `article h1 {
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: var(--text-1);
          font-weight: 500;
        }`
    : ''}

      :host > h1,
      article h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        line-height: 1.25;
        word-break: break-all;
      }

      h3,
      h4,
      h5,
      h6 {
        font-weight: 600;
        margin-block: var(--space-0);
      }

      :not(aside) > h2 {
        border-bottom: 2px solid var(--muted-accent);
        font-size: var(--text-2);
        font-weight: 625;
        letter-spacing: -0.0125em;
        margin-block: var(--space-4) var(--space-0);
        padding-block-end: 0.25em;
      }

      h3 {
        font-size: var(--text-0);
        font-weight: 700;
        letter-spacing: -0.0125em;
      }

      h4, h5, h6 { font-size: var(--text-0) }

      @media screen and (min-width: 52em) {
        ${isService ? '' : 'article h1 { font-size: var(--text-5); }'}
        :not(aside) > h2 { font-size: var(--text-3); }
        h3 { font-size: var(--text-2); }
        h4, h5, h6 { font-size: var(--text-1) }
      }

      :is(h1, h2, h3, h4, h5, h6) code {
        font-weight: 750;
      }

      :is(h1, h2, h3, h4, h5, h6) a {
        text-decoration: none;
      }

      :is(h1, h2, h3, h4, h5, h6) a:hover {
        text-decoration: underline;
      }

      :is(h2, h3, h4, h5, h6) a:after {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M13.0605 8.11073L14.4747 9.52494C17.2084 12.2586 17.2084 16.6908 14.4747 19.4244L14.1211 19.778C11.3875 22.5117 6.95531 22.5117 4.22164 19.778C1.48797 17.0443 1.48797 12.6122 4.22164 9.87849L5.63585 11.2927C3.68323 13.2453 3.68323 16.4112 5.63585 18.3638C7.58847 20.3164 10.7543 20.3164 12.7069 18.3638L13.0605 18.0102C15.0131 16.0576 15.0131 12.8918 13.0605 10.9392L11.6463 9.52494L13.0605 8.11073ZM19.778 14.1211L18.3638 12.7069C20.3164 10.7543 20.3164 7.58847 18.3638 5.63585C16.4112 3.68323 13.2453 3.68323 11.2927 5.63585L10.9392 5.98941C8.98653 7.94203 8.98653 11.1079 10.9392 13.0605L12.3534 14.4747L10.9392 15.8889L9.52494 14.4747C6.79127 11.741 6.79127 7.30886 9.52494 4.57519L9.87849 4.22164C12.6122 1.48797 17.0443 1.48797 19.778 4.22164C22.5117 6.95531 22.5117 11.3875 19.778 14.1211Z' fill='currentColor'%3E%3C/path%3E%3C/svg%3E");
        display: inline-block;
        inline-size: 12px;
        aspect-ratio: 1 / 1;
        margin-inline-start: 0.25em;
        font-weight: 400;
        vertical-align: baseline;
        opacity: 0.66;
      }


      @media (prefers-color-scheme: dark) {
        :is(h2, h3, h4, h5, h6) a:after {
          filter: invert(1);
        }
      }

      address,
      cite {
        font-style: normal;
      }

      address {
        background-color: var(--muted-accent);
        border-radius: 0.25em;
        display: inline-block;
        font-size: var(--text--1);
        font-weight: 500;
        margin-block-start: var(--space-0);
        padding: var(--space--2) var(--space--1);
      }

      address p {
        margin: 0;
      }

      cite {
        display: block;
        font-size: var(--text--1);
        margin-block: var(--space-0);
      }

      pre {
        max-inline-size: 100%;
        margin-block: var(--space-0);
        padding: var(--space--2);
        overflow-x: scroll;
        white-space: pre-wrap;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      code {
        font-family: var(--font-mono);
        font-size: 1.0625em;
      }

      pre code {
        font-size: 0.875em;
      }

      :not(pre, h1, h2, h3, aside *) > code {
        background: var(--muted-accent);
        border-radius: 0.25em;
        padding: 0.0625em 0.25em;
      }

      h3 > code {
        padding: 0;
      }

      figure:not(.table-wrapper) {
        border-radius: 0.25em 0 0 0;
        border-inline-start: 4px solid var(--muted-accent);
        padding-inline-start: var(--space-0);
      }

      figure:not(:first-of-type, .table-wrapper) {
        margin-block: var(--space-3);
      }

      figure:not(.table-wrapper) figcaption {
        background: var(--muted-accent);
        margin-block-start: 0;
        border-radius: 0 0.25em 0.25em 0;
        padding: var(--space--4);
        margin-inline-start: calc(var(--space-0) * -1);
        position: sticky;
        inset-block-start: var(--masthead-max-height);
        z-index: 1;
      }

      figcaption h3 {
        color: var(--accent);
        margin-block: 0;
      }

      dt {
        font-size: var(--text--1);
        font-weight: 500;
        margin-block-end: var(--space--5);
      }

      dt code {
        font-size: var(--text-0);
        font-weight: 650;
        word-break: break-all;
      }

      dd + dt {
        border-block-start: 1px solid var(--muted-accent);
        margin-block-start: var(--space-0);
        padding-block-start: var(--space-0);
      }

      dd {
        font-size: var(--text--1);
      }

      figure.table-wrapper {
        display: flex;
        margin-block: var(--space-0);
        overflow-x: scroll;
      }

      table {
        border: 1px solid var(--muted-accent);
        flex-grow: 1;
        font-size: var(--text--2);
        font-variant-numeric: tabular-nums;
        table-layout: fixed;
        inline-size: 100%;
      }

      th {
        text-align: start;
      }

      th code {
        font-size: 1.125em;
        padding: 0;
      }

      th,
      td:first-of-type {
        font-weight: 700;
      }

      th,
      td {
        padding: var(--space--4);
      }

      thead tr,
      tr:nth-of-type(even) {
        background-color: var(--muted-accent);
      }

      picture {
        margin-block: var(--space-0);
      }

      p {
        margin-block: 1em;
      }

      a {
        text-decoration: underline;
        text-underline-offset: 0.075em;
        text-decoration-skip-ink: all;
      }

      ol,
      ul {
        padding-inline-start: var(--space-0);
      }

      :not(li) > ol,
      :not(li) > ul {
        margin-block: 1em;
      }

      blockquote {
        border-color: var(--muted-accent);
        border-radius: 0.5em;
        border-style: solid;
        border-width: 1px 1px 4px 4px;
        padding-inline: var(--space-0);
      }

      #pagination {
        border-block-start: 4px solid var(--muted-accent);
        justify-content: ${next ? 'space-between' : 'center'};
      }

      #pagination a {
        background: var(--muted-accent);
        border-radius: 0.25em;
        padding: var(--space--2);
      }

    </style>

    ${display ? `<h1>${display}</h1>` : ''}

    <article>
      ${doc.html}
    </article>

    <nav id="pagination" class="mb5 pbs4 gap3 flex flex-col flex-row-lg">
      ${edit}
      ${next}
    </nav>

    <footer class="mbe5 p0 text-center text-1">
      aws-lite is an Apache 2.0-licensed open source project under the umbrella of <a href="https://arc.codes">OpenJS Foundation Architect</a>. aws-lite is not in any way affiliated with Amazon Web Services, Inc. (AWS). All names and trademarks are the property of their respective owners.
    </footer>
`
}
