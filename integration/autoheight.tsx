import React from 'react';
import makeWebshell, {
  handleHTMLDimensionsFeature,
  forceResponsiveViewportFeature,
  forceBodySizeFeature,
  useWebshellAutoheight
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  handleHTMLDimensionsFeature.assemble({ forceLegacy: true }),
  forceResponsiveViewportFeature.assemble({ maxScale: 2 }),
  forceBodySizeFeature.assemble()
);

export default function AutoheightWebView(webViewProps) {
  const autoheightWebViewProps = useWebshellAutoheight(webViewProps);
  return <Webshell {...autoheightWebViewProps} />;
}
