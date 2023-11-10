export default function docsContent (params) {
  const { html, state } = params
  const { display, doc } = state.store
  return html`
<p>${display}</p>
${doc.html}
`
}
