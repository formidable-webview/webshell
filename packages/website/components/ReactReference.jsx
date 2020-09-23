import React from 'react';

const hrefMap = {
  webview: 'https://github.com/react-native-community/react-native-webview',
  scrollview: 'https://reactnative.dev/docs/scrollview',
  linking: 'https://reactnative.dev/docs/linking',
  __dev__: 'https://reactnative.dev/docs/javascript-environment.html'
};

export const ReactReference = ({ name, type }) => {
  const href = hrefMap[name && name.toLowerCase()];
  const content = href ? name : `MISSING REFERENCE FOR ${name}`;
  return (
    <a className={`api-ref api-symbol ${type}`} href={href}>
      {content}
    </a>
  );
};

export const WebView = () => <ReactReference name="WebView" type="class" />;
