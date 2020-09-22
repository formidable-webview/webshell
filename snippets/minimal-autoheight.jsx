import React from 'react';
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  useAutoheight
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
const Webshell = makeWebshell(WebView, new HandleHTMLDimensionsFeature());
export default function MinimalAutoheightWebView(webshellProps) {
  const { autoheightWebshellProps } = useAutoheight({ webshellProps });
  return <Webshell {...autoheightWebshellProps} />;
}
