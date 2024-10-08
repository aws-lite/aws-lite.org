export default function SiteHeader({ html }) {

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
          /* burger icon */
          content: url("data:image/svg+xml;utf8,<svg width='24px' height='24px' stroke-width='2' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' color='white'><path d='M3 5H21' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path><path d='M3 12H21' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path><path d='M3 19H21' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg> ");
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: end;
          inline-size: 2.75em;
          aspect-ratio: 22 / 21;
          translate: 0 2px;
        }

        #mobile-menu-toggle:checked ~ label[for="mobile-menu-toggle"] figure:after {
          /* close icon */
          content: url("data:image/svg+xml;utf8,<svg width='24px' height='24px' stroke-width='2' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' color='white'><path d='M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg>");
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

      <div class="mis-auto flex align-items-center">
        <!-- GitHub -->
        <a href="https://github.com/aws-lite/aws-lite" class="p-2">
          <span class="clip opacity-0">GitHub</span>
          <svg height="22" width="22" viewBox="0 0 32 32" fill="white"><path fill-rule="evenodd" d="M15.999 0C7.164 0 0 7.345 0 16.405c0 7.248 4.584 13.397 10.942 15.566.8.151 1.092-.356 1.092-.79 0-.39-.013-1.422-.021-2.79-4.45.99-5.39-2.2-5.39-2.2-.728-1.895-1.777-2.4-1.777-2.4-1.452-1.017.11-.997.11-.997 1.606.116 2.451 1.691 2.451 1.691 1.427 2.507 3.745 1.783 4.657 1.363.145-1.06.559-1.783 1.015-2.193-3.552-.413-7.288-1.821-7.288-8.108 0-1.79.624-3.256 1.647-4.402-.165-.415-.714-2.083.158-4.341 0 0 1.342-.441 4.399 1.682A14.97 14.97 0 0116 7.933c1.36.007 2.728.188 4.006.553 3.055-2.123 4.395-1.682 4.395-1.682.874 2.258.325 3.926.16 4.341 1.026 1.146 1.645 2.612 1.645 4.402 0 6.303-3.741 7.69-7.305 8.095.574.507 1.085 1.508 1.085 3.039 0 2.192-.02 3.962-.02 4.5 0 .438.29.949 1.1.789C27.42 29.796 32 23.65 32 16.405 32 7.345 24.836 0 15.999 0"></path></svg>
        </a>


        <!-- Mobile menu toggle -->
        <input
          type="checkbox"
          role="button"
          aria-haspopup="true"
          id="mobile-menu-toggle"
          name="mobile menu toggle"
          class="clip opacity-0 hidden-lg"
          autocomplete="off"
        />
        <label
          for="mobile-menu-toggle"
          class="hidden-lg"
        >
          <figure aria-hidden="true"></figure>
          <span class="clip">Site navigation</span>
          <span class="clip expanded">expanded</span>
          <span class="clip collapsed">collapsed</span>
        </label>

        <site-nav class="fixed inset-i-0 overflow-y-scroll leading4 hidden-lg"></site-nav>
      </div>

    </header>
  `
}

