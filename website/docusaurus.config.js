const path = require('path');
const prettierOptions = require('../.prettierrc.js');

const discordInvite = 'https://discord.gg/XV3zt3d';

module.exports = {
  title: 'webshell',
  tagline: 'Craft React Native WebView-based components with ease.',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: '@formidable-webview', // Usually your GitHub org/user name.
  projectName: 'webshell', // Usually your repo name.
  themeConfig: {
    announcementBar: {
      id: '_disclaimer!',
      content:
        '&#9888; This documentation is for the yet unstable V2 of @formidable-webview/webshell. Disclaimer: it is a work in progress!',
      backgroundColor: '#ffba00',
      textColor: 'black',
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
          href: 'https://github.com/formidable-webview/webshell',
          label: 'GitHub',
          position: 'right'
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
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/'
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/'
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
        inputFiles: ['../types'],

        // docs directory relative to the site directory (defaults to docs).
        docsRoot: 'docs',

        // output directory relative to docs directory - use '' for docs root (defaults to 'api').
        out: 'api',

        // Skip updating of sidebars.json (defaults to false).
        skipSidebar: false,
        sidebarFile: 'typedoc-sidebars.js',

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
        categoryOrder: ['Functions', 'Variables', '*']
      }
    ],
    [
      path.resolve(__dirname, 'inject-snippets-plugin.js'),
      {
        snippetsPath: './static/snippets',
        includes: ['../integration/*.ts?(x)', '../integration/*.webjs'],
        prettierOptions: prettierOptions
      }
    ]
  ]
};
