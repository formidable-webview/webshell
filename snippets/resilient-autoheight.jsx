import React from 'react';
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  ForceResponsiveViewportFeature,
  ForceElementSizeFeature,
  useAutoheight
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
  new ForceResponsiveViewportFeature({ maxScale: 1 }),
  new ForceElementSizeFeature({
    target: 'body',
    heightValue: 'auto',
    widthValue: 'auto'
  })
);
export default function ResilientAutoheightWebView(webshellProps) {
  const { autoheightWebshellProps } = useAutoheight({ webshellProps });
  return <Webshell {...autoheightWebshellProps} />;
}
