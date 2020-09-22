const { typedocSidebar } = require('./typedoc-sidebars');

module.exports = {
  someSidebar: [
    {
      type: 'category',
      label: 'Webshell',
      items: ['introduction', 'getting-started']
    },
    {
      type: 'category',
      label: 'Guides',
      items: ['autoheight', 'implementing-features', 'tooling']
    },
    { type: 'doc', id: 'features' },
    { type: 'category', label: 'API Reference', items: typedocSidebar },
    { type: 'doc', id: 'mdx' }
  ]
};
