const { typedocSidebar } = require('./typedoc-sidebars');

module.exports = {
  someSidebar: {
    Webshell: ['introduction', 'minimal-example'],
    Guides: ['autoheight', 'features', 'implementing-features', 'tooling'],
    'API Reference': typedocSidebar,
    Docusaurus: ['mdx']
  }
};
