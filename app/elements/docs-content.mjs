export default function docsContent ({ html, state }) {
  const { store } = state
  const { display, doc, isService = false } = store

  const standardH1 = `
    font-size: var(--text-3);
  `

  const serviceH1 = `
  `

  return html`
    <style>
      :host {
        display: block;
        padding: var(--space-0);
        --muted-accent: hsl(var(--accent-h) calc(var(--accent-s) / 10) calc(var(--accent-l) * 2.85));
      }

      @media screen and (prefers-color-scheme: dark) {
        :host {
          --muted-accent: hsl(var(--accent-h) calc(var(--accent-s) / 2) calc(var(--accent-l) / 2.75));
        }

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

      h2 {
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
        h2 { font-size: var(--text-3); }
        h3 { font-size: var(--text-2); }
        h4, h5, h6 { font-size: var(--text-1) }
      }

      :is(h1, h2, h3, h4, h5, h6) code {
        font-weight: 750;
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

      cite {
        display: block;
        font-size: var(--text--1);
        margin-block: var(--space-0);
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
        padding-inline: var(--space-0);
        padding-block: var(--space--4);
        margin-inline-start: calc(var(--space-0) * -1);
        position: sticky;
        inset-block-start: var(--masthead-max-height);
      }

      figcaption h3 {
        color: var(--accent);
        margin-block: 0;
      }

      a {
        text-decoration: underline;
        text-underline-offset: 0.075em;
        text-decoration-skip-ink: all;
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
      }
      
      pre code {
        font-size: 0.875em;
      }

      :not(pre, h1, h2, h3, dt) > code {
        background: var(--muted-accent);
        border-radius: 0.25em;
        padding: 0.125em 0.25em;
      }

      dt {
        border-block-end: 1px solid var(--muted-accent);
        font-size: var(--text--1);
        font-weight: 500;
        margin-block-end: var(--space--5);
        padding-block-end: var(--space--5);
      }

      dt code {
        font-size: var(--text-0);
        font-weight: 650;
        word-break: break-all;
      }

      dd + dt {
        margin-block-start: var(--space-2);
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

      p + p {
        margin-block-start: 1em;
      }
    </style>

    ${display ? `<h1>${display}</h1>` : ''}

    <article>
      ${doc.html}
    </article>
`
}
