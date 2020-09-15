import * as React from 'react';

const hrefMap = {
  hoc: 'https://reactjs.org/docs/higher-order-components.html',
  hooks: 'https://reactjs.org/docs/hooks-overview.html',
  dom:
    'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction'
};

export const Term = ({ id, title }) => {
  const href = hrefMap[id && id.toLowerCase()];
  const content =
    href === undefined ? `MISSING REFERENCE '${id}'` : title ? title : id;
  return (
    <strong>
      <a href={href}>{content}</a>
    </strong>
  );
};
