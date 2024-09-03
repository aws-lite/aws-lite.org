export default function SiteHeader ({ html }) {

  return html`
    <style scope="global">
      :root {
        --nav-height: 4em;
      }

      @media (width < 52em) {
        body:has(#mobile-menu-toggle:checked) main {
          filter: blur(10px) contrast(0.66);
          backdrop-filter: brightness(1.5);
        }
      }
    </style>

    <style>
      :host {
        background-color: var(--accent);
        display: block;
        position: fixed;
        inset-block-start: 0;
        inset-inline: 0;
        z-index: 4;
      }

      header {
        max-inline-size: var(--site-max-width);
        block-size: var(--nav-height);
      }

      aws-lite-logo svg {
        color: white;
        block-size: 1.5em;
      }

      @media screen and (min-width: 52em){
        /* On larger screens, use a semitransparent, tinted, blurred background */
        /* We don't do this on smaller screens because the stacked mobile menu inheriting
         * the background/backdrop filter is broken in Chrome (their bug) and glitchy on Safari + FF */
        :host {
          background-color: color-mix(in srgb, var(--accent) 80%, transparent);
          backdrop-filter: blur(10px);
        }
      }

      /* Mobile menu + toggle UI */
      @media (width < 56em) {
        label[for="mobile-menu-toggle"] figure:after {
          content: url("data:image/svg+xml;utf8,<svg width='24px' height='24px' stroke-width='2' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' color='white'><path d='M3 5H21' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path><path d='M3 12H21' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path><path d='M3 19H21' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg> "); /* burger icon */
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: end;
          inline-size: 2.75em;
          aspect-ratio: 22 / 21;
        }

        #mobile-menu-toggle:checked ~ label[for="mobile-menu-toggle"] figure:after {
          content: url("data:image/svg+xml;utf8,<svg width='24px' height='24px' stroke-width='2' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' color='white'><path d='M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg>"); /* close icon */
        }

        #mobile-menu-toggle:checked ~ label .expanded { display: inline; }
        #mobile-menu-toggle:checked ~ label .collapsed { display: none; }
        #mobile-menu-toggle:not(:checked) ~ label .expanded { display: none; }
        #mobile-menu-toggle:not(:checked) ~ label .collapsed { display: inline; }

        #mobile-menu-toggle ~ site-nav {
          display: none;
        }

        #mobile-menu-toggle:checked ~ site-nav {
          display: block;
        }

        site-nav {
          background-color: var(--back);
          border-block-end: 1px solid var(--muted-accent);
          inset-block-start: var(--nav-height);
          max-block-size: 75dvh;
        }
      }
    </style>

    <header class="
      flex
      align-items-center
      gap0
      pi0
      mi-auto
      leading0
    ">
      <a href="/">
        <h1>
          <span class="screenreader-only">aws-lite</span>
          <aws-lite-logo></aws-lite-logo>
        </h1>
      </a>

      <!-- Mobile menu toggle -->
      <input
        type="checkbox"
        role="button"
        aria-haspopup="true"
        id="mobile-menu-toggle"
        name="mobile menu toggle"
        class="clip absolute opacity-0 hidden-lg"
        autocomplete="off"
      />
      <label
        for="mobile-menu-toggle"
        class="mis-auto hidden-lg"
      >
        <figure aria-hidden="true"></figure>
        <span class="clip">Site navigation</span>
        <span class="clip expanded">expanded</span>
        <span class="clip collapsed">collapsed</span>
      </label>

      <site-nav class="fixed inset-i-0 overflow-y-scroll leading4 hidden-lg"></site-nav>
    </header>
  `
}

