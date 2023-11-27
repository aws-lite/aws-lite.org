import { getStyles }  from '@enhance/arc-plugin-styles'
import SyntaxTheme from './lib/syntax-theme.mjs'

const { linkTag } = getStyles

const meta = {
  title: 'aws-lite',
  description: 'A simple, fast, extensible AWS client',
  image: '/_public/img/aws-lite-open-graph.png',
}

export default function Head (state) {
  const title = state.store.doc?.frontmatter?.title
  const description = state.store.doc?.frontmatter?.description || ''
  const { req } = state

  return /* html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title ? title + ' - ' : ''}aws-lite</title>
      ${linkTag()}
      <link rel="icon" href="/_public/img/favicon.svg">

      <!-- Open Graph -->
      <meta name="og:title" content="${meta.title}" />
      <meta name="og:description" content="${meta.description}" />
      <meta name="og:image" content="${meta.image}" />
      <meta name="og:url" content="https://aws-lite.org${req.path}" />
      <meta name="og:site_name" content="AWS Lite" />
      <meta name="og:type" content="website" />

      <meta property="og:title" content="${meta.title}" />
      <meta property="og:description" content="${meta.description}" />
      <meta property="og:image" content="${meta.image}" />
      <meta property="og:url" content="https://aws-lite.org${req.path}" />
      <meta property="og:site_name" content="AWS Lite" />
      <meta property="og:type" content="website" />

      <!-- Twitter -->
      <meta name="twitter:title" content="${meta.title}" />
      <meta name="twitter:description" content="${meta.description}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image:src" content="${meta.image}" />

      <meta name="description" content="${description}">
      <style>
        @font-face {
          font-family: "Montserrat";
          src: url("https://fonts.begin.com/montserrat/montserrat-subset-var.woff2") format("woff2-variations");
          font-weight: 100 900;
        }

        @font-face {
          font-family: "Montserrat";
          src: url("https://fonts.begin.com/montserrat/montserrat-italic-subset-var.woff2") format("woff2-variations");
          font-weight: 400 900;
          font-style: italic;
        }

        @font-face {
          font-family: "Source Code";
          src: url("/_public/fonts/SourceCodeVF.otf.woff2") format("woff2-variations");
          font-weight: 400 700;
        }

        html,
        body {
          font-family: Montserrat, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          text-rendering: optimizeLegibility;
          font-weight: 450;
        }

        html {
          scroll-padding: calc(var(--masthead-max-height) + var(--space-1));
        }

        @media (prefers-reduced-motion: no-preference) {
          html {
            scroll-behavior: smooth;
          }
        }

        body {
          background-color: var(--back);
          color: var(--fore);
          margin-block-start: var(--masthead-max-height);
        }

        :root {
          --muted-accent: hsl(var(--accent-h) calc(var(--accent-s) / 10) calc(var(--accent-l) * 2.85));
        }

        @media screen and (prefers-color-scheme: dark) {
          :root {
            --muted-accent: hsl(var(--accent-h) calc(var(--accent-s) / 2) calc(var(--accent-l) / 2.75));
          }

          body {
            font-weight: 400;
          }
        }

        .clip {
          clip: rect(1px, 1px, 1px, 1px);
          clip-path: inset(50%);
          height: 1px;
          width: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
        }

        ${SyntaxTheme()}
      </style>
    </head>
    <body class="leading4">
`
}
