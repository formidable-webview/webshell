const { typedocSidebar } = require('./typedoc-sidebars');

module.exports = {
  someSidebar: {
    Webshell: ['introduction', 'basic-concepts', 'minimal-example'],
    Guides: ['autoheight', 'features'],
    'Advanced Guides': ['implementing-features', 'tooling'],
    API: typedocSidebar,
    Docusaurus: ['mdx', 'markdown']
  }
};
