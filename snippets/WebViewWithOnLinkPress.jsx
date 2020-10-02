import * as React from 'react';
import { Linking } from 'react-native';
import makeWebshell from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
import { HandleLinkPressFeature } from './HandleLinkPressFeature';
const Webshell = makeWebshell(
  WebView,
  new HandleLinkPressFeature()
);
export function WebViewWithOnLinkPress(props) {
  const onLinkPress = React.useCallback((target) => {
    Linking.openURL(target.uri);
  }, []);
  return (
    <Webshell onDOMLinkPress={onLinkPress} {...props} />
  );
}
