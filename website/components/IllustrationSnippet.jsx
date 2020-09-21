import * as React from 'react';
import { CodeSourceBlock } from './CodeSource';

const snippetContent = `
const Webshell = makeWebshell(
  WebView,
  new HandleLinkPressFeature()
);

export default function AugmentedWebView(
  webViewProps
) {
  const onLinkPress = (target) => {
    Linking.openURL(target.uri);
  };
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
