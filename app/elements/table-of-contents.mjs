export default function TableOfContents ({ html, state }) {
  const { store = {} } = state
  const { doc = {} } = store
  const { tocHtml = '' } = doc

  return html `
    <style>
      :host {
        display: block;
        padding-block: var(--space-0);
        padding-inline-end: var(--space-0);
        position: sticky;
        inset-block-start: var(--masthead-max-height);
      }

      ol {
        font-size: var(--text--1);
        list-style: none;
      }

      li {
        padding-inline-start: 0;
        padding-block-end: var(--space--5);
      }

      li li {
        padding-inline-start: var(--space--2);
      }

      a {
        color: var(--accent);
        text-decoration: none;
      }
    </style>
    <aside>
      <h6 class="font-semibold mbe0">On this page</h6>
      ${tocHtml}
    </aside>
  `
}
