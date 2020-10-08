const path = require('path');
const prettierOptions = {
  ...require('../../.prettierrc.js'),
  printWidth: 60
};

const discordInvite = 'https://discord.gg/XV3zt3d';

const webshellPath = '../../packages/webshell';
const acceptancePath = '../../packages/acceptance-tests';

const webshellJson = require(path.resolve(webshellPath, 'package.json'));

module.exports = {
  title: 'webshell',
  tagline: 'Craft Robust React Native WebView-based components with ease.',
  url: 'https://formidable-webview.github.io',
  baseUrl: '/webshell/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'formidable-webview',
  projectName: 'webshell',
  themeConfig: {
    defaultMode: 'light',
    disableSwitch: false,
    respectPrefersColorScheme: true,
    announcementBar: {
      id: 'supportus',
      content:
        '⭐️ If you like webshell, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/formidable-webview/webshell">GitHub</a>! ⭐️',
      isCloseable: true
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
      darkTheme: require('prism-react-renderer/themes/dracula')
    },
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      hideOnScroll: true,
      title: 'webshell',
      logo: {
        alt: 'Formidable WebView Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left'
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href:
            'https://github.com/formidable-webview/webshell/blob/master/packages/webshell/CHANGELOG.MD',
          label: 'Changelog',
          position: 'left'
        },
        {
          href: `https://github.com/formidable-webview/webshell/releases/tag/v${webshellJson.version}`,
          label: webshellJson.version,
          position: 'right'
        },
        {
          href: 'https://github.com/formidable-webview/webshell',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guides',
          items: [
            {
              label: 'Autoheight WebView',
              to: 'docs/autoheight'
            },
            {
              label: 'Implementing Features',
              to: 'docs/implementing-features'
            },
            {
              label: 'Tooling',
              to: 'docs/tooling'
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/webshell'
            },
            {
              label: 'Discord',
              href: discordInvite
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog'
            },
            {
              label: 'GitHub',
              href: 'https://github.com/formidable-webview/webshell'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jules Sam. Randolph`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/formidable-webview/webshell/tree/master/apps/website/docs',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/formidable-webview/webshell/tree/master/apps/website/blog'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        // list of input files relative to project (required).
        inputFiles: [path.join(webshellPath, '/types')],

        // docs directory relative to the site directory (defaults to docs).
        docsRoot: 'docs',

        // output directory relative to docs directory - use '' for docs root (defaults to 'api').
        out: 'api',
        sidebar: {
          sidebarFile: 'typedoc-sidebars.js',
          globalsLabel: 'Summary'
        },

        // Pass in any additional Typescript/TypeDoc options (see typedoc --help).
        mode: 'file',
        target: 'ES5',
        includeDeclarations: true,
        excludeExternals: true,
        tsconfig: '../tsconfig.json',
        ignoreCompilerErrors: true,
        readme: 'none',
        disableSources: true,
        includeVersion: false,
        categoryOrder: ['Functions', 'Variables', '*'],
        allReflectionsHaveOwnDocument: true
      }
    ],
    [
      path.resolve(__dirname, 'inject-snippets-plugin.js'),
      {
        snippetsPath: './static/snippets',
        includes: [
          path.join(acceptancePath, '/src/*.ts?(x)'),
          path.join(acceptancePath, '/src/*.webjs')
        ],
        prettierOptions: prettierOptions
      }
    ]
  ]
};
