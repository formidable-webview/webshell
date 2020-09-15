const { typedocSidebar } = require('./typedoc-sidebars');

module.exports = {
  someSidebar: {
    Guides: [
      'introduction',
      'basic-concepts',
      'autoheight',
      'implementing-features',
      'features'
    ],
    API: typedocSidebar,
    Docusaurus: ['mdx', 'markdown']
  }
};
