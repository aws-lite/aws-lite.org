export default function CalloutsWrapper ({ html }) {
  return html`
    <style>
      :host {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(max(33%, 200px), 1fr));
        gap: var(--space-0);
        margin-block: var(--space-4);
      }
    </style>
    <slot></slot>
  `
}
