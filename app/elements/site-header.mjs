export default function SiteMasthead ({ html }) {
  return html`
    <style>
      begin-masthead {
        --inline-padding: var(--space-0);
        --max-inline-size: var(--site-max-width);
      }
    </style>
    <begin-masthead product="awslite" breakpoint="52em" active="products">
      <span slot="product-page">Docs</span>
      <site-nav slot="product-nav"></site-nav>
      <div slot="product-nav-lg" class="flex align-items-center">
        <masthead-product-link active href="/">Docs</masthead-product-link>
      </div>
    </begin-masthead>
  `
}
