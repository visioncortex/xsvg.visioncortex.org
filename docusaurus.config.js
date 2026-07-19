// @ts-check
const path = require('path');
const { themes } = require('prism-react-renderer');

// @visioncortex/xsvg-viewer declares only an `import` export condition. Webpack's
// server (SSR) compilation resolves with node/require conditions and can't find the
// entry via the exports field — so add `import` to conditionNames and alias the
// subpaths we use straight to their ESM dist. The module is only ever *executed*
// client-side (inside BrowserOnly / useEffect); this just lets webpack locate the
// files for both the client and server compilations.
function xsvgViewerAlias() {
  const pkg = 'node_modules/@visioncortex/xsvg-viewer/dist';
  return {
    name: 'xsvg-viewer-alias',
    configureWebpack(_config, isServer) {
      return {
        resolve: {
          conditionNames: ['import', '...'],
          alias: {
            '@visioncortex/xsvg-viewer/react$': path.resolve(__dirname, `${pkg}/react.js`),
            '@visioncortex/xsvg-viewer$': path.resolve(__dirname, `${pkg}/index.js`),
          },
        },
      };
    },
  };
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'xsvg',
  tagline: 'eXtensible SVG — the text layout, live diagrams & mesh gradients SVG never shipped',
  url: 'https://xsvg.visioncortex.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.svg',
  organizationName: 'visioncortex',
  projectName: 'xsvg',
  trailingSlash: true,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: false,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  plugins: [xsvgViewerAlias],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarCollapsed: false,
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/visioncortex/xsvg.visioncortex.org/edit/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.8,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'xsvg',
        logo: {
          alt: 'xsvg logo',
          src: 'img/favicon.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/playground/',
            label: 'Playground',
            position: 'left',
          },
          {
            to: '/examples/',
            label: 'Examples',
            position: 'left',
          },
          {
            href: 'https://www.npmjs.com/package/@visioncortex/xsvg-viewer',
            label: 'npm',
            position: 'right',
          },
          {
            href: 'https://github.com/visioncortex/xsvg',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'What is xsvg?', to: '/docs/introduction/what-is-xsvg/' },
              { label: 'Getting started', to: '/docs/getting-started/installation/' },
              { label: 'Text layout', to: '/docs/text-layout/overview/' },
              { label: 'Full reference', to: '/docs/reference/element-index/' },
            ],
          },
          {
            title: 'Try it',
            items: [
              { label: 'Playground', to: '/playground/' },
              { label: 'Examples gallery', to: '/examples/' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'GitHub', href: 'https://github.com/visioncortex/xsvg' },
              { label: 'npm — viewer', href: 'https://www.npmjs.com/package/@visioncortex/xsvg-viewer' },
              { label: 'npm — compile', href: 'https://www.npmjs.com/package/@visioncortex/xsvg-compile' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} visioncortex.org`,
      },
      prism: {
        theme: themes.vsLight,
        darkTheme: themes.vsDark,
        additionalLanguages: ['rust', 'toml', 'yaml', 'bash', 'markup-templating', 'json'],
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
    }),
};

module.exports = config;
