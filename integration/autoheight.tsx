import React from 'react';
import makeWebshell, {
  handleHTMLDimensionsFeature,
  forceResponsiveViewportFeature,
  forceBodySizeFeature,
  useWebshellAutoheight
} from '@formidable-webview/webshell';
import WebView, { WebViewProps } from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  handleHTMLDimensionsFeature.assemble(),
  forceResponsiveViewportFeature.assemble({ maxScale: 2 }),
  forceBodySizeFeature.assemble()
);

export default function AutoheightWebView(webViewProps: WebViewProps) {
  const autoheightProps = useWebshellAutoheight(webViewProps);
  return <Webshell {...autoheightProps} />;
}
