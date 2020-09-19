import React, { ComponentProps } from 'react';
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
  new ForceResponsiveViewportFeature({ maxScale: 2 }),
  new ForceElementSizeFeature({
    target: 'body',
    heightValue: 'auto',
    widthValue: 'auto'
  })
);

export type WebshellProps = ComponentProps<typeof Webshell>;

export default function ResilientAutoheightWebView(
  webshellProps: WebshellProps
) {
  const { autoheightWebshellProps } = useAutoheight({ webshellProps });
  return <Webshell {...autoheightWebshellProps} />;
}
