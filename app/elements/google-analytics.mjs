export default function GA ({ html }) {
  const env = process.env.ARC_ENV
  if (env !== 'production') return ''
  return html`
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5YKNHWS9MH"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-5YKNHWS9MH');
  </script>
`
}
