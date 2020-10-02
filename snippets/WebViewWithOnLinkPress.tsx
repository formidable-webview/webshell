import * as React from 'react';
import { Linking } from 'react-native';
import makeWebshell from '@formidable-webview/webshell';
import WebView, {
  WebViewProps
} from 'react-native-webview';
import {
  HandleLinkPressFeature,
  LinkPressTarget
} from './HandleLinkPressFeature';

const Webshell = makeWebshell(
  WebView,
  new HandleLinkPressFeature()
);

export function WebViewWithOnLinkPress(
  props: WebViewProps
) {
  const onLinkPress = React.useCallback(
    (target: LinkPressTarget) => {
      Linking.openURL(target.uri);
    },
    []
  );
  return (
    <Webshell onDOMLinkPress={onLinkPress} {...props} />
  );
}
