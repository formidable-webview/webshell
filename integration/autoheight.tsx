import React, { ComponentProps } from 'react';
import makeWebshell, {
  handleHTMLDimensionsFeature,
  forceResponsiveViewportFeature,
  forceElementSizeFeature,
  useAutoheight
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  handleHTMLDimensionsFeature.assemble(),
  forceResponsiveViewportFeature.assemble({ maxScale: 2 }),
  forceElementSizeFeature.assemble({ target: 'body' })
);

export type WebshellProps = ComponentProps<typeof Webshell>;

export default function AutoheightWebView(webshellProps: WebshellProps) {
  const { autoheightWebshellProps } = useAutoheight({ webshellProps });
  return <Webshell {...autoheightWebshellProps} />;
}
