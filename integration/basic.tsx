import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  handleLinkPressFeature,
  handleHTMLDimensionsFeature,
  HTMLDimensions
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  handleLinkPressFeature.assemble({ preventDefault: true }),
  handleHTMLDimensionsFeature.assemble()
);

export default function EnhancedWebView(webViewProps) {
  const onLinkPress = useCallback((url: string) => Linking.openURL(url), []);
  const onBodyDimensions = useCallback(
    ({ layoutViewport: { width, height } }: HTMLDimensions) =>
      console.info(width, height),
    []
  );
  const onError = useCallback((featureIdentifier, errorMessage) => {
    if (featureIdentifier === handleLinkPressFeature.featureIdentifier) {
      // Handle linkPress error
      console.error(errorMessage);
    } else if (
      featureIdentifier === handleHTMLDimensionsFeature.featureIdentifier
    ) {
      // Handle dimensions error
      console.error(errorMessage);
    }
  }, []);
  return (
    <Webshell
      onDOMLinkPress={onLinkPress}
      onDOMElementDimensions={onBodyDimensions}
      onDOMError={onError}
      {...webViewProps}
    />
  );
}
