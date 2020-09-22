import React, { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  HandleLinkPressFeature,
  HandleHTMLDimensionsFeature
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
const Webshell = makeWebshell(
  WebView,
  new HandleLinkPressFeature({ preventDefault: true }),
  new HandleHTMLDimensionsFeature()
);
export default function NaiveAutoheightWebView(webViewProps) {
  const [size, setSize] = useState(null);
  const onLinkPress = useCallback((target) => {
    Linking.canOpenURL(target.uri) && Linking.openURL(target.uri);
  }, []);
  const onHTMLDimensions = useCallback(
    ({ content: { height, width } }) => setSize({ width, height }),
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
