import * as React from 'react';
import { CodeSourceBlock } from './CodeSource';

const snippetContent = `const Webshell = makeWebshell(
  WebView,
  new HandleLinkPressFeature()
);

const onLinkPress = (target) => {
  Linking.openURL(target.uri);
};

export default function AugmentedWebView(
  webViewProps
) {
  return (
    <Webshell
      onDOMLinkPress={onLinkPress}
      {...webViewProps}
    />
  );
}
`;

export const IllustrationSnippet = () => (
  <CodeSourceBlock lang="jsx" content={snippetContent} />
);
