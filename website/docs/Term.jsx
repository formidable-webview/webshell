import * as React from 'react';

const abbrMap = {
  hoc: 'Higher Order Component',
  dom: 'Document Object Model'
};

const hrefMap = {
  hoc: 'https://reactjs.org/docs/higher-order-components.html',
  viewport: 'https://developer.mozilla.org/en-US/docs/Glossary/Viewport',
  hooks: 'https://reactjs.org/docs/hooks-overview.html',
  dom:
    'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
  'messaging system':
    'https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native'
};

export const Term = ({ id, title }) => {
  const href = hrefMap[id && id.toLowerCase()];
  const long = abbrMap[id && id.toLowerCase()];
  const content =
    href === undefined ? `MISSING REFERENCE '${id}'` : title ? title : id;
  const Wrapper = (props) => (long ? <abbr {...props} /> : <span {...props} />);
  return (
    <strong>
      <Wrapper title={long ? long : undefined}>
        <a className="term" title={long ? long : null} href={href}>
          {content}
        </a>
      </Wrapper>
    </strong>
  );
};
