export default function docsContent (params) {
  const { html, state } = params
  const { display, doc } = state.store
  return html`
    <style>
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        line-height: 1.25;
        margin-block: 1em;
        word-break: break-all;
      }

      h1 {
        font-weight: 700;
        letter-spacing: -0.025em;
      }

      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: 600;
        letter-spacing: -0.0125em;
      }

      h1 { font-size: var(--text-3) }
      h2 { font-size: var(--text-2) }
      h3 { font-size: var(--text-1) }
      h4, h5, h6 { font-size: var(--text-0) }

      a {
        text-decoration: underline;
      }

      pre {
        background: #2d2d2d;
        color: #d2d2d2;
        max-inline-size: 100%;
        margin-block: var(--space-0);
        padding: var(--space--2);
        overflow-x: scroll;
      }
    </style>
    <p>${display}</p>
    ${doc.html}
`
}
