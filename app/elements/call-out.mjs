export default function CallOut ({ html, state }) {
  const { attrs } = state
  const { title } = attrs

  return html`
    <style>
      :host {
        display: block;
        background: var(--muted-accent);
        border-radius: 0.5em;
      }

      aside p {
        margin: 0;
      }
    </style>
    <aside class="p0">
      <h2 class="font-bold mbe-4">${title}</h3>
      <div class="text-1">
        <slot></slot>
      </div>
    </aside>
  `
}
