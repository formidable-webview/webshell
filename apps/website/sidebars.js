const entries = [
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
  { type: 'doc', id: 'faq' },
  {
    type: 'category',
    label: 'API Reference',
    items: require('./typedoc-sidebars')
  }
];

if (process.env.NODE_ENV === 'development') {
  entries.push({ type: 'doc', id: 'mdx' });
}

module.exports = {
  someSidebar: entries
};
