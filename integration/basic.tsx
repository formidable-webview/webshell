import React, { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  handleLinkPressFeature,
  handleHTMLDimensionsFeature,
  HTMLDimensions,
  LinkPressTarget,
  RectSize
} from '@formidable-webview/webshell';
import WebView, { WebViewProps } from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  handleLinkPressFeature.assemble({ preventDefault: true }),
  handleHTMLDimensionsFeature.assemble()
);

export default function NaiveAutoheightWebView(webViewProps: WebViewProps) {
  const [size, setSize] = useState<RectSize | null>(null);
  const onLinkPress = useCallback((target: LinkPressTarget) => {
    Linking.canOpenURL(target.uri) && Linking.openURL(target.uri);
  }, []);
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
