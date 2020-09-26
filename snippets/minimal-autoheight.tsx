import React, { ComponentProps } from 'react';
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  useAutoheight
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature()
);

export type WebshellProps = ComponentProps<typeof Webshell>;

export default function MinimalAutoheightWebView(
  webshellProps: WebshellProps
) {
  const { autoheightWebshellProps } = useAutoheight({
    webshellProps
  });
  return <Webshell {...autoheightWebshellProps} />;
}
