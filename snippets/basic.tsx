import React, { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  HandleLinkPressFeature,
  HandleHTMLDimensionsFeature
} from '@formidable-webview/webshell';
import type {
  HTMLDimensions,
  LinkPressTarget,
  DOMRectSize
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
import type { WebViewProps } from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  new HandleLinkPressFeature({ preventDefault: true }),
  new HandleHTMLDimensionsFeature()
);

export default function NaiveAutoheightWebView(
  webViewProps: WebViewProps
) {
  const [size, setSize] = useState<DOMRectSize | null>(
    null
  );
  const onLinkPress = useCallback(
    (target: LinkPressTarget) => {
      Linking.canOpenURL(target.uri) &&
        Linking.openURL(target.uri);
    },
    []
  );
  const onHTMLDimensions = useCallback(
    ({ content: { height, width } }: HTMLDimensions) =>
      setSize({ width, height }),
    []
  );
  return (
    <Webshell
      onDOMLinkPress={onLinkPress}
      onDOMHTMLDimensions={onHTMLDimensions}
      {...webViewProps}
      style={[webViewProps.style, size]}
    />
  );
}
