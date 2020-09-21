import * as React from 'react';

const hrefMap = {
  webview: 'https://github.com/react-native-community/react-native-webview',
  scrollview: 'https://reactnative.dev/docs/scrollview.html',
  __dev__: 'https://reactnative.dev/docs/javascript-environment.html'
};

export const ReactReference = ({ name, type }) => {
  const href = hrefMap[name && name.toLowerCase()];
  const content = href ? name : `MISSING REFERENCE FOR ${name}`;
  return (
    <a className={`api-ref ${type}`} href={href}>
      {content}
    </a>
  );
};

export const WebView = () => <ReactReference name="WebView" type="class" />;
