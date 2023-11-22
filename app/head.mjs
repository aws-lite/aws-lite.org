import { getStyles }  from '@enhance/arc-plugin-styles'
import SyntaxTheme from './lib/syntax-theme.mjs'

const { linkTag } = getStyles

export default function Head () {
  return /* html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>aws-lite</title>
      ${linkTag()}
      <!-- <link rel="icon" href="/_public/favicon.svg"> -->
      <meta name="description" content="">
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
        }

        ${SyntaxTheme()}
      </style>
    </head>
    <body class="leading4">
`
}
